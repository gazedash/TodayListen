import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import _ from "lodash";
import YouTube from "react-youtube";
import IconButton from "material-ui/IconButton";
import Spinner from "halogen/ScaleLoader";
import Playlist from "../components/Playlist/Playlist";
import Controls from "../components/Controls/Controls";
import Header from "../components/Header/Header";
import {selectArtist, invalidateArtist, nextArtist} from "../actions/artist";
import {invalidateSongs} from "../actions/songs";
import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            playIfLoaded: false,
            currentVideoInstance: 0,
            isOpen: false,
            playingId: 0,
            isPlaying: false,
        }
    }

    componentWillReceiveProps(nextProps) {
        // On playlist end: play if isPlaying and new songs fetched
        const {nextArtist, videos} = this.props;
        const {playIfLoaded} = this.state;
        if (nextProps.nextArtist !== nextArtist && nextProps.videos !== videos && playIfLoaded) {
            this.next();
            this.setState({
                playIfLoaded: false,
            })
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

    tryNext(forward = true) {
        const player = _.get(this.refs, ['youtube', 'internalPlayer']);
        if (player) {
            const {videos} = this.props;
            const {currentVideoInstance, playingId, isPlaying} = this.state;
            const items = videos[playingId].items;
            const diff = currentVideoInstance + (forward ? 1 : -1);
            if (items.length !== 0 && diff < items.length && diff >= 0) {
                player.cueVideoById(items[diff]).then(() => {
                    if (isPlaying) {
                        player.playVideo();
                    }
                });
                this.setState((prevState) => ({
                    currentVideoInstance: diff,
                }))
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
                this.setState({
                    playIfLoaded: true,
                });
            }
        }
    }

    onPlayerPlayClick(play = true) {
        const {isPlaying} = this.state;
        const cond = play ? !isPlaying : isPlaying;
        if (cond) {
            this.setState({
                isPlaying: cond,
            })
        }
    }

    renderControls() {
        return (
            <Controls
                isPlaying={this.state.isPlaying}
                prev={() => this.next(false)}
                play={() => this.play()}
                next={() => this.next()}
            />)
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
                    onClick={(i) => this.loadVideo(i, true)}
                    items={videos}
                    isPlaying={this.state.isPlaying}
                    playingId={this.state.playingId}
                />
            </div>
        )
    }

    renderTryPopup() {
        if (this.state.isOpen) {
            return (
                <div className="player-try-container">
                    <IconButton
                        className="player-try-button"
                        iconClassName="fa fa-chevron-circle-left"
                        onClick={() => this.tryNext(false)}
                    />
                    <IconButton
                        className="control-button"
                        iconClassName="fa fa-chevron-circle-right"
                        onClick={() => this.tryNext()}
                    />
                </div>
            )
        }
        return null;
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
                className="player-container"
                onMouseEnter={() => this.setState({isOpen: true,})}
                onMouseLeave={() => this.setState({isOpen: false,})}
            >
                {this.renderTryPopup()}
                <YouTube
                    onEnd={() => this.next()}
                    onPlay={() => this.onPlayerPlayClick()}
                    onPause={() => this.onPlayerPlayClick(false)}
                    ref="youtube"
                    opts={opts}
                    videoId={_.get(videos[this.state.playingId], "items[0]")}
                />
            </div>
        )
    }

    renderFooter() {
        return (
            <footer className="footer">
                {this.renderControls()}
            </footer>
        )
    }

    renderPage() {
        return (
            <section className="page-content">
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
    nextArtist: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    selectedArtist: PropTypes.string,
    artists: PropTypes.object.isRequired,
    suggestedArtists: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchFinishArtist: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object,
    ]),
};

App.defaultProps = {
    selectedArtist: null,
    nextArtist: null,
};

function mapStateToProps(state) {
    const {selectedArtist, suggestedArtists, suggestedVideos: videos, fetchFinishArtist} = state;
    const {
        lastUpdated: artistsLastUpdated,
        items: suggestedArtistsList,
    } = suggestedArtists[selectedArtist] || {
        isFetching: false,
        items: []
    };

    const {isFetching, artist: nextArtist} = fetchFinishArtist;

    return {
        videos: _.map(videos, ((item) => {
            return item
        })),
        nextArtist,
        isFetching,
        suggestedArtists: suggestedArtistsList,
        selectedArtist,
        artists: suggestedArtists,
        artistsLastUpdated,
    }
}

export default connect(mapStateToProps)(App);