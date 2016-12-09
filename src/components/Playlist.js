import React, { PropTypes, Component } from 'react'

export default class Playlist extends Component {
    render() {
        return (
            <ul style={this.props.style}>
                {this.props.items.map((song, i) =>
                    <li key={i}>{song}</li>
                )}
            </ul>
        )
    }
}

Playlist.propTypes = {
    style: PropTypes.object,
    items: PropTypes.array.isRequired
};