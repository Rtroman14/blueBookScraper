const puppeteer = require("puppeteer");
const scrapeContacts = require("./src/scrapeContacts");
const contactRepo = require("./src/contactRepo");
const companyRepo = require("./src/companyRepo");
const blueBook = require("./repo.json");

const contactData = require("./contacts.json");
const companyData = require("./repo.json");

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

        const scrapedUrls = contactData.map((contact) => contact.url);

        const notScrapedData = companyData.filter((company) => {
            if (!scrapedUrls.includes(company.url)) {
                return company;
            }
        });

        console.log("Contacts left =", notScrapedData.length);

        // for (let company of notScrapedData.reverse()) {
        //     await page.goto(company.url, {
        //         waitUntil: "networkidle2",
        //     });
        //     await page.waitFor(3000);

        //     if (await page.$("#keyContactSection")) {
        //         await page.waitForSelector("#keyContactSection");

        //         const contacts = await scrapeContacts(page);

        //         for (let contact of contacts) {
        //             await contactRepo.create({
        //                 url: company.url,
        //                 company: company.company,
        //                 website: company.website,
        //                 name: contact.name,
        //                 phone: contact.phone,
        //             });
        //         }
        //     }

        //     console.log("Contacts left =", notScrapedData.length);
        // }
    } catch (error) {
        console.log("ERROR SCRAPING ---", error);
    }
})();

// for (let pageNum = 1; pageNum < 40; pageNum++) {
//     await page.waitFor(5000);

//     await page.goto(
//         `https://www.thebluebook.com/search.html?region=16&searchsrc=thebluebook&Central-Tampa%2C_Orlando%2C_Jacksonville=&class=3580&searchTerm=Roofing+Contractors&page=${pageNum}`,
//         {
//             waitUntil: "networkidle2",
//         }
//     );

//     await page.waitForSelector(".bottom-action-row");

//     const scrapedCompanyUrls = await scrapeCompanyUrls(page);

//     for (let scrapedCompanyUrl of scrapedCompanyUrls) {
//         await repo.create(scrapedCompanyUrl);
//     }
// }

// for (let company of blueBook) {
//     if (!("scraped" in company)) {
//         await page.goto(company.url, {
//             waitUntil: "networkidle2",
//         });
//         await page.waitFor(4000);

//         if (await page.$("#keyContactSection")) {
//             await page.waitForSelector("#keyContactSection");

//             const contacts = await scrapeContacts(page);

//             for (let contact of contacts) {
//                 await contactRepo.create({
//                     url: company.url,
//                     company: company.company,
//                     website: company.website,
//                     name: contact.name,
//                     phone: contact.phone,
//                 });
//             }
//             await companyRepo.update(company.url, { scraped: true });
//         } else {
//             await companyRepo.update(company.url, { scraped: true });
//         }
//     }
//     await companyRepo.update(company.url, { scraped: true });
// }
