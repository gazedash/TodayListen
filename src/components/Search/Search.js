import React, {PropTypes, Component} from "react";
import TextField from "material-ui/TextField";
import "./Search.css";

export default class Search extends Component {
    render() {
        return (
            <div className="search">
                {this.props.children}
                <TextField
                    className="searchbar"
                    hintText="Search..."
                    errorText={this.props.errorText}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    onKeyPress={this.props.onKeyPress}
                    fullWidth={true}
                    underlineShow={false}
                />
            </div>
        );
    }
}

Search.PropTypes = {
    children: PropTypes.object,
    onKeyPress: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

Search.defaultProps = {
    children: null,
};