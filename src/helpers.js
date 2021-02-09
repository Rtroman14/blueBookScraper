module.exports = {
    getInnerText(doc, selector) {
        if (doc.querySelector(selector)) {
            return doc.querySelector(selector).innerText;
        }

        return "";
    },
    getHref(doc, selector) {
        if (doc.querySelector(selector)) {
            return doc.querySelector(selector).href;
        }

        return "";
    },

    delay(ms) {
        new Promise((res) => setTimeout(res, ms));
    },
};
