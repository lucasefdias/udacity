import React from 'react'

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
    }

    // -------------------------------
    // Text input methods
    // -------------------------------
    onQueryChange = (e) => {
        // Update query string with new query
        let queryString = this.sanitizeInput(e.target.value);
        this.props.onChange(queryString);
        // Reset any toggled SidebarItem
        this.props.turnTextFilterOn();
        // Reset selected venue
        this.props.resetVenue();
    }
    // Sanitize text search
    sanitizeInput = (string) => {
        return string.trim().toLowerCase();
    }

    render() {
        return (
          <div id="searchBarDiv">
            <input
              id="searchVenue"
              onChange={this.onQueryChange}
              type="text"
              placeholder="Search a venue"
              value={this.props.queryString} />
         </div>
      );
    }
}

export default SearchBar
