async function scrollToRandomHeight(page) {
  console.log("Scrolling to random height...");
  const height = await page.evaluate(() => document.body.scrollHeight);
  const randomHeight = Math.floor(Math.random() * height);
  await page.evaluate((height) => {
    const startTime = performance.now();
    const duration = 3000;
    const startHeight = window.scrollY;
    const endHeight = height;
    const frame = (timestamp) => {
      const progress = (timestamp - startTime) / duration;
      window.scrollTo(0, startHeight + progress * (endHeight - startHeight));
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      }
    };
    window.requestAnimationFrame(frame);
  }, randomHeight);
}

export default scrollToRandomHeight;