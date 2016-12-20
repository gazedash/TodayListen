import React, {PropTypes} from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import {List, ListItem} from "material-ui/List";
import "./ArtistPicker.css";
import ImageLoader from "react-imageloader";

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
        let imageStyle = {
            display: 'flex',
            alignSelf: 'center',
            height: 174,
            width: 174,
        };

        if (artist.image[2]["#text"] === '') {
            return (
                <div style={imageStyle}>
                    <i style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }}
                       className="fa fa-4x fa-question"
                    />
                </div>
            )
        }

        return (
            <ImageLoader
                style={{
                    alignSelf: 'center',
                }}
                src={artist.image[2]["#text"]}
                wrapper={React.DOM.div}
                preloader={() => <div style={imageStyle}>
                    <i style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }}
                    className="fa fa-4x fa-question"
                    />
                    </div>}>
                Image load failed!
            </ImageLoader>
        )
    }

    renderItem(artist, index) {
        const {selectedId, isSelected} = this.state;

        let itemStyle = {
            justifyContent: 'center',
            display: 'flex',
            fontSize: 14,
        };

        if (selectedId === index && isSelected) {
            itemStyle = {
                justifyContent: 'center',
                display: 'flex',
                backgroundColor: '#55d680',
                fontSize: 14,
            }
        }


        return (
            <div
                key={index}
                style={{
                    flexGrow: 1,
                    minWidth: '25%',
                }}
            >
            <ListItem
                style={itemStyle}
                leftIcon={null}
                onClick={() => this.onArtistClick(index)}
            >
                <div
                    style={{
                        maxWidth: 174,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 230,
                    }}
                >
                    {this.renderImage(artist)}
                    <div style={{
                        textAlign: 'center',
                        marginTop: 8,
                    }}>{artist.name}</div>
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
                onClick={() => this.props.onSubmit(items[selectedId].name)}
            />,
        ];

        const largeIcon = {
            color: 'white',
            fontSize: 20,
        };

        const large = {
            width: 57,
            height: 57,
            padding: 0,
        };


        // List
        // justifyContent: 'center',

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <IconButton
                    style={large}
                    iconStyle={largeIcon}
                    iconClassName="fa fa-lightbulb-o"
                    onClick={this.props.onOpen}
                />
                <Dialog
                    bodyStyle={{
                        paddingBottom: 0,
                        overflowY: 'scroll',
                    }}
                    contentClassName="artist-picker content"
                    contentStyle={{
                        width: 'fit-content',
                    }}
                    className="artist-picker"
                    title="Pick artist"
                    actions={actions}
                    modal={false}
                    open={this.props.isOpen}
                    onRequestClose={this.props.onClose}
                >
                    <List
                        style={{
                            paddingTop: 0,
                            display: 'flex',
                            flexWrap: 'wrap',
                        }}
                    >
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
