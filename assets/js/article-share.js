(() => {
    const panel = document.getElementById('article-share');
    const copy = panel.querySelector('[data-copy-link]');
    const status = panel.querySelector('[role="status"]');
    const manual = panel.querySelector('input');
    const { url, title, copied, manual: manualMessage } = panel.dataset;

    const share = document.querySelector('[data-native-share]');
    if (share && typeof navigator.share === 'function') {
        share.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                await navigator.share({ title, url });
            } catch (error) {
                if (error.name !== 'AbortError') window.location.hash = panel.id;
            }
        });
    }

    copy.hidden = false;
    copy.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(url);
            manual.hidden = true;
            status.textContent = copied;
        } catch {
            manual.hidden = false;
            manual.focus();
            manual.select();
            status.textContent = manualMessage;
        }
    });
})();
