(() => {
  const progress = document.querySelector(".tw-reading-progress");
  const article = document.getElementById("article-body");
  if (!progress || !article) return;

  let frame = 0;
  function update() {
    const { top, height } = article.getBoundingClientRect();
    const viewport = document.documentElement.clientHeight;
    // Give short articles a reading interval as soon as they enter the viewport.
    const start = height <= viewport ? viewport : 0;
    const distance = Math.max(1, height - viewport + start);
    const percent = Math.min(100, Math.max(0, (start - top) / distance * 100));
    progress.value = percent;
    frame = 0;
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  progress.hidden = false;
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule, { once: true });
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(article);
})();
