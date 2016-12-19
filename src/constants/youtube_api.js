//search?part=id&q=mono&key=TODAY_LISTEN
export const YOUTUBE = "https://www.googleapis.com/youtube";
export const API_VERSION = "v3";
export const SEARCH = "search";
export const API_KEY = "TODAY_LISTEN";

export class YouTube {
    constructor({api_key, version}) {
        this.api_key = api_key;
        this.version = version ? version : API_VERSION;
    }

    buildQuery(method) {
        return `${YOUTUBE}/${this.version}/${method}?key=${this.api_key}`
    };

    search(query) {
        query = encodeURIComponent(query);
        // console.log(`${this.buildQuery(SEARCH)}&q=${query}&part=id`);
        return `${this.buildQuery(SEARCH)}&q=${query}&part=id`
    }
}

export const youTube = new YouTube({api_key: API_KEY, version: API_VERSION});