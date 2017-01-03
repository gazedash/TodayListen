export const SWITCH_ALBUMS_TO_TOP_TRACKS = 'SWITCH_ALBUMS_TO_TOP_TRACKS';

export function switchAlbumsToTopTracks(preferAlbums) {
    return {
        type: SWITCH_ALBUMS_TO_TOP_TRACKS,
        preferAlbums,
    }
}
