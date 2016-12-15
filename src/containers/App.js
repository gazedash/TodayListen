import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {selectArtist, fetchArtistsIfNeeded, invalidateArtist} from "../actions/artist";
import {fetchSongsIfNeeded, invalidateSongs} from "../actions/songs";
import Playlist from "../components/Playlist/Playlist";
import Controls from "../components/Controls/Controls";
import _ from "lodash";
import YouTube from "react-youtube";
import Header from "../components/Header/Header";

class App extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            playingId: 0,
            isPlaying: false,
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

    shouldComponentUpdate(nextProps) {
        return !!nextProps.videos.length;
    }

    handleChange(nextArtist) {
        this.props.dispatch(selectArtist(nextArtist));
    }

    handleRefreshClick(e) {
        e.preventDefault();

        const {dispatch, selectedArtist} = this.props;

        if (selectedArtist) {
            dispatch(invalidateArtist(selectedArtist));
            dispatch(fetchArtistsIfNeeded(selectedArtist));

            dispatch(invalidateSongs(selectedArtist));
            dispatch(fetchSongsIfNeeded(selectedArtist));
        }
    }

    onSearch(selectedArtist) {
        // On icon click and enter click
        const {dispatch} = this.props;
        dispatch(selectArtist(selectedArtist));

        // dispatch(invalidateArtist(selectedArtist));
        // dispatch(fetchArtistsIfNeeded(selectedArtist));
        //
        // dispatch(invalidateSongs(selectedArtist));
        // dispatch(fetchSongsIfNeeded(selectedArtist));
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
                player.loadVideoByUrl(`https://www.youtube.com/v/${videoId}?version=3`).then(() => {
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
                style={{
                    position: 'fixed',
                    bottom: 0,
                }}
                isPlaying={this.state.isPlaying}
                next={() => this.next()}
                prev={() => this.next(false)}
                play={() => this.play()}
            />)
    }


    renderPlaylist() {
        const {isFetching, videos} = this.props;

        // if (videos.length === 0) {
        if (isFetching) {
            return (<h6>Loading...</h6>);
        }
        // else {
        //         return (<h6>Empty.</h6>);
        //     }
        // }

        return (
            <Playlist
                onClick={(i) => this.loadVideo(i, true)}
                items={videos}
                isPlaying={this.state.isPlaying}
                playingId={this.state.playingId}
            />
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

    render() {
        const style = {
            padding: 0,
            margin: 0,
            marginTop: 44,
        };

        return (
            <div>
                {/*<Picker value={selectedArtist}*/}
                {/*onChange={this.handleChange}*/}
                {/*options={['Mono', 'frontend']}*/}
                {/*/>*/}
                <Header
                    items={this.props.artists.map((artist) => {
                        return ({image: artist.image[2]["#text"], ...artist})
                    })}
                    onSearch={this.onSearch}
                />
                <section
                    style={style}
                >
                    {this.renderPlaylist()}

                    {/*{this.props.artists.map((artist) => {*/}
                        {/*return (<img src={artist.image[2]["#text"]} key={artist.name}/>)*/}
                    {/*})}*/}

                    {this.renderPlayer()}
                    {<h6><a href='#' onClick={this.handleRefreshClick}> Refresh</a></h6>}
                </section>
                <footer style={{
                    marginTop: 26,
                }}>
                    {this.renderControls()}
                </footer>
            </div>
        )
    }
}

App.propTypes = {
    selectedArtist: PropTypes.string,
    artists: PropTypes.array.isRequired,
    videos: PropTypes.array.isRequired,
    songs: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};

App.defaultProps = {
    selectedArtist: null,
};

function mapStateToProps(state) {
    const {selectedArtist, suggestedArtists, popularSongs, suggestedVideos: videos} = state;
    const {
        isFetching,
        lastUpdated,
        items: artists
    } = suggestedArtists[selectedArtist] || {
        isFetching: false,
        items: []
    };

    const {
        songsIsFetching,
        songsLastUpdated,
        items: songs
    } = popularSongs[selectedArtist] || {
        isFetching: false,
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