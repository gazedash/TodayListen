import {combineReducers} from "redux";
import {selectedArtist, suggestedArtists, fetchArtist} from "./artist";
import {popularSongs} from "./songs";
import {suggestedVideos} from "./videos";

const rootReducer = combineReducers({
    fetchArtist,
    suggestedVideos,
    popularSongs,
    suggestedArtists,
    selectedArtist
});

export default rootReducer;