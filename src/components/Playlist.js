import React, { PropTypes, Component } from 'react'

export default class Playlist extends Component {
    render() {
        return (
            <ul style={this.props.style}>
                {this.props.songs.map((song, i) =>
                    <li key={i}>{JSON.stringify(song)}</li>
                )}
            </ul>
        )
    }
}

Playlist.propTypes = {
    style: PropTypes.object,
    songs: PropTypes.array.isRequired
};