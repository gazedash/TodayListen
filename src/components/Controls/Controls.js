import React, {PropTypes} from "react";
import IconButton from "material-ui/IconButton";
import {ToolbarGroup} from "material-ui/Toolbar";
import {BottomNavigation} from "material-ui/BottomNavigation";
import Paper from "material-ui/Paper";
import "./Controls.css";

const Controls = React.createClass({
    render() {
        const {isPlaying, style} = this.props;

        return (
            <Paper zDepth={1}>
                <BottomNavigation
                    style={style}
                    className={`controls ${this.props.className}`}
                >
                    <ToolbarGroup>
                        <IconButton
                            className="control-button"
                            iconClassName="fa fa-chevron-circle-left control-icon"
                            onClick={() => this.props.prev(false)}
                        />
                        <IconButton
                            className="control-button"
                            iconClassName={"control-icon " + (isPlaying ? "fa fa-pause" : "fa fa-play-circle")}
                            onClick={() => this.props.play()}
                        />
                        <IconButton
                            className="control-button"
                            iconClassName="fa fa-chevron-circle-right control-icon"
                            onClick={() => this.props.next()}
                        />
                    </ToolbarGroup>
                </BottomNavigation>
            </Paper>
        );
    }
});

Controls.propTypes = {
    className: PropTypes.string,
    next: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    style: PropTypes.object,
    isPlaying: PropTypes.bool.isRequired,
};

Controls.defaultProps = {
    className: "",
    style: null,
};

export default Controls;
