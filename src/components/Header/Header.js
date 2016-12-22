import React, {Component, PropTypes} from "react";
import AppBar from "material-ui/AppBar";
import Search from "../../components/Search/Search";
import IconButton from "material-ui/IconButton";
import ArtistPicker from "../ArtistPicker/ArtistPicker";
import "./Header.css";

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
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
            this.props.onSearch(artistId);
            this.handleClose();
        }
    }

    onKeyPress(event) {
        // On every key press
        if (event.key === 'Enter') {
            this.props.onSearch(this.state.value);
        }
    }

    render() {
        const searchButton = (
            <div className="search-button-container">
                <IconButton
                    className="search-button"
                    iconClassName="fa fa-search search-icon"
                    onClick={() => this.props.onSearch(this.state.value)}
                />
            </div>
        );

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
                    children={searchButton}
                    onKeyPress={(e) => this.onKeyPress(e)}
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                <ArtistPicker
                    items={this.props.items}
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
    items: PropTypes.array,
    onSearch: PropTypes.func.isRequired,
    // onPick: PropTypes.func.isRequired,
};
Header.defaultProps = {
    items: [],
};