const { Cluster } = require('puppeteer-cluster');
const Signale = require('signale');

(async () => {
  Signale.info('start.')
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
  });

  await cluster.queue('http://www.google.com/');
  await cluster.queue('http://www.wikipedia.org/');

  const evaluteTitle = async (page, url) => {
    Signale.pending(`url: ${url}`)
    await page.goto(url);
    const title = await page.evaluate(() => document.title);
    Signale.debug('title:', title)
  };

  await cluster.task(async ({ page, data: url }) => evaluteTitle(page, url));

  await cluster.idle();
  await cluster.close();

  Signale.info('end.');
})();
