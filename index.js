const puppeteer = require("puppeteer");
const scrapeContacts = require("./src/scrapeContacts");
const scrapeCompanyUrls = require("./src/scrapeCompanyUrls");
const ContactRepo = require("./src/ContactRepo");
const CompanyRepo = require("./src/CompanyRepo");

// const contactData = require("./contacts.json");
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
        //     48,
        //     "https://www.thebluebook.com/search.html?region=12&searchsrc=thebluebook&class=3580&searchTerm=roofing"
        // );

        await ripContacts(page, browser);
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

const ripContacts = async (page, browser) => {
    for (let company of companyData) {
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
                    });
                }
                await CompanyRepo.update(company.url, { scraped: true });
            } else if (await page.$("#rc-anchor-container")) {
                await page.waitFor(29000);
                await browser.close();
                throw new Error("reCAPTCHA !!!");
            } else if (await page.$(".rc-anchor-container")) {
                await page.waitFor(29000);
                await browser.close();
                throw new Error("reCAPTCHA !!!");
            } else if (await page.$(".g-recaptcha")) {
                // await page.waitFor(29000);
                // await browser.close();
                // throw new Error("reCAPTCHA !!!");
                await CompanyRepo.update(company.url, { scraped: true });
                console.log(company.url);
            } else {
                await CompanyRepo.update(company.url, { scraped: true });
                console.log(company.url);
            }
        }
    }
};
