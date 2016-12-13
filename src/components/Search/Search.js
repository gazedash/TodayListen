import React, {PropTypes, Component} from "react";
import TextField from "material-ui/TextField";
import "./Search.css";

export default class Search extends Component {
    render() {
        return (
                <TextField
                    value={this.props.value}
                    onChange={this.props.onChange}
                    onKeyPress={this.props.onKeyPress}
                    className="search"
                    fullWidth={true}
                    inputStyle={{
                        color: '#fff !important',
                    }}
                    style={{
                        marginTop: 8,
                    }}
                    underlineStyle={{
                        display: 'none',
                    }}
                    underlineFocusStyle={{
                        backgroundColor: '#fff',
                        height: 2,
                        display: 'block',
                    }}
                />
        );
    }
}

Search.PropTypes = {
    onKeyPress: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};