import React, { PropTypes, Component } from 'react'

export default class Artists extends Component {
    render() {
        return (
            <div style={this.props.style}>
                {this.props.items.map((artist, i) =>
                    <span style={{
                        backgroundColor: `#${2*i+2}${1*i+4}${3*i+1}`,
                        margin: "0px 5px 0px 5px",
                    }} key={i}>{artist.name}</span>
                )}
            </div>
        )
    }
}

Artists.propTypes = {
    style: PropTypes.object,
    items: PropTypes.array.isRequired
};