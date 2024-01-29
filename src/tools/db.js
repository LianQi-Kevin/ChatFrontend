import localforage from 'localforage';

const db = localforage.createInstance({
    name: 'XingHuoChat_ApiKeys',
    storeName: 'ApiKeys',
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE]
});

const DB = {
    async setItem(key, value) {
        return await db.setItem(key, value);
    },

    async getItem(key) {
        return await db.getItem(key);
    },

    async removeItem(key) {
        return await db.removeItem(key);
    },

    // async clear() {
    //     return await db.clear();
    // }
};

export default DB;
