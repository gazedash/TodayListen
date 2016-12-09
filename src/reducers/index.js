import {combineReducers} from "redux";
import {selectedArtist, suggestedArtists} from "./artist";
import {popularSongs} from "./songs";
import {suggestedVideos} from "./videos";

const rootReducer = combineReducers({
    suggestedVideos,
    popularSongs,
    suggestedArtists,
    selectedArtist
});

export default rootReducer;