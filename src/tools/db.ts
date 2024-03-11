import localforage from 'localforage';

export default class DB {
    private db: LocalForage;
    constructor(name?: string, storeName?: string, description?: string) {
        this.db = localforage.createInstance({
            driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
            name: name,
            storeName: storeName,
            description: description,
        });
    }

    async setItem(key: string, value: any) {
        return await this.db.setItem(key, value);
    }

    async getItem(key: string) {
        return await this.db.getItem(key);
    }

    async removeItem(key: string) {
        return await this.db.removeItem(key);
    }

    async clear() {
        return await this.db.clear();
    }
}
