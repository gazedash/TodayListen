import React, {
    Component,
    PropTypes,
} from 'react';
import AppBar from "material-ui/AppBar";
import Search from "../../components/Search/Search";
import IconButton from "material-ui/IconButton";

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }

    handleChange = (event) => {
        // Change state on input
        this.setState({
            value: event.target.value,
        });
    };

    onKeyPress(event) {
        // On every key press
        if (event.key === 'Enter') {
            this.props.onSubmit(this.state.value);
        }
    }

    render() {
        const largeIcon = {
            color: 'white',
            fontSize: 20,
        };

        const large = {
            width: 57,
            height: 57,
            padding: 0,
        };

        const searchButton = (
            <IconButton
                style={large}
                iconStyle={largeIcon}
                iconClassName="fa fa-search"
                onClick={() => this.props.onSubmit(this.state.value)}
            />
        );

        return (
            <AppBar
                showMenuIconButton={false}
                style={{
                    top: 0,
                    position: 'fixed',
                    color: 'white !important',
                }}
            >
                <Search
                    onKeyPress={(e) => this.onKeyPress(e)}
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                {searchButton}
            </AppBar>
        );
    }
}

Header.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};
Header.defaultProps = {};