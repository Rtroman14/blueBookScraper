// const contactRepo = require("./src/contactRepo");
// const companyRepo = require("./src/companyRepo");

const contactData = require("./contacts.json");
const companyData = require("./companies.json");

(async () => {
    // const scrapedUrls = contactData.map((contact) => contact.url);
    // const notScrapedData = companyData.filter((company) => {
    //     if (scrapedUrls.includes(company.url)) {
    //         return company;
    //     }
    // });
    // console.log(notScrapedData.length);

    console.log(contactData.length);
})();
