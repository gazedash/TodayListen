import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectArtist, fetchArtistsIfNeeded, invalidateArtist } from '../actions/artist';
import Picker from '../components/Picker'
import Playlist from '../components/Playlist'
import Artists from '../components/Artists'

class AsyncApp extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this)
    }

    componentDidMount() {
        const { dispatch, selectedArtist } = this.props;
        dispatch(fetchArtistsIfNeeded(selectedArtist))
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedArtist !== this.props.selectedArtist) {
            const { dispatch, selectedArtist } = nextProps;
            dispatch(fetchArtistsIfNeeded(selectedArtist))
        }
    }

    handleChange(nextArtist) {
        this.props.dispatch(selectArtist(nextArtist))
    }

    handleRefreshClick(e) {
        e.preventDefault();

        const { dispatch, selectedArtist } = this.props;
        dispatch(invalidateArtist(selectedArtist));
        dispatch(fetchArtistsIfNeeded(selectedArtist))
    }

    render() {
        const { selectedArtist, posts, isFetching } = this.props;
        return (
            <div>
                <Picker value={selectedArtist}
                        onChange={this.handleChange}
                        options={[ 'Mono', 'frontend' ]}
                />
                {!isFetching ? <h6><a href='#' onClick={this.handleRefreshClick}> Refresh</a></h6> : null}
                {isFetching && posts.length === 0 ? <h6>Loading...</h6> : null}
                {!isFetching && posts.length === 0 ? <h6>Empty.</h6> : null}
                {posts.length > 0 ? <Artists items={posts} /> : null}
                <Playlist songs={[1, 2]} />
            </div>
        )
    }
}

AsyncApp.propTypes = {
    selectedArtist: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { selectedArtist, suggestedArtists } = state;
    const {
        isFetching,
        lastUpdated,
        items: posts
    } = suggestedArtists[selectedArtist] || {
        isFetching: true,
        items: []
    };

    return {
        selectedArtist,
        posts,
        isFetching,
        lastUpdated
    }
}

export default connect(mapStateToProps)(AsyncApp);