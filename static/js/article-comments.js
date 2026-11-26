const comments = document.querySelector("[data-article-comments]");
const form = comments.querySelector("form");
const list = comments.querySelector("[data-comment-list]");
const status = comments.querySelector("[data-comment-status]");
const hi = comments.lang === "hi";
const endpoint = "/api/comments?article=" + encodeURIComponent(new URL(comments.dataset.articleComments, location.origin).pathname);
const local = (en, hindi) => hi ? hindi : en;

function append(parent, tag, text) {
  const element = document.createElement(tag);
  element.textContent = text;
  parent.append(element);
  return element;
}

async function loadComments() {
  const response = await fetch(endpoint);
  if (!response.ok || !response.headers.get("Content-Type")?.includes("application/json")) return;
  const { comments: entries } = await response.json();
  list.replaceChildren();
  if (!entries.length) append(list, "p", local("Be the first to comment.", "पहली टिप्पणी आप लिखें।"));
  const date = new Intl.DateTimeFormat(hi ? "hi-IN" : "en-IN", { dateStyle: "medium" });
  for (const entry of entries) {
    const card = append(list, "article", "");
    card.className = "tw-comment-card";
    append(card, "strong", entry.name);
    const time = append(card, "time", date.format(entry.created));
    time.dateTime = new Date(entry.created).toISOString();
    append(card, "p", entry.body);
    if (entry.reply) {
      const reply = append(card, "div", "");
      reply.className = "tw-comment-reply";
      append(reply, "strong", "TechWadh");
      append(reply, "p", entry.reply);
    }
  }
  comments.hidden = false;
}

form.addEventListener("invalid", event => {
  const contact = event.target.closest(".tw-comment-contact");
  if (contact) contact.open = true;
}, true);

form.addEventListener("submit", async event => {
  event.preventDefault();
  const button = form.querySelector("button");
  const contact = form.querySelector(".tw-comment-contact");
  button.disabled = true;
  status.textContent = local("Sending…", "भेज रहे हैं…");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (response.status === 429) {
      status.textContent = local("Too many submissions. Please try again later.", "बहुत ज़्यादा टिप्पणियाँ भेजी गई हैं। थोड़ी देर बाद कोशिश करें।");
    } else if (response.status === 400) {
      status.textContent = local("Check your name, comment and any contact details entered.", "नाम, टिप्पणी और दिए गए संपर्क विवरण जाँचें।");
    } else if (response.status === 201) {
      form.reset();
      contact.open = false;
      status.textContent = local("Comment received. It will appear after approval.", "टिप्पणी मिल गई है। मंज़ूरी के बाद यह यहाँ दिखेगी।");
    } else {
      throw new Error("Submission failed");
    }
  } catch {
    status.textContent = local("Could not send your comment. Please try again.", "टिप्पणी भेजी नहीं जा सकी। दोबारा कोशिश करें।");
  } finally {
    button.disabled = false;
  }
});

loadComments().catch(() => {});
