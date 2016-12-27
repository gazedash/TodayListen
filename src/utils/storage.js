class Storage {
    set(id, data) {
        localStorage.setItem(id, JSON.stringify(data));
    }

    get(id) {
        const json = localStorage.getItem(id);
        return json ? JSON.parse(json) : null;
    }

    has(id) {
        return Boolean(localStorage.getItem(id));
    }

    remove(id) {
        localStorage.removeItem(id);
    }
}

export default new Storage();
