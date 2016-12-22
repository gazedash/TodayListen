export const GOOGLE_API = "https://www.googleapis.com/youtube";
export const API_VERSION = "3";
export const SEARCH = "search";
export const API_KEY = "TODAY_LISTEN";
export const YOUTUBE_VIDEO_ENDPOINT = 'https://www.youtube.com';

export class YouTube {
    constructor({api_key, version}) {
        this.api_key = api_key;
        this.version = version ? version : API_VERSION;
    }

    buildQuery(method) {
        return `${GOOGLE_API}/v${this.version}/${method}?key=${this.api_key}`
    };

    search(query) {
        query = encodeURIComponent(query);
        // console.log(`${this.buildQuery(SEARCH)}&q=${query}&part=id`);
        return `${this.buildQuery(SEARCH)}&q=${query}&part=id&videoEmbeddable=true&type=video`
    }

    getVideoUrl(videoId) {
        videoId = encodeURIComponent(videoId);
        return `${YOUTUBE_VIDEO_ENDPOINT}/v/${videoId}?version=${API_VERSION}`;
    }
}

export const youTube = new YouTube({api_key: API_KEY, version: API_VERSION});