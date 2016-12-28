import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import AppBar from "material-ui/AppBar";
import Search from "../../components/Search/Search";
import IconButton from "material-ui/IconButton";
import ArtistPicker from "../../components/ArtistPicker/ArtistPicker";
import Correction from "../../components/Correction/Correction";
import {nextArtist, selectArtist} from "../../actions/artist";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCorrectClose = this.handleCorrectClose.bind(this);

        this.state = {
            value: '',
            open: false,
            correctionOpen: true,
        };
    }

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
    };

    handleChange(event) {
        // Change state on input
        this.setState({
            value: event.target.value,
        });
    };

    handleSubmit(artistId) {
        if (artistId) {
            this.handleSearch(artistId, true);
            this.handleClose();
        }
    }

    onKeyPress(event) {
        // On every key press
        if (event.key === 'Enter') {
            this.handleSearch(this.state.value);
        }
    }

    handleSearch(artist, picker = false) {
        const {dispatch} = this.props;
        this.setState({
            correctionOpen: true,
        });
        if (picker) {
            dispatch(nextArtist(artist));
        } else {
            dispatch(selectArtist(artist));
        }
    }

    handleCorrectClose() {
        this.setState({
            correctionOpen: false,
        });
    }

    render() {
        const {correction, correctionSuccess, success, isFetching, artist} = this.props;
        const error = !success && !isFetching && artist;
        const searchButton = (
            <div className="search-button-container">
                <IconButton
                    className="search-button"
                    iconClassName="fa fa-search search-icon"
                    onClick={() => this.handleSearch(this.state.value)}
                />
            </div>
        );
        const errorText = error ? (
                <Correction
                    open={this.state.correctionOpen}
                    onClick={() => this.handleSearch(correction)}
                    onCloseClick={this.handleCorrectClose}
                    correction={correction}
                    correctionSuccess={correctionSuccess}
                />
            ) : null;

        return (
            <AppBar
                showMenuIconButton={false}
                title={null}
                titleStyle={{
                    flex: 'initial',
                }}
                className="app-bar"
            >
                <Search
                    errorText={errorText}
                    children={searchButton}
                    onKeyPress={(e) => this.onKeyPress(e)}
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                <ArtistPicker
                    items={this.props.items.reduce((newArray, artist) => {
                        if (!this.props.artists[artist.name] && newArray.length < 3) {
                            newArray.push({image: artist.image[2]["#text"], ...artist});
                        }
                        return newArray;
                    }, [])}
                    onOpen={this.handleOpen}
                    onClose={this.handleClose}
                    onSubmit={this.handleSubmit}
                    isOpen={this.state.open}
                />
            </AppBar>
        );
    }
}

Header.propTypes = {
    artists: PropTypes.object.isRequired,
    artist: PropTypes.string.isRequired,
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    correctionSuccess: PropTypes.bool.isRequired,
    correction: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {fetchArtist, suggestedArtists, artistCorrection} = state;
    const {correction = "", correctionSuccess = false} = artistCorrection;
    const {isFetching = false, success = false, artist} = fetchArtist;
    const {
        items,
    } = suggestedArtists[artist] || {
        isFetching: false,
        items: [],
    };

    return {
        artist,
        artists: suggestedArtists,
        isFetching,
        success,
        correction: correction,
        correctionSuccess,
        items,
    }
}

export default connect(mapStateToProps)(Header);