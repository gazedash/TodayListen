import React, {PropTypes} from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import {List, ListItem} from "material-ui/List";
import ImageLoader from "react-imageloader";
import "./ArtistPicker.css";

export default class ArtistPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedId: null,
            isSelected: false,
        }
    }

    onArtistClick(nextId) {
        this.setState((prevState) => ({
            selectedId: nextId,
            isSelected: !prevState.isSelected || prevState.selectedId !== nextId,
        }));
    }

    renderImage(artist) {
        const unknown = (<div className="artist-image" >
                <i className="fa fa-4x fa-question unknown-artist"
                />
            </div>
        );

        if (artist.image[2]["#text"] === '') {
            return (unknown)
        }

        return (
            <ImageLoader
                className="image-loader"
                src={artist.image[2]["#text"]}
                wrapper={React.DOM.div}
                preloader={() => unknown}>
                Image load failed!
            </ImageLoader>
        )
    }

    renderItem(artist, index) {
        const {selectedId, isSelected} = this.state;

        return (
            <div
                key={index}
                className="artist-list-item-container"
            >
                <ListItem
                    className={"artist-list-item" + (selectedId === index && isSelected ? " artist-list-item-selected" : null)}
                    leftIcon={null}
                    onClick={() => this.onArtistClick(index)}
                >
                    <div className="artist-image-container">
                        {this.renderImage(artist)}
                        <div className="artist-name">{artist.name}</div>
                    </div>
                </ListItem>
            </div>
        )
    }

    render() {
        const {items} = this.props;
        const {selectedId} = this.state;

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.props.onClose}
            />,
            <FlatButton
                label="Let's go"
                primary={true}
                keyboardFocused={true}
                disabled={!items.length}
                onClick={() => this.props.onSubmit(items[selectedId].name)}
            />,
        ];

        // List
        // justifyContent: 'center',

        return (
            <div className="artist-picker-container">
                <IconButton
                    className="suggest-button"
                    iconClassName="fa fa-lightbulb-o suggest-icon"
                    onClick={this.props.onOpen}
                />
                <Dialog
                    bodyClassName="dialog-body"
                    contentClassName="dialog-content"
                    className="artist-picker"
                    title="Pick artist"
                    actions={actions}
                    modal={false}
                    open={this.props.isOpen}
                    onRequestClose={this.props.onClose}
                >
                    <List className="artist-list">
                        {items.map((artist, i) => {
                            return (this.renderItem(artist, i))
                        })}
                    </List>
                </Dialog>
            </div>
        );
    }
}

ArtistPicker.propTypes = {
    items: PropTypes.array,
    isOpen: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

ArtistPicker.defaultProps = {
    items: [],
};
