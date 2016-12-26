export const LAST_FM = "https://ws.audioscrobbler.com";
export const API_VERSION = "2.0";
export const GET_SIMILAR_ARTISTS = "artist.getsimilar";
export const GET_ARTIST_CORRECTION = "artist.getcorrection";
export const GET_POPULAR_TRACKS = "artist.getTopTracks";
export const API_KEY = "TODAY_LISTEN";

export class LastFm {
    constructor({api_key, version}) {
        this.api_key = api_key;
        this.version = version ? version : API_VERSION;
    }

    buildQuery(method) {
        return `${LAST_FM}/${this.version}/?method=${method}&api_key=${this.api_key}&format=json`
    };

    getSimilarArtists(artist, limit = 5) {
        const encodedArtist = encodeURIComponent(artist);
        return `${this.buildQuery(GET_SIMILAR_ARTISTS)}&artist=${encodedArtist}&limit=${limit}`;
    }

    getCorrection(artist) {
        const encodedArtist = encodeURIComponent(artist);
        return `${this.buildQuery(GET_ARTIST_CORRECTION)}&artist=${encodedArtist}`;
    }

    getPopularSongs(artist, limit = 10, autocorrect=false) {
        const encodedArtist = encodeURIComponent(artist);
        return `${this.buildQuery(GET_POPULAR_TRACKS)}&artist=${encodedArtist}&autocorrect=${+autocorrect}&limit=${limit}`
    }
}

export const lastFm = new LastFm({api_key: API_KEY, version: API_VERSION});