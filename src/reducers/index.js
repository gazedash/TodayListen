import {combineReducers} from "redux";
import {selectedArtist, suggestedArtists, fetchFinishArtist} from "./artist";
import {popularSongs} from "./songs";
import {suggestedVideos} from "./videos";

const rootReducer = combineReducers({
    fetchFinishArtist,
    suggestedVideos,
    popularSongs,
    suggestedArtists,
    selectedArtist
});

export default rootReducer;