import React, {PropTypes, Component} from "react";
import TextField from "material-ui/TextField";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import "./Search.css";

export default class Search extends Component {
    renderError() {
        const error = !this.props.success && !this.props.fetching;
        const {correction, correctionSuccess} = this.props;
        const corrected = correction && correctionSuccess;
        if (error) {
            return (
                <Paper zDepth={1}>
                    <div className="search-error">
                        Sorry, I couldn't find it.
                        {corrected ?
                            <div className="suggest-wrapper">
                                <div className="suggest-text">Try suggestion:</div>
                                <div className="suggest-button-wrapper" onClick={this.props.onTrySuggestion}
                                >{correction}
                                    <IconButton
                                        className="search-button-error"
                                        iconClassName="fa fa-superpowers search-icon-error"
                                    />
                                </div>
                            </div>
                            : null}
                    </div>
                </Paper>
            )
        }
        return null;
    }

    render() {
        return (
            <div className="search">
                {this.props.children}
                <TextField
                    className="searchbar"
                    hintText="Search..."
                    hintStyle={{
                        color: 'rgba(255,255,255,0.5)',
                        bottom: 3,
                    }}
                    errorText={this.renderError()}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    onKeyPress={this.props.onKeyPress}
                    fullWidth={true}
                    inputStyle={{
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
    success: PropTypes.bool.isRequired,
    correctionSuccess: PropTypes.bool.isRequired,
    correction: PropTypes.string.isRequired,
    fetching: PropTypes.bool.isRequired,
    onKeyPress: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onTrySuggestion: PropTypes.func.isRequired,
};

Search.defaultProps = {
    children: null,
};