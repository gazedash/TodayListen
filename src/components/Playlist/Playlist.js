import React, {PropTypes, Component} from "react";
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import "./Playlist.css";

export default class Playlist extends Component {
    render() {
        const {isPlaying, playingId} = this.props;

        return (
            <List
                style={this.props.style}
                className="playlist"
            >
                {this.props.items.map((song, i) => {
                    let playingIcon = <span style={{
                        color: "#aaa",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>{i+1}</span>;
                    if (playingId === i) {
                        playingIcon = (<IconButton
                            iconClassName={isPlaying? "fa fa-pause" : "fa fa-play-circle"}
                            style={{
                                padding: "0px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onClick={() => this.props.play()}
                        />)
                    }

                    return (
                        <ListItem
                            onClick={this.props.onClick.bind(this, i)}
                            leftIcon={playingIcon}
                            key={i}
                        >
                            {song.query}
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
