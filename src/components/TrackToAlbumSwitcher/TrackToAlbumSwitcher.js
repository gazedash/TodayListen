import React, {
    Component,
    PropTypes,
} from 'react';
import Toggle from 'material-ui/Toggle';

const styles = {
    toggle: {
        marginBottom: 16,
    },
    thumbOff: {
        backgroundColor: '#ffa9d1',
    },
    trackOff: {
        backgroundColor: '#ffcfde',
    },
    thumbSwitched: {
        backgroundColor: '#ff3399',
    },
    trackSwitched: {
        backgroundColor: '#ff55a9',
    },
    labelStyle: {
        color: '#ff3399',
    },
};

class TrackToAlbumSwitcher extends Component {
    render() {
        return (
            <div style={{
                width: 'fit-content',
                display: 'flex',
                alignItems: 'center',
            }}>
                <Toggle
                    onToggle={this.props.onToggle}
                    toggled={this.props.toggled}
                    thumbStyle={styles.thumbOff}
                    trackStyle={styles.trackOff}
                    thumbSwitchedStyle={styles.thumbSwitched}
                    trackSwitchedStyle={styles.trackSwitched}
                    labelStyle={styles.labelStyle}
                />
            </div>
        );
    }
}

TrackToAlbumSwitcher.propTypes = {
    onToggle: PropTypes.func.isRequired,
    toggled: PropTypes.bool.isRequired,
};
TrackToAlbumSwitcher.defaultProps = {};

export default TrackToAlbumSwitcher;
