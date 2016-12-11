import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {selectArtist, fetchArtistsIfNeeded, invalidateArtist} from "../actions/artist";
import {fetchSongsIfNeeded, invalidateSongs} from "../actions/songs";
import Playlist from "../components/Playlist";
import _ from "lodash";
import YouTube from "react-youtube";
import {invalidateVideo, fetchVideoIfNeeded} from "../actions/videos";

class App extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
        this.state = {
            current: 0,
            playing: false,
        }
    }

    componentDidMount() {
        const {dispatch, selectedArtist} = this.props;

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

        dispatch(invalidateVideo(selectedArtist));
        dispatch(fetchVideoIfNeeded(selectedArtist));
    }

    play(e) {
        event.preventDefault();
        console.log("click", e);
        console.log(this.refs, _.get(this.refs, "youtube"));
        const player = this.refs.youtube.internalPlayer;
        if (this.state.playing) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        this.setState((prevState) => ({
            playing: !prevState.playing,
        }));
    }

    next(forward = true) {
        const { current, playing } = this.state;
        const { videos } = this.props;
        let shouldPlay = current > 0;
        if (forward) {
            shouldPlay = videos.length - 1 > current;
        }
        if (shouldPlay) {
            const player = this.refs.youtube.internalPlayer;
            const diff = forward ? 1 : -1;
            const videoId = videos[current + diff].items[0];
            this.setState((prevState) => ({
                current: prevState.current + diff,
            }));
            player.loadVideoByUrl(`https://www.youtube.com/v/${videoId}?version=3`).then(() => {
                if (playing) {
                    player.playVideo();
                }
            });
        }
    }

    render() {
        const {selectedArtist, artists, isFetching, songs, videos} = this.props;

        const opts = {
            height: '240',
            width: '360',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        };

        const style = {
            backgroundColor: "#ff3399",
            margin: "5px",
            display: "block",
        };

        return (
            <div>
                {/*<Picker value={selectedArtist}*/}
                {/*onChange={this.handleChange}*/}
                {/*options={['Mono', 'frontend']}*/}
                {/*/>*/}
                {!isFetching ? <h6><a href='#' onClick={this.handleRefreshClick}> Refresh</a></h6> : null}
                {isFetching && artists.length === 0 ? <h6>Loading...</h6> : null}
                {!isFetching && artists.length === 0 ? <h6>Empty.</h6> : null}
                {/*{artists.length > 0 ? <Artists items={artists}/> : null}*/}
                <Playlist
                    onClick={(i) => this.play(i)}
                    items={videos}
                    playing={this.state.playing}
                    current={this.state.current}
                />
                <YouTube
                    onEnd={() => this.next()}
                    ref="youtube"
                    opts={opts}
                    videoId={_.get(videos[this.state.current], "items[0]")}
                />
                <div>
                    <span style={style} onClick={() => this.next(false)}>
                        <i className="fa fa-2x fa-caret-left"/>
                    </span>
                    <span style={style} onClick={() => this.play()}>
                        {this.state.playing ? "PAUSE" : "PLAY"}
                    </span>
                    <span style={style} onClick={() => this.next()}>
                        <i className="fa fa-2x fa-caret-right"/>
                    </span>
                </div>
            </div>
        )
    }
}

App.propTypes = {
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
        videos: _.map(videos, ((item) => {
            return item
        })),
        selectedArtist,
        artists,
        songs,
        songsIsFetching,
        songsLastUpdated,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(App);