import React, {PropTypes, Component} from "react";
import IconButton from "material-ui/IconButton";
import {List, ListItem} from "material-ui/List";
import "./Playlist.css";

export default class Playlist extends Component {
    renderIcon(id) {
        const {isPlaying, playingId} = this.props;

        if (playingId === id) {
            return (<IconButton
                iconClassName={isPlaying ? "fa fa-pause" : "fa fa-play-circle"}
                style={{
                    padding: "0px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            />);
        }

        return (
            <span style={{
                color: "#aaa",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                {id + 1}
            </span>
        );
    }

    render() {
        return (
            <List
                style={this.props.style}
                className="playlist"
            >
                {this.props.items.map((song, i) => {
                    return (
                        <ListItem
                            style={{
                                fontSize: 14,
                            }}
                            onClick={this.props.onClick.bind(this, i, song.artist)}
                            leftIcon={this.renderIcon(i)}
                            key={i}
                        >
                            {song.song}
                        </ListItem>
                    )
                })}
            </List>
        )
    }
}

Playlist.propTypes = {
    onClick: PropTypes.func.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    playingId: PropTypes.number.isRequired,
    opts: PropTypes.object,
    style: PropTypes.object,
    items: PropTypes.array.isRequired
};

Playlist.defaultProps = {
    style: null,
    opts: null,
};