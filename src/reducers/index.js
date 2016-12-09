import {combineReducers} from "redux";
import {selectedArtist, suggestedArtistss} from "./artist";

const rootReducer = combineReducers({
    suggestedArtistss,
    selectedArtist
});

export default rootReducer;