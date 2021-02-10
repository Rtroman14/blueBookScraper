module.exports = async (page) => {
    try {
        const scrapedCompanyUrls = await page.evaluate(() => {
            let allCompanys = [];

            function getInnerText(doc, selector) {
                if (doc.querySelector(selector)) {
                    return doc.querySelector(selector).innerText;
                }

                return "";
            }

            function getHref(doc, selector) {
                if (doc.querySelector(selector)) {
                    return doc.querySelector(selector).href;
                }

                return "";
            }

            const companys = document.querySelectorAll(".single_result_wrapper");

            for (let company of companys) {
                let contact = {
                    url: getHref(company, "div.addy_wrapper > a:nth-child(7)"),
                    company: getInnerText(company, ".cname-wrapper > a > span"),
                    website: getHref(company, "div.addy_wrapper > a:nth-child(8)"),
                };

                allCompanys.push(contact);
            }

            return allCompanys;
        });

        return scrapedCompanyUrls;
    } catch (error) {
        console.log("ERROR SCRAPECOMPANYURLS ---", error);
    }
};
