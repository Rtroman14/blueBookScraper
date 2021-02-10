const fs = require("fs");

class Repo {
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating a repository requires a filename");
        }

        this.filename = filename;

        try {
            fs.accessSync(this.filename);
        } catch {
            fs.writeFileSync(this.filename, "[]");
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename));
    }

    async getUser(id) {
        const records = await this.getAll();

        return records.find((record) => record.id === id);
    }

    async getUserBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }

    async create(attributes) {
        // attributes === { email: "", password: "" }

        const records = await this.getAll();
        const record = { ...attributes };

        records.push(record);

        await this.writeAll(records);

        return attributes;
    }

    async writeAll(records) {
        // writes to fill with 4 spaces to prettyPrint
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 4));
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter((record) => record.id !== id);

        await this.writeAll(filteredRecords);
    }

    async update(id, attributes) {
        const records = await this.getAll();
        const record = records.find((record) => record.id === id);

        if (!record) {
            throw new Error(`Record with id: ${id} not found.`);
        }

        Object.assign(record, attributes);
        await this.writeAll(records);
    }
}

module.exports = new Repo("repo.json");
