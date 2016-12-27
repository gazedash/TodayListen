import React, {Component, PropTypes} from "react";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";
import "./Correction.css";

class Correction extends Component {
    render() {
        if (this.props.open) {
            const {correction, correctionSuccess} = this.props;
            const corrected = correction && correctionSuccess;
            return (
                <div className="suggest-root">
                    <Paper zDepth={2}>
                        <IconButton
                            className="suggest-close-button"
                            iconClassName="fa fa-times search-icon-error"
                            onClick={this.props.onCloseClick}
                        />
                        <div className="search-error">
                            Sorry, I couldn't find it.
                            {corrected ?
                                <div className="suggest-wrapper">
                                    <div className="suggest-text">Try this:</div>
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
                </div>
            )
        }
        return null;
    }
}

Correction.propTypes = {
    onCloseClick: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    correction: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    correctionSuccess: PropTypes.bool.isRequired,
};
Correction.defaultProps = {};

export default Correction;
