const statuses = new Set(["pending", "approved", "rejected", "spam"]);
const articlePattern = /^\/(?:hi\/)?[\p{L}\p{M}\p{N}_-]+\/$/u;
const replyLimit = 1500;

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

async function digest(value) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

async function authorized(request, secret) {
  const auth = request.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ") || auth.length > 512) return false;
  const [given, expected] = await Promise.all([digest(auth.slice(7)), digest(secret)]);
  return crypto.subtle.timingSafeEqual(given, expected);
}

function field(data, key) {
  return typeof data[key] === "string" ? data[key].trim() : "";
}

export async function onRequest({ request, env }) {
  const db = env.COMMENTS_DB;
  const secret = env.COMMENTS_ADMIN_TOKEN;
  if (!db || !secret) return json({ error: "unavailable" }, 503);

  const url = new URL(request.url);
  const article = url.searchParams.get("article") || "";
  const admin = url.searchParams.get("admin") === "1";
  const method = request.method;

  try {
    if (admin && !(await authorized(request, secret))) return json({ error: "unauthorized" }, 401);
    if (!admin) {
      let decoded;
      try {
        decoded = decodeURI(article);
      } catch {
        return json({ error: "invalid_article" }, 400);
      }
      if (article.length > 2048 || !articlePattern.test(decoded) ||
          new URL(decoded, url.origin).pathname !== article) {
        return json({ error: "invalid_article" }, 400);
      }
    }
    if (method === "GET" && admin) {
      const status = url.searchParams.get("status") || "pending";
      if (!statuses.has(status)) return json({ error: "invalid_status" }, 400);
      const { results } = await db.prepare(
        "SELECT id, article, name, body, email, phone, created, status, reply FROM comments WHERE status = ? ORDER BY created DESC, id DESC LIMIT 50"
      ).bind(status).all();
      return json({ comments: results });
    }
    if (method === "GET") {
      const { results } = await db.prepare(
        "SELECT id, name, body, created, reply FROM comments WHERE article = ? AND status = 'approved' ORDER BY created DESC, id DESC LIMIT 50"
      ).bind(article).all();
      return json({ comments: results });
    }

    if (method !== "POST") return json({ error: "method" }, 405);
    if (request.headers.get("Origin") !== url.origin) return json({ error: "origin" }, 403);
    if (!/^application\/json(?:;|$)/i.test(request.headers.get("Content-Type") || "")) {
      return json({ error: "invalid" }, 415);
    }

    const reader = request.body?.getReader();
    if (!reader) return json({ error: "invalid" }, 400);
    let size = 0;
    let raw = "";
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 12000) {
        await reader.cancel();
        return json({ error: "invalid" }, 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    let data;
    try {
      data = JSON.parse(raw + decoder.decode());
    } catch {
      return json({ error: "invalid" }, 400);
    }
    if (!data || typeof data !== "object" || Array.isArray(data)) return json({ error: "invalid" }, 400);

    if (admin) {
      const id = field(data, "id");
      const action = field(data, "action");
      const reply = field(data, "reply");
      if (!/^[a-f0-9-]{36}$/.test(id) || reply.length > replyLimit) return json({ error: "invalid" }, 400);
      const queries = {
        approve: ["UPDATE comments SET status = 'approved' WHERE id = ?", id],
        reject: ["UPDATE comments SET status = 'rejected', email = '', phone = '' WHERE id = ?", id],
        spam: ["UPDATE comments SET status = 'spam', email = '', phone = '' WHERE id = ?", id],
        remove: ["DELETE FROM comments WHERE id = ?", id],
        reply: ["UPDATE comments SET reply = ? WHERE id = ? AND status = 'approved'", reply, id],
      };
      if (!Object.hasOwn(queries, action)) return json({ error: "invalid" }, 400);
      const [query, ...values] = queries[action];
      const result = await db.prepare(query).bind(...values).run();
      return result.meta.changes ? json({ saved: true }) : json({ error: "not_found" }, 404);
    }

    const name = field(data, "name");
    const body = field(data, "body");
    const email = field(data, "email");
    const phone = field(data, "phone");
    if (!name || name.length > 60 || !body || body.length > 1500 ||
        (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) ||
        (phone && (!/^\+?[\d ()-]{7,24}$/.test(phone) || phone.replace(/\D/g, "").length < 7 ||
          phone.replace(/\D/g, "").length > 15))) return json({ error: "invalid" }, 400);

    const indexPath = article.startsWith("/hi/") ? "/hi/index.json" : "/index.json";
    const indexResponse = await env.ASSETS.fetch(new Request(new URL(indexPath, url.origin)));
    if (!indexResponse.ok) return json({ error: "unavailable" }, 503);
    const index = await indexResponse.json();
    if (!index.some(entry => new URL(entry.permalink).pathname === article)) {
      return json({ error: "invalid_article" }, 400);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    const sender = Array.from(await digest(secret + "\n" + ip), b => b.toString(16).padStart(2, "0")).join("");
    const now = Date.now();
    const result = await db.prepare(
      "INSERT INTO comments (id, article, name, body, email, phone, sender, created) SELECT ?, ?, ?, ?, ?, ?, ?, ? WHERE (SELECT count(*) FROM comments WHERE sender = ? AND created > ?) < 5"
    ).bind(crypto.randomUUID(), article, name, body, email, phone, sender, now, sender, now - 900000).run();
    return result.meta.changes ? json({ pending: true }, 201) : json({ error: "rate_limit" }, 429);
  } catch {
    return json({ error: "unavailable" }, 503);
  }
}
