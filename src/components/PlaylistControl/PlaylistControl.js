import React, {Component, PropTypes} from "react";
import IconButton from "material-ui/IconButton";
import {Toolbar, ToolbarGroup, ToolbarTitle} from "material-ui/Toolbar";
import "./PlaylistControl.css";

export default class PlaylistControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 3,
        };
    }

    handleChange = (event, index, value) => this.setState({value});

    render() {
        return (
            <Toolbar className="playlist-control">
                <ToolbarGroup firstChild={true}>
                    <ToolbarTitle className="playlist-control-title" text="Playlist"/>
                </ToolbarGroup>
                <ToolbarGroup className="playlist-control-buttons" lastChild={true}>
                    <IconButton
                        className="playlist-control-button"
                        iconClassName="fa fa-refresh playlist-control-icon"
                        onClick={this.props.onRefresh}
                    />
                    <IconButton
                        className="playlist-control-button"
                        iconClassName="fa fa-trash playlist-control-icon"
                        onClick={this.props.onClear}
                    />
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

PlaylistControl.propTypes = {
    onRefresh: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};
PlaylistControl.defaultProps = {};