(() => {
  const progress = document.querySelector(".tw-reading-progress");
  const scroller = document.scrollingElement;
  if (!progress || !scroller) return;

  let frame = 0;
  function update() {
    const distance = scroller.scrollHeight - scroller.clientHeight;
    const offset = Math.max(0, scroller.scrollTop);
    // Scroll offsets can be fractional while scrollHeight is rounded.
    const atBottom = distance > 0 && distance - offset <= 0.5;
    progress.value = atBottom ? 100 : offset / Math.max(1, distance) * 100;
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
  if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(document.body);
})();
