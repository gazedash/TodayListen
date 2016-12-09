import {combineReducers} from "redux";
import {selectedArtist, suggestedArtists} from "./artist";
import {popularSongs} from "./songs";

const rootReducer = combineReducers({
    popularSongs,
    suggestedArtists,
    selectedArtist
});

export default rootReducer;