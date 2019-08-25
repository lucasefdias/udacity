import React from 'react'
import '../App.css';

// --------------------------------------------
// VenueInfoBox component
// --------------------------------------------
class VenueInfoBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // Get relevant props
        const selectedVenue = this.props.selectedVenue;

        if(this.props.clickFilterActive){
            return (
                <div id="infoWindow">
                    <h3 id="venueName">
                    {selectedVenue.name}
                    </h3>
                    <h5 id="address">
                    {selectedVenue.location.formattedAddress.join()}
                    </h5>
                    <p id="description">
                        <strong>
                            Category:
                        </strong>
                        {selectedVenue.categories[0].name}
                    </p>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default VenueInfoBox;
