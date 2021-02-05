const puppeteer = require("puppeteer");
const repo = require("./src/repo");

(async () => {
    try {
        // const browser = await puppeteer.launch({ headless: true });
        // const page = await browser.newPage();

        for (let page = 1; page < 40; page++) {
            await page.goto(
                `https://www.thebluebook.com/search.html?region=16&searchsrc=thebluebook&Central-Tampa%2C_Orlando%2C_Jacksonville=&class=3580&searchTerm=Roofing+Contractors&page=${page}`,
                {
                    waitUntil: "networkidle2",
                }
            );

            // LOOP
            // scrape contact urls
            // store contact urls
            // next page
        }
    } catch (error) {
        console.log("ERROR SCRAPING");
    }
})();
