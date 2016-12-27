import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import Spinner from "halogen/ScaleLoader";
import Playlist from "../components/Playlist/Playlist";
import Controls from "../components/Controls/Controls";
import Player from "../components/Player/Player";
import Header from "../components/Header/Header";
import {invalidateArtist, nextArtist} from "../actions/artist";
import {invalidateSongs, removePopularSong, removeAllSongs} from "../actions/songs";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.handlePlayClick = this.handlePlayClick.bind(this);
        this.handleLoadVideo = this.handleLoadVideo.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePlayerPlayClick = this.handlePlayerPlayClick.bind(this);
        this.handleTryNext = this.handleTryNext.bind(this);
        this.handleDeleteSong = this.handleDeleteSong.bind(this);
        this.handleClearClick = this.handleClearClick.bind(this);
        this.state = {
            playIfLoaded: false,
            currentVideoInstance: 0,
            playingId: 0,
            isPlaying: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        // On playlist end: play if isPlaying and new songs fetched
        const {nextArtist} = this.props;
        const {playIfLoaded} = this.state;
        if (nextProps.nextArtist !== nextArtist && playIfLoaded) {
            this.handleNext();
            this.setState({
                playIfLoaded: false,
            })
        }
    }

    handleRefreshClick(e) {
        e.preventDefault();

        const {dispatch, selectedArtist} = this.props;

        if (selectedArtist) {
            dispatch(invalidateArtist(selectedArtist));
            dispatch(invalidateSongs(selectedArtist));
        }
    }

    handleClearClick(e) {
        e.preventDefault();

        const {dispatch} = this.props;
        dispatch(removeAllSongs());
    }

    handlePlayClick(index) {
        const player = _.get(this.refs, ['youtube', 'refs', 'youtube', 'internalPlayer']);
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

    handleLoadVideo(offset, play) {
        const player = _.get(this.refs, ['youtube', 'refs', 'youtube', 'internalPlayer']);
        if (player) {
            const {isPlaying, playingId} = this.state;
            console.log({playing: this.props.videos[offset].artist,
                selected: this.props.selectedArtist, next: this.props.nextArtist});
            if (offset !== playingId) {
                const {videos} = this.props;
                const videoId = videos[offset].items[0];
                player.loadVideoById(videoId).then(() => {
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

    handleNext(forward = true) {
        const {playingId} = this.state;
        const {videos} = this.props;
        let shouldPlay = playingId > 0;
        if (forward) {
            shouldPlay = videos.length - 1 > playingId;
        }
        if (shouldPlay) {
            const diff = playingId + (forward ? 1 : -1);
            this.handleLoadVideo(diff);
            this.setState((prevState) => ({
                playingId: diff,
            }));
        } else {
            // On playlist end
            if (forward && videos.length !== 0) {
                this.props.dispatch(nextArtist(videos[playingId].artist));
                this.setState({
                    playIfLoaded: true,
                });
            }
        }
    }

    handlePlayerPlayClick(play) {
        this.setState({
            isPlaying: play,
        });
    }

    handleTryNext(diff) {
        this.setState((prevState) => ({
            currentVideoInstance: diff,
        }))
    }

    handleDeleteSong(i) {
        const {videos, dispatch} = this.props;
        if (videos.length !== 0) {
            dispatch(removePopularSong(videos[i].song));
            this.setState((prevState) => ({
                playingId: i < prevState.playingId ? prevState.playingId - 1 : prevState.playingId,
            }));
        }
    }

    renderPlaylist() {
        const {isFetching, videos} = this.props;
        const spinner = (isFetching ? (
                <div className="spinner-container">
                    <div className="spinner-inner">
                        <Spinner color="#000" size="50px" margin="4px"/>
                    </div>
                </div>
            ) : videos.length === 0 ? <h3 className="playlist-empty">The list is empty.</h3> : null);

        return (
            <div>
                {spinner}
                <Playlist
                    onDeleteClick={this.handleDeleteSong}
                    onClick={this.handleLoadVideo}
                    items={videos}
                    isPlaying={this.state.isPlaying}
                    playingId={this.state.playingId}
                />
            </div>
        )
    }

    renderPlayer() {
        const {videos} = this.props;

        return (
            <Player
                ref="youtube"
                fakeRef="youtube"
                currentVideoInstance={this.state.currentVideoInstance}
                isPlaying={this.state.isPlaying}
                playingId={this.state.playingId}
                videos={videos}
                onPlayerPlayClick={this.handlePlayerPlayClick}
                onTryNext={this.handleTryNext}
                onNext={this.handleNext}
            />
        )
    }

    renderPage() {
        return (
            <section className="page-content">
                {this.renderPlaylist()}
                {this.renderPlayer()}
                {<h6><a href='#' onClick={this.handleRefreshClick}> Refresh</a></h6>}
                {<h6><a href='#' onClick={this.handleClearClick}> Delete All</a></h6>}
            </section>
        )
    }

    renderFooter() {
        return (
            <footer className="footer">
                {this.renderControls()}
            </footer>
        )
    }

    renderControls() {
        return (
            <Controls
                isPlaying={this.state.isPlaying}
                prev={this.handleNext}
                play={this.handlePlayClick}
                next={this.handleNext}
            />)
    }

    render() {
        return (
            <div className="app-container">
                <Header />
                {this.renderPage()}
                {this.renderFooter()}
            </div>
        )
    }
}

App.propTypes = {
    nextArtist: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    selectedArtist: PropTypes.string,
    videos: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
};

App.defaultProps = {
    selectedArtist: null,
    nextArtist: null,
};

function mapStateToProps(state) {
    const {selectedArtist, suggestedVideos: videos = {}, fetchArtist} = state;
    const {isFetching = false, artist: nextArtist, fetchSuccess = false} = fetchArtist;
    return {
        videos: _.map(videos, (item) => {
            return item
        }),
        nextArtist,
        fetchSuccess,
        isFetching,
        selectedArtist,
    }
}

export default connect(mapStateToProps)(App);