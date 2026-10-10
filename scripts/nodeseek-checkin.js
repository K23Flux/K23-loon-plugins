/*
 * NodeSeek 自动签到（Loon）
 * 作者：K23Flux
 * 仓库：https://github.com/K23Flux/K23-loon-plugins
 *
 * 同一个脚本两种用法，由插件 plugins/nodeseek.lpx 调用：
 *   1. http-request：登录状态下打开 www.nodeseek.com，自动保存 Cookie 和 User-Agent
 *   2. cron：每天在设定的那一小时里随机挑一分钟，用保存的 Cookie 去签到。
 *      插件让它在那一小时内每分钟触发一次，另外每两小时再触发一次用来补签；
 *      脚本自己记着当天的随机时间和是否签过，没到时间或已签过就直接退出。
 *
 * Cookie 只保存在本机 Loon 的持久化存储里，不会上传到任何地方。
 *
 * Telegram 推送（可选）：在插件设置里填了 Bot Token 和 Chat ID 后，签到结果除了本机通知，
 * 还会通过你自己的机器人发到 Telegram。两项只存在本机 Loon 的插件设置里，不在仓库里。
 */

const NAME = "NodeSeek 签到";
const KEY_COOKIE = "k23_nodeseek_cookie";
const KEY_UA = "k23_nodeseek_ua";
const KEY_STATE = "k23_nodeseek_checkin_state";
const HOME = "https://www.nodeseek.com";
const DEFAULT_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

// 插件参数：开关可能是布尔值，也可能是 "true"/"false" 字符串
const args = typeof $argument === "object" && $argument !== null ? $argument : {};
function flag(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).toLowerCase() === "true";
}
const RANDOM = flag(args.random, true);
// 签到时段：从这个整点开始的一小时内随机挑一分钟签到（按手机本地时间，默认 8 点）
const HOUR = /^\d{1,2}$/.test(String(args.hour)) && Number(args.hour) < 24 ? Number(args.hour) : 8;
// 签到请求指定走的策略组或节点；留空（或参数没被替换）就按分流规则走
const POLICY = typeof args.policy === "string" && !/^\{.*\}$/.test(args.policy.trim()) ? args.policy.trim() : "";
// Telegram 推送：两项都填了才发；没填（或参数没被替换）就只发本机通知
function textArg(value) {
  const text = typeof value === "string" ? value.trim() : "";
  return /^\{.*\}$/.test(text) ? "" : text;
}
const TG_TOKEN = textArg(args.tgToken);
const TG_CHAT = textArg(args.tgChat);
const MAX_FAILS = 4; // 一天最多失败这么多次就不再试
const RETRY_MINUTES = 30; // 失败后隔多久再试

function notify(subtitle, body) {
  $notification.post(NAME, subtitle, body || "");
}

// 把一条结果发到 Telegram，发完（不管成功失败）调用 done。推送失败只记日志，不影响签到结果
function pushTelegram(subtitle, body, done) {
  if (!TG_TOKEN || !TG_CHAT) return done();
  const request = {
    url: `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TG_CHAT, text: `${NAME}\n${subtitle}${body ? "\n" + body : ""}` }),
    timeout: 8000,
  };
  $httpClient.post(request, (error, response, data) => {
    const status = response && response.status;
    if (error || status !== 200) {
      console.log(`[${NAME}] Telegram 推送失败：${error || "HTTP " + status + " " + String(data).slice(0, 200)}`);
    }
    done();
  });
}

// 本机通知 + Telegram 推送，都发完再结束脚本
function report(subtitle, body) {
  notify(subtitle, body);
  pushTelegram(subtitle, body, () => $done());
}

function header(headers, name) {
  const lower = name.toLowerCase();
  for (const key in headers || {}) {
    if (key.toLowerCase() === lower) return headers[key];
  }
  return "";
}

function sessionOf(cookie) {
  const m = /(?:^|;\s*)session=([^;]*)/.exec(cookie || "");
  return m ? m[1] : "";
}

if (typeof $request !== "undefined") {
  captureCookie();
} else {
  checkin();
}

// ---------- 获取 Cookie ----------
function captureCookie() {
  try {
    const cookie = header($request.headers, "Cookie");
    // 登录后才有 session，没登录的请求直接忽略
    if (cookie && /(^|;\s*)session=/.test(cookie)) {
      const ua = header($request.headers, "User-Agent");
      if (ua) $persistentStore.write(ua, KEY_UA);
      const saved = $persistentStore.read(KEY_COOKIE) || "";
      if (cookie !== saved) {
        $persistentStore.write(cookie, KEY_COOKIE);
        // 只有登录凭证 session 变了才通知，其他字段（如 cf_clearance）刷新时静默更新
        if (sessionOf(cookie) !== sessionOf(saved)) {
          notify(saved ? "Cookie 已更新" : "Cookie 获取成功", "之后每天会在设定的时段里随机时间自动签到");
        }
      }
    }
  } catch (e) {
    console.log(`[${NAME}] 获取 Cookie 出错：${e}`);
  }
  $done({});
}

// ---------- 签到 ----------
function pad(n) {
  return (n < 10 ? "0" : "") + n;
}

// 读当天的状态；换了一天或换了时段就重新抽一个随机分钟
function loadState(now) {
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  let state = null;
  try {
    state = JSON.parse($persistentStore.read(KEY_STATE) || "null");
  } catch (e) {}
  if (!state || state.date !== today || state.hour !== HOUR) {
    state = { date: today, hour: HOUR, minute: Math.floor(Math.random() * 60), done: false, fails: 0, retryAt: 0, noCookie: false };
    saveState(state);
  }
  return state;
}

function saveState(state) {
  $persistentStore.write(JSON.stringify(state), KEY_STATE);
}

function checkin() {
  const now = new Date();
  const state = loadState(now);
  const target = `${pad(state.hour)}:${pad(state.minute)}`;

  if (state.done) return $done();
  if (now.getHours() * 60 + now.getMinutes() < state.hour * 60 + state.minute) {
    console.log(`[${NAME}] 今天的签到时间是 ${target}，还没到`);
    return $done();
  }
  if (now.getTime() < state.retryAt) return $done();

  const cookie = $persistentStore.read(KEY_COOKIE);
  if (!cookie) {
    if (!state.noCookie) {
      state.noCookie = true;
      saveState(state);
      return report("还没有 Cookie", "先用 Safari 登录 www.nodeseek.com，看到「Cookie 获取成功」通知后会自动补签");
    }
    return $done();
  }

  const request = {
    url: `${HOME}/api/attendance?random=${RANDOM}`,
    headers: {
      Cookie: cookie,
      "User-Agent": $persistentStore.read(KEY_UA) || DEFAULT_UA,
      Origin: HOME,
      Referer: `${HOME}/board`,
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: "",
    timeout: 15000,
  };
  if (POLICY) request.node = POLICY;

  // 失败只在当天第一次通知，之后隔一段时间静默重试，免得刷屏
  function fail(subtitle, body) {
    state.fails += 1;
    state.retryAt = Date.now() + RETRY_MINUTES * 60 * 1000;
    if (state.fails >= MAX_FAILS) state.done = true;
    saveState(state);
    console.log(`[${NAME}] 第 ${state.fails} 次失败：${subtitle} ${body}`);
    if (state.fails === 1) return report(subtitle, `${body}（稍后会自动重试）`);
    $done();
  }

  $httpClient.post(request, (error, response, data) => {
    if (error) return fail("签到失败", `网络错误：${error}`);

    const status = response && response.status;
    let json = null;
    try {
      json = JSON.parse(data);
    } catch (e) {}
    console.log(`[${NAME}] HTTP ${status} ${typeof data === "string" ? data.slice(0, 300) : ""}`);

    if (json && json.success) {
      state.done = true;
      saveState(state);
      const gain = json.gain !== undefined ? `本次 +${json.gain} 鸡腿` : "";
      const current = json.current !== undefined ? `，当前共 ${json.current} 鸡腿` : "";
      return report("签到成功", gain || current ? `${gain}${current}` : json.message);
    }
    if (json && /已完成签到|重复/.test(json.message || "")) {
      // 今天已经签过（比如手动签了），记下来就行，不打扰
      state.done = true;
      saveState(state);
      return $done();
    }
    if (status === 401 || (json && /USER NOT FOUND|未登录|登录/i.test(json.message || ""))) {
      return fail("Cookie 已失效", "重新用 Safari 登录 www.nodeseek.com，会自动更新 Cookie");
    }
    if (!json && (status === 403 || status === 503)) {
      return fail("被 Cloudflare 拦截", "用 Safari 打开一次 www.nodeseek.com 通过验证；还不行就在插件里把「签到走的策略组」填成你访问 NodeSeek 用的那个");
    }
    fail("签到失败", (json && json.message) || `HTTP ${status}`);
  });
}
