export const LAST_FM = "https://ws.audioscrobbler.com";
export const API_VERSION = "2.0";
export const GET_SIMILAR_ARTISTS = "artist.getsimilar";
export const API_KEY = "TODAY_LISTEN";

export class LastFm {
    constructor({api_key, version}) {
        this.api_key = api_key;
        this.version = version ? version : API_VERSION;
    }

    buildQuery(method) {
        return `${LAST_FM}/${this.version}/?method=${method}&api_key=${this.api_key}&format=json`
    };

    getSimilarArtists(artist) {
        return `${this.buildQuery(GET_SIMILAR_ARTISTS)}&artist=${artist}&limit=3`;
    }
}