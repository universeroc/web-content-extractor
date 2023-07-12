import puppeteer from 'puppeteer';

const navigationTimeout = 60000
const waitUntil = 'networkidle0'

const getTextFromURL = async (url) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(navigationTimeout)

    page.goto(url)
    await page.waitForNavigation({ waitUntil });

    const siteText = await page.evaluate(() => {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        const texts = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.parentElement.tagName !== 'SCRIPT') {
            texts.push(node.textContent.trim());
            }
        }
        return texts.join('\n');
    })

    await browser.close();
    return siteText
}

export {
    getTextFromURL
}
