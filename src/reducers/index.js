import {combineReducers} from "redux";
import {selectedArtist, suggestedArtists, fetchArtist, artistCorrection} from "./artist";
import {popularSongs} from "./songs";
import {suggestedVideos} from "./videos";
import {settings} from "./settings";

const rootReducer = combineReducers({
    fetchArtist,
    suggestedVideos,
    popularSongs,
    suggestedArtists,
    selectedArtist,
    artistCorrection,
    settings,
});

export default rootReducer;