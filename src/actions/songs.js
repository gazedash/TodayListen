export const REQUEST_POPULAR_SONGS = 'REQUEST_POPULAR_SONGS';
export const RECEIVE_POPULAR_SONGS = 'RECEIVE_POPULAR_SONGS';
export const REQUEST_TOP_ALBUMS = 'REQUEST_TOP_ALBUMS';
export const RECEIVE_TOP_ALBUMS = 'RECEIVE_TOP_ALBUMS';
export const REQUEST_ALBUM_TRACKS = 'REQUEST_ALBUM_TRACKS';
export const RECEIVE_ALBUM_TRACKS = 'RECEIVE_ALBUM_TRACKS';
export const INVALIDATE_SONGS = 'INVALIDATE_SONGS';
export const REMOVE_POPULAR_SONG = 'REMOVE_POPULAR_SONG';
export const REMOVE_ALL_POPULAR_SONGS = 'REMOVE_ALL_POPULAR_SONGS';

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

export function removePopularSong(song) {
    return {
        type: REMOVE_POPULAR_SONG,
        song,
    }
}

export function removeAllSongs() {
    return {
        type: REMOVE_ALL_POPULAR_SONGS,
    }
}

export function requestTopAlbums(artist) {
    return {
        type: REQUEST_TOP_ALBUMS,
        artist,
    }
}

export function receiveTopAlbums(artist, albums) {
    return {
        type: RECEIVE_TOP_ALBUMS,
        artist,
        albums,
        receivedAt: Date.now(),
    }
}

export function requestAlbumTracks(artist, album) {
    return {
        type: REQUEST_ALBUM_TRACKS,
        artist,
        album,
    }
}

export function receiveAlbumTracks(artist, album, tracks) {
    return {
        type: RECEIVE_ALBUM_TRACKS,
        artist,
        album,
        tracks,
        receivedAt: Date.now(),
    }
}