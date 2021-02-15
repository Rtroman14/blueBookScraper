const puppeteer = require("puppeteer");
const scrapeContacts = require("./src/scrapeContacts");
const scrapeCompanyUrls = require("./src/scrapeCompanyUrls");
const ContactRepo = require("./src/ContactRepo");
const CompanyRepo = require("./src/CompanyRepo");

const companyData = require("./companies.json");

(async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
        });

        const page = await browser.newPage();

        await page.setViewport({ width: 1366, height: 768 });

        // robot detection incognito - console.log(navigator.userAgent);
        page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
        );

        // await getCompanyUrls(
        //     page,
        //     22,
        //     "https://www.thebluebook.com/search.html?region=11&searchsrc=thebluebook&class=3580&searchTerm=roofing"
        // );

        await ripContacts(page, browser, "Georgia");
    } catch (error) {
        console.log("ERROR SCRAPING ---", error);
    }
})();

const getCompanyUrls = async (page, numPages, url) => {
    for (let pageNum = 1; pageNum < numPages; pageNum++) {
        await page.waitFor(5000);

        await page.goto(`${url}&page=${pageNum}`, {
            waitUntil: "networkidle2",
        });

        await page.waitForSelector(".bottom-action-row");

        const scrapedCompanyUrls = await scrapeCompanyUrls(page);

        for (let scrapedCompanyUrl of scrapedCompanyUrls) {
            await CompanyRepo.create(scrapedCompanyUrl);
        }
    }
};

const ripContacts = async (page, browser, location) => {
    let count = 0;

    for (let company of companyData) {
        if (count === 3) {
            throw new Error("reCAPTCHA !!!");
        }
        if (!("scraped" in company)) {
            await page.goto(company.url, {
                waitUntil: "networkidle2",
            });
            await page.waitFor(4000);

            if (await page.$("#keyContactSection")) {
                await page.waitForSelector("#keyContactSection");

                const contacts = await scrapeContacts(page);

                for (let contact of contacts) {
                    await ContactRepo.create({
                        url: company.url,
                        company: company.company,
                        website: company.website,
                        name: contact.name,
                        phone: contact.phone,
                        jobTitle: contact.jobTitle,
                        location,
                    });
                }
                await CompanyRepo.update(company.id, { scraped: true });
                count = 0;
            } else if (await page.$("#rc-anchor-container")) {
                await browser.close();
                throw new Error("reCAPTCHA !!!");
            } else if (await page.$(".rc-anchor-container")) {
                await browser.close();
                throw new Error("reCAPTCHA !!!");
            } else if (await page.$(".g-recaptcha")) {
                // await page.waitFor(29000);

                await CompanyRepo.update(company.id, { scraped: true });
                console.log("Company ID =", company.id);
                count++;
            } else {
                // await page.waitFor(29000);

                await CompanyRepo.update(company.id, { scraped: true });
                console.log("Company ID =", company.id);
                count++;
            }
        }
    }
};
