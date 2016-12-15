import React, {PropTypes, Component} from "react";
import TextField from "material-ui/TextField";
import "./Search.css";

export default class Search extends Component {
    render() {
        return (
            <div
                className="search"
                style={{
                    display: 'flex',
                }}
            >
                {this.props.children ? this.props.children : null}
                <TextField
                    hintText="Search..."
                    hintStyle={{
                        color: 'rgba(255,255,255,0.5)',
                        bottom: 3,
                    }}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    onKeyPress={this.props.onKeyPress}
                    fullWidth={true}
                    inputStyle={{
                        color: '#fff !important',
                        height: '100%',
                    }}
                    style={{
                        paddingRight: 20,
                        height: '100%',

                    }}
                    underlineStyle={{
                        display: 'none',
                    }}
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