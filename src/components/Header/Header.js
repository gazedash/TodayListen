import React, {Component, PropTypes} from "react";
import AppBar from "material-ui/AppBar";
import Search from "../../components/Search/Search";
import IconButton from "material-ui/IconButton";
import ArtistPicker from "../ArtistPicker/ArtistPicker";
import Suggestion from "../Suggestion/Suggestion";
import "./Header.css";
import {connect} from "react-redux";
import {selectArtist} from "../../actions/artist";

class Header extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: '',
            open: false,
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
            this.handleSearch(artistId);
            this.handleClose();
        }
    }

    onKeyPress(event) {
        // On every key press
        if (event.key === 'Enter') {
            this.handleSearch(this.state.value);
        }
    }

    handleSearch(artist) {
        const {dispatch} = this.props;
        dispatch(selectArtist(artist));
    }

    render() {
        const {correction, success, isFetching} = this.props;
        const error = !success && !isFetching;
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
            <Suggestion
                onClick={() => this.handleSearch(correction)}
                correction={correction}
                correctionSuccess={this.props.correctionSuccess}
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
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    success: PropTypes.bool.isRequired,
    correctionSuccess: PropTypes.bool.isRequired,
    correction: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    // onPick: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    const {selectedArtist, fetchArtist, suggestedArtists} = state;
    const {isFetching, success, correction, correctionSuccess = false} = fetchArtist;
    const {
        items,
    } = suggestedArtists[selectedArtist] || {
        isFetching: false,
        items: []
    };

    return {
        artists: suggestedArtists,
        isFetching,
        success,
        correction: correction ? correction : "",
        correctionSuccess,
        items,
    }
}

export default connect(mapStateToProps)(Header);