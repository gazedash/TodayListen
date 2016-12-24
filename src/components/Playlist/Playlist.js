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
                className="play-button"
            />);
        }

        return (
            <span className="song-number">
                {id + 1}
            </span>
        );
    }

    renderRemoveButton(i) {
        return (<IconButton
                iconStyle={{
                    fontSize: 10,
                }}
                onTouchTap={() => this.props.onDeleteClick(i)}
                className="play-button"
                iconClassName="fa fa-minus"
            />
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
                            className="song-item"
                            onTouchTap={this.props.onClick.bind(this, i, song.artist)}
                            leftIcon={this.renderIcon(i)}
                            rightIconButton={this.renderRemoveButton(i)}
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
    onDeleteClick: PropTypes.func.isRequired,
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