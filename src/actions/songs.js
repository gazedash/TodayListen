export const REQUEST_POPULAR_SONGS = 'REQUEST_POPULAR_SONGS';
export const RECEIVE_POPULAR_SONGS = 'RECEIVE_POPULAR_SONGS';
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS';

export function invalidateSongs(artist) {
    return {
        type: INVALIDATE_SONGS,
        artist,
    }
}

export function requestPopular(artist) {
    return {
        type: REQUEST_POPULAR_SONGS,
        artist,
    }
}

export function receivePopular(artist, songs) {
    return {
        type: RECEIVE_POPULAR_SONGS,
        artist,
        songs,
        receivedAt: Date.now(),
    }
}
