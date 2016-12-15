import React, {PropTypes} from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import {List, ListItem} from "material-ui/List";
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

    renderItem(artist, index) {
        const {selectedId, isSelected} = this.state;
        let itemStyle = {
            fontSize: 14,
        };
        if (selectedId === index && isSelected) {
            itemStyle = {
                backgroundColor: '#55d680',
                fontSize: 14,
            }
        }

        return (
            <ListItem
                style={itemStyle}
                leftIcon={null}
                onClick={() => this.onArtistClick(index)}
                key={index}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 230,
                    }}
                >
                    <img style={{
                        alignSelf: 'center',
                    }}
                         alt={artist.name}
                         src={artist.image[2]["#text"]}/>
                    <div style={{
                        textAlign: 'center',
                        marginTop: 8,
                    }}>{artist.name}</div>
                </div>
            </ListItem>

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
                    }}
                    className="artist-picker"
                    title="Pick artist"
                    titleStyle={{}}
                    actions={actions}
                    modal={false}
                    open={this.props.isOpen}
                    onRequestClose={this.props.onClose}
                >

                    <List
                        style={{
                            paddingTop: 0,
                            display: 'flex',
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
