import React, {PropTypes, Component} from "react";

export default class Playlist extends Component {
    constructor(props) {
        super(props);
        // this.handleChange = this.handleChange.bind(this);
        this.state = {
            play: false,
            active: 0,
        }
    }

    onClick(event, i) {
        event.preventDefault();
        this.setState((prevState) => ({
            play: !prevState.play,
        }));
        console.log("HEY PATIMAKER");

        // const player = this.refs.youtube._internalPlayer;
        // player.pauseVideo();

        // event.target.pauseVideo();
    }

    onPlay(event, i) {
        console.log(i);
        this.setState((prevState) => ({
            [i]: event,
        }));
    }

    render() {
        const {playing, current} = this.props;

        return (
            <div style={this.props.style}>
                {this.props.items.map((song, i) => {
                    return (
                        <div key={i}>
                            {playing && current === i ?
                                <span onClick={() => this.props.onClick()}> !!! </span> : null}
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