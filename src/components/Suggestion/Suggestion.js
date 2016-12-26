import React, {Component, PropTypes} from "react";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import "./Suggestion.css";

class Suggestion extends Component {
    render() {
        const {correction, correctionSuccess} = this.props;
        const corrected = correction && correctionSuccess;
        return (
            <Paper zDepth={1}>
                <div className="search-error">
                    Sorry, I couldn't find it.
                    {corrected ?
                        <div className="suggest-wrapper">
                            <div className="suggest-text">Try suggestion:</div>
                            <div className="suggest-button-wrapper" onClick={this.props.onClick}
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
}

Suggestion.propTypes = {
    onClick: PropTypes.func.isRequired,
    correction: PropTypes.string.isRequired,
    correctionSuccess: PropTypes.bool.isRequired,
};
Suggestion.defaultProps = {};

export default Suggestion;
