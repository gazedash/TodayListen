import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {selectArtist, fetchArtistsIfNeeded, invalidateArtist} from "../actions/artist";
import {fetchSongsIfNeeded, invalidateSongs} from "../actions/songs";
import Picker from "../components/Picker";
import Playlist from "../components/Playlist";
import Artists from "../components/Artists";
import YouTube from "react-youtube";
import _ from 'lodash';

class AsyncApp extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    componentDidMount() {
        const {dispatch, selectedArtist, songs} = this.props;
        dispatch(fetchArtistsIfNeeded(selectedArtist));

        dispatch(fetchSongsIfNeeded(selectedArtist));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedArtist !== this.props.selectedArtist) {
            const {dispatch, selectedArtist} = nextProps;
            dispatch(fetchArtistsIfNeeded(selectedArtist));

            dispatch(fetchSongsIfNeeded(selectedArtist))
        }
    }

    handleChange(nextArtist) {
        this.props.dispatch(selectArtist(nextArtist));
    }

    handleRefreshClick(e) {
        e.preventDefault();

        const {dispatch, selectedArtist} = this.props;
        dispatch(invalidateArtist(selectedArtist));
        dispatch(fetchArtistsIfNeeded(selectedArtist));

        dispatch(invalidateSongs(selectedArtist));
        dispatch(fetchSongsIfNeeded(selectedArtist));
    }

    render() {
        const {selectedArtist, artists, isFetching, songs, videos} = this.props;
        console.log(_.toArray(videos));

        const opts = {
            height: '240',
            width: '360',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };

        return (
            <div>
                <Picker value={selectedArtist}
                        onChange={this.handleChange}
                        options={['Mono', 'frontend']}
                />
                {!isFetching ? <h6><a href='#' onClick={this.handleRefreshClick}> Refresh</a></h6> : null}
                {isFetching && artists.length === 0 ? <h6>Loading...</h6> : null}
                {!isFetching && artists.length === 0 ? <h6>Empty.</h6> : null}
                {artists.length > 0 ? <Artists items={artists}/> : null}
                <Playlist items={songs}/>
                <div>{JSON.stringify(videos)}</div>
                <YouTube
                    opts={opts}
                    videoId="t8JzbrduVXU"
                />
            </div>
        )
    }
}

AsyncApp.propTypes = {
    selectedArtist: PropTypes.string.isRequired,
    artists: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired,
    songs: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const {selectedArtist, suggestedArtists, popularSongs, suggestedVideos: videos} = state;
    const {
        isFetching,
        lastUpdated,
        items: artists
    } = suggestedArtists[selectedArtist] || {
        isFetching: true,
        items: []
    };

    const {
        songsIsFetching,
        songsLastUpdated,
        items: songs
    } = popularSongs[selectedArtist] || {
        isFetching: true,
        items: []
    };

    return {
        videos,
        selectedArtist,
        artists,
        songs,
        songsIsFetching,
        songsLastUpdated,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(AsyncApp);