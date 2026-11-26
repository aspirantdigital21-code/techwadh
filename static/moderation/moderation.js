const access = document.querySelector("#access");
const queue = document.querySelector("#queue");
const filter = document.querySelector("#filter");
const items = document.querySelector("#items");
const message = document.querySelector("#message");
let token = "";
let requestVersion = 0;
const articleIndexes = new Map();

async function loadArticleTitles(path) {
  if (articleIndexes.has(path)) return articleIndexes.get(path);
  try {
    const response = await fetch(path);
    if (!response.ok) return new Map();
    const articles = await response.json();
    const titles = new Map(articles.map(article => [new URL(article.permalink).pathname, article.title]));
    articleIndexes.set(path, titles);
    return titles;
  } catch {
    return new Map();
  }
}

async function api(currentToken, action) {
  return fetch("/api/comments?admin=1&status=" + encodeURIComponent(filter.value), {
    method: action ? "POST" : "GET",
    headers: {
      Authorization: "Bearer " + currentToken,
      ...(action && { "Content-Type": "application/json" }),
    },
    ...(action && { body: JSON.stringify(action) }),
  });
}

function add(parent, tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  parent.append(node);
  return node;
}

function render(entry, title) {
  const card = add(items, "article", "");
  const heading = add(card, "h2", "");
  const link = add(heading, "a", title || entry.article);
  link.href = entry.article;

  const details = add(card, "dl", "");
  details.className = "comment-details";
  for (const [label, value] of [
    ["Status", entry.status],
    ["Name or nickname", entry.name],
    ["Comment", entry.body],
    ["Email (private)", entry.email || "Not provided or no longer saved"],
    ["Mobile number (private)", entry.phone || "Not provided or no longer saved"],
  ]) {
    add(details, "dt", label);
    add(details, "dd", value);
  }

  let reply;
  if (entry.status === "approved") {
    const label = add(card, "label", "TechWadh reply");
    reply = add(label, "textarea", entry.reply);
    reply.maxLength = 1500;
  }
  const actions = add(card, "div", "");
  actions.className = "actions";
  const choices = {
    pending: [["approve", "Approve"], ["reject", "Reject"], ["spam", "Mark spam"]],
    approved: [["reply", "Save reply"], ["reject", "Unpublish"]],
    rejected: [["approve", "Approve"]],
    spam: [],
  };
  for (const [action, label] of [...choices[entry.status], ["remove", "Delete"]]) {
    const button = add(actions, "button", label);
    button.addEventListener("click", async () => {
      if (action === "remove" && !confirm("Permanently delete this comment?")) return;
      const usingToken = token;
      button.disabled = true;
      try {
        const response = await api(usingToken, { id: entry.id, action, reply: reply?.value });
        if (!response.ok) throw new Error();
        if (usingToken === token) await refresh();
      } catch {
        if (usingToken === token) message.textContent = "Could not save this change.";
      } finally {
        button.disabled = false;
      }
    });
  }
}

async function refresh() {
  const version = ++requestVersion;
  const usingToken = token;
  try {
    const response = await api(usingToken);
    if (version !== requestVersion) return;
    if (!response.ok) {
      message.textContent = response.status === 401
        ? "The moderation token was not accepted."
        : "The comment service is unavailable.";
      return;
    }
    const { comments } = await response.json();
    const paths = [...new Set(comments.map(entry => entry.article.startsWith("/hi/") ? "/hi/index.json" : "/index.json"))];
    const titles = new Map();
    for (const index of await Promise.all(paths.map(loadArticleTitles))) {
      for (const [path, title] of index) titles.set(path, title);
    }
    if (version !== requestVersion) return;
    access.hidden = true;
    queue.hidden = false;
    items.replaceChildren();
    for (const entry of comments) render(entry, titles.get(entry.article));
    message.textContent = comments.length ? "" : "No comments in this view.";
  } catch {
    if (version === requestVersion) message.textContent = "Could not load the comment queue.";
  }
}

access.addEventListener("submit", event => {
  event.preventDefault();
  token = new FormData(access).get("token").trim();
  access.reset();
  refresh();
});
filter.addEventListener("change", refresh);
document.querySelector("#refresh").addEventListener("click", refresh);
document.querySelector("#lock").addEventListener("click", () => {
  requestVersion++;
  token = "";
  items.replaceChildren();
  queue.hidden = true;
  access.hidden = false;
  message.textContent = "";
});
