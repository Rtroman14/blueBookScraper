const contactRepo = require("./src/contactRepo");
const companyRepo = require("./src/companyRepo");
const data = require("./repo - Copy.json");

const contactData = require("./contacts.json");
const companyData = require("./repo.json");

(async () => {
    const scrapedUrls = contactData.map((contact) => contact.url);

    const notScrapedData = companyData.filter((company) => {
        if (scrapedUrls.includes(company.url)) {
            return company;
        }
    });

    console.log(notScrapedData.length);
})();
