export const REQUEST_SIMILAR_ARTISTS = 'REQUEST_SIMILAR_ARTISTS';
export const RECEIVE_SIMILAR_ARTISTS = 'RECEIVE_SIMILAR_ARTISTS';
export const SELECT_ARTIST = 'SELECT_ARTIST';
export const INVALIDATE_ARTIST = 'INVALIDATE_ARTIST';
export const NEXT_ARTIST = 'NEXT_ARTIST';
export const FETCH_FINISH_ARTIST = 'FETCH_FINISH_ARTIST';
export const FETCH_FAIL_ARTIST = 'FETCH_FAIL_ARTIST';
export const FETCH_PROGRESS_ARTIST = 'FETCH_PROGRESS_ARTIST';
export const REQUEST_ARTIST_CORRECTION = 'REQUEST_ARTIST_CORRECTION';
export const RECEIVE_ARTIST_CORRECTION = 'RECEIVE_ARTIST_CORRECTION';
export const RECEIVE_FAIL_ARTIST_CORRECTION = 'RECEIVE_FAIL_ARTIST_CORRECTION';

export function selectArtist(artist) {
    return {
        type: SELECT_ARTIST,
        artist,
    }
}

export function fetchFailArtist(artist) {
    return {
        type: FETCH_FAIL_ARTIST,
        artist,
    }
}

export function fetchFinishArtist(artist) {
    return {
        type: FETCH_FINISH_ARTIST,
        artist,
    }
}

export function requestArtistCorrection(artist) {
    return {
        type: REQUEST_ARTIST_CORRECTION,
        artist,
    }
}

export function receiveFailArtistCorrection(artist) {
    return {
        type: RECEIVE_FAIL_ARTIST_CORRECTION,
        artist,
    }
}

export function receiveArtistCorrection(artist) {
    return {
        type: RECEIVE_ARTIST_CORRECTION,
        artist,
    }
}

export function fetchProgressArtist(artist) {
    return {
        type: FETCH_PROGRESS_ARTIST,
        artist,
    }
}

export function nextArtist(artist) {
    return {
        type: NEXT_ARTIST,
        artist,
    }
}

export function invalidateArtist(artist) {
    return {
        type: INVALIDATE_ARTIST,
        artist,
    }
}

export function requestSimilar(artist) {
    return {
        type: REQUEST_SIMILAR_ARTISTS,
        artist,
    }
}

export function receiveSimilar(artist, {similarartists = {}, ...data}) {
    const {artist: items = [], ...rest} = similarartists;

    return {
        ...data,
        ...rest,
        type: RECEIVE_SIMILAR_ARTISTS,
        artist,
        items,
        receivedAt: Date.now(),
    }
}

