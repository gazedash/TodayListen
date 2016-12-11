import React, {PropTypes, Component} from "react";
import "./Playlist.css";

export default class Playlist extends Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
        this.state = {
            play: false,
            active: 0,
        }
    }

    render() {
        const {playing, current} = this.props;

        return (
            <div style={this.props.style}>
                {this.props.items.map((song, i) => {
                    return (
                        <div onClick={this.props.onClick} className="playlist-item" key={i}>
                            {playing && current === i ?
                                <span>
                                    <i className="fa fa-play playing"/>
                                </span> : null}
                                {song.query}
                        </div>
                    )
                })}
            </div>
        )
    }
}

Playlist.propTypes = {
    onClick: PropTypes.func,
    playing: PropTypes.bool,
    current: PropTypes.number,
    opts: PropTypes.object,
    style: PropTypes.object,
    items: PropTypes.array.isRequired
};