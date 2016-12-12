import React, {
    PropTypes,
} from 'react';
import TextField from "material-ui/TextField";
import './Search.css'

const Search = React.createClass({
    render() {
        return (
            <TextField
                className="search"
                fullWidth={true}
                inputStyle={{
                    color: '#fff !important',
                }}
                style={{
                    marginTop: 8,
                }}
                underlineStyle={{
                    display: 'none',
                }}
                underlineFocusStyle={{
                    backgroundColor: '#fff',
                    height: 2,
                    display: 'block',
                }}
            />

        );
    }
});

export default Search;
