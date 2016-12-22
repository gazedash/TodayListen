import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import YouTube from "react-youtube";
import Spinner from "halogen/ScaleLoader";
import Playlist from "../components/Playlist/Playlist";
import Controls from "../components/Controls/Controls";
import Header from "../components/Header/Header";
import {selectArtist, invalidateArtist, nextArtist} from "../actions/artist";
import {invalidateSongs} from "../actions/songs";
import {youTube} from "../api/youtube_api";

class App extends Component {
    constructor(props) {
        super(props);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            playingId: 0,
            isPlaying: false,
        }
    }

    shouldComponentUpdate(nextProps) {
        return !!nextProps.videos.length;
    }

    handleRefreshClick(e) {
        e.preventDefault();

        const {dispatch, selectedArtist} = this.props;

        if (selectedArtist) {
            dispatch(invalidateArtist(selectedArtist));
            dispatch(invalidateSongs(selectedArtist));
        }
    }

    onSearch(selectedArtist) {
        const {dispatch} = this.props;
        dispatch(selectArtist(selectedArtist));
    }

    play(index) {
        const player = _.get(this.refs, ['youtube', 'internalPlayer']);
        if (player) {
            if (this.state.isPlaying) {
                player.pauseVideo();
            } else {
                player.playVideo();
            }
            this.setState((prevState) => ({
                playingId: index ? index : prevState.playingId,
                isPlaying: !prevState.isPlaying,
            }));
        }
    }

    loadVideo(offset, play) {
        const {isPlaying, playingId} = this.state;
        const player = _.get(this.refs, ['youtube', 'internalPlayer']);
        if (player) {
            if (offset !== playingId) {
                const {videos} = this.props;
                const videoId = videos[offset].items[0];
                console.log(videos[offset]);
                player.loadVideoByUrl(youTube.getVideoUrl(videoId)).then(() => {
                    if (isPlaying || play) {
                        if (play) {
                            this.setState({
                                playingId: offset,
                                isPlaying: true,
                            })
                        }
                        player.playVideo();
                    }
                });
            } else {
                if (isPlaying) {
                    player.pauseVideo();
                    // player.playVideo();
                    this.setState((prevState) => ({
                        isPlaying: !isPlaying,
                    }));
                } else {
                    player.playVideo();
                    this.setState((prevState) => ({
                        playingId: offset ? offset : prevState.playingId,
                        isPlaying: !isPlaying,
                    }));
                }
            }
        }
    }

    next(forward = true) {
        const {playingId} = this.state;
        const {videos} = this.props;
        let shouldPlay = playingId > 0;
        if (forward) {
            shouldPlay = videos.length - 1 > playingId;
        }
        if (shouldPlay) {
            const diff = playingId + (forward ? 1 : -1);
            this.loadVideo(diff);
            this.setState((prevState) => ({
                playingId: diff,
            }));
        } else {
            // On playlist end
            if (forward) {
                this.props.dispatch(nextArtist(videos[playingId].artist));
            }
        }
    }

    onPlayerPlayClick() {
        const {isPlaying} = this.state;
        if (!isPlaying) {
            this.setState({
                isPlaying: !isPlaying,
            })
        }
    }

    onPlayerPauseClick() {
        const {isPlaying} = this.state;
        if (isPlaying) {
            this.setState({
                isPlaying: !isPlaying,
            })
        }
    }

    renderControls() {
        return (
            <Controls
                isPlaying={this.state.isPlaying}
                next={() => this.next()}
                prev={() => this.next(false)}
                play={() => this.play()}
            />)
    }


    renderPlaylist() {
        const {songsFetching, videos} = this.props;
        const spinner = (songsFetching ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '40%',
                    }}>
                        <Spinner color="#000" size="50px" margin="4px"/>
                    </div>
                </div>
            ) : videos.length === 0 ? <h3 style={{
                    margin: '50px 10px 10px',
                }}>The list is empty.</h3> : null);

        return (
            <div>
                {spinner}
                <Playlist
                    onClick={(i) => this.loadVideo(i, true)}
                    items={videos}
                    isPlaying={this.state.isPlaying}
                    playingId={this.state.playingId}
                />
            </div>
        )
    }

    renderPlayer() {
        const {videos} = this.props;

        const opts = {
            height: '240',
            width: '360',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 0
            }
        };

        if (videos.length === 0) {
            return null;
        }

        return (
            <div
                style={{
                    bottom: '70px',
                    position: 'fixed',
                    right: '20px',
                    top: 'auto',
                }}
            >
                <YouTube
                    onEnd={() => this.next()}
                    onPlay={() => this.onPlayerPlayClick()}
                    onPause={() => this.onPlayerPauseClick()}
                    ref="youtube"
                    opts={opts}
                    videoId={_.get(videos[this.state.playingId], "items[0]")}
                />
            </div>
        )
    }

    renderFooter() {
        return (
            <footer style={{
                marginTop: 26,
            }}>
                {this.renderControls()}
            </footer>
        )
    }

    renderPage() {
        const style = {
            padding: 0,
            margin: 0,
            marginTop: 44,
        };

        return (
            <section
                style={style}
            >
                {this.renderPlaylist()}
                {this.renderPlayer()}
                {<h6><a href='#' onClick={this.handleRefreshClick}> Refresh</a></h6>}
            </section>
        )
    }

    render() {
        return (
            <div>
                <Header
                    items={this.props.suggestedArtists.reduce((newArray, artist) => {
                        if (!this.props.artists[artist.name] && newArray.length < 3) {
                            newArray.push({image: artist.image[2]["#text"], ...artist});
                        }
                        return newArray;
                    }, [])}
                    onSearch={this.onSearch}
                />
                {this.renderPage()}
                {this.renderFooter()}
            </div>
        )
    }
}

App.propTypes = {
    selectedArtist: PropTypes.string,
    artists: PropTypes.object.isRequired,
    suggestedArtists: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired,
    songs: PropTypes.array.isRequired,
    artistsFetching: PropTypes.bool.isRequired,
    songsFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
};

App.defaultProps = {
    selectedArtist: null,
};

function mapStateToProps(state) {
    const {selectedArtist, suggestedArtists, popularSongs, suggestedVideos: videos} = state;
    const {
        isFetching: artistsFetching,
        lastUpdated: artistsLastUpdated,
        items: suggestedArtistsList,
    } = suggestedArtists[selectedArtist] || {
        isFetching: false,
        items: []
    };

    const {
        isFetching: songsFetching,
        lastUpdated: songsLastUpdated,
        items: songs
    } = popularSongs[selectedArtist] || {
        isFetching: false,
        items: []
    };

    return {
        videos: _.map(videos, ((item) => {
            return item
        })),
        suggestedArtists: suggestedArtistsList,
        selectedArtist,
        artists: suggestedArtists,
        artistsLastUpdated,
        artistsFetching,
        songs,
        songsFetching,
        songsLastUpdated,
    }
}

export default connect(mapStateToProps)(App);