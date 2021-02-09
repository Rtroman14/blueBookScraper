module.exports = async (page) => {
    try {
        const scrapedContacts = await page.evaluate(() => {
            let allContacts = [];

            function getInnerText(doc, selector) {
                if (doc.querySelector(selector)) {
                    return doc.querySelector(selector).innerText;
                }

                return "";
            }

            let keyContacts = document.querySelector("#keyContactSection > div.row");
            let contacts = keyContacts.querySelectorAll(".row > div");

            for (let contact of contacts) {
                let data = {
                    name: getInnerText(contact, ".media-heading"),
                    jobTitle: getInnerText(contact, "small"),
                    phone: getInnerText(contact, ".phoneDisp ").trim(),
                };

                allContacts.push(data);
            }

            return allContacts;
        });

        return scrapedContacts;
    } catch (error) {
        console.log("ERROR SCRAPECONTACTS ---", error);
    }
};
