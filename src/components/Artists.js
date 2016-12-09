import React, { PropTypes, Component } from 'react'

export default class Artists extends Component {
    render() {
        return (
            <ul style={this.props.style}>
                {this.props.items.map((artist, i) =>
                    <li key={i}>{artist.name}</li>
                )}
            </ul>
        )
    }
}

Artists.propTypes = {
    style: PropTypes.object,
    items: PropTypes.array.isRequired
};