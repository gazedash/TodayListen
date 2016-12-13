import React, {PropTypes} from "react";
import IconButton from "material-ui/IconButton";
import {ToolbarGroup} from "material-ui/Toolbar";
import {BottomNavigation} from "material-ui/BottomNavigation";
import Paper from 'material-ui/Paper';
import "./Controls.css";

const Controls = React.createClass({
    render() {
        const {isPlaying, style} = this.props;
        const largeIcon = {
            fontSize: 40,
        };

        const large = {
                width: 57,
                height: 57,
                padding: 0,
        };

        return (
            <Paper zDepth={1}>
            <BottomNavigation
                style={style}
                className="controls"
            >
                <ToolbarGroup>
                    <IconButton
                        style={large}
                        iconStyle={largeIcon}
                        iconClassName="fa fa-chevron-circle-left"
                        onClick={this.props.prev.bind(this, false)}
                    />
                    <IconButton
                        style={large}
                        iconStyle={largeIcon}
                        iconClassName={isPlaying ? "fa fa-pause" : "fa fa-play-circle"}
                        onClick={() => this.props.play()}
                    />
                    <IconButton
                        style={large}
                        iconStyle={largeIcon}
                        iconClassName="fa fa-chevron-circle-right"
                        onClick={this.props.next.bind(this, false)}
                    />
                </ToolbarGroup>
            </BottomNavigation>
            </Paper>
        );
    }
});

Controls.propTypes = {
    next: PropTypes.func.isRequired,
    prev: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    style: PropTypes.object,
    isPlaying: PropTypes.bool.isRequired,
};

Controls.defaultProps = {
  style: null,
};

export default Controls;
