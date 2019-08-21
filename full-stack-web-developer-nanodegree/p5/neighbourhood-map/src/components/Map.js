import React from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import '../App.css';
import GoogleMapsAPI from './googleMapsConfig.js';

// Map components
// --------------------------------------------
export class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            googleMapsConfig: GoogleMapsAPI,
            activeMarker: null,
            showingInfoWindow: false,
            selectedVenue: null
        };
        // Bind methods
        this.displaySelectedMarkers = this.displaySelectedMarkers.bind(this);
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.buildInfoWindowContent = this.buildInfoWindowContent.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    // -------------------------------
    // Marker methods
    // -------------------------------
    onMarkerClick(props, marker, e) {
        // Turn on selected state
        this.setState({
            activeMarker: marker,
            showingInfoWindow: true,
            selectedVenue: marker.venue
        });
        console.log("selectedVenue:");
        console.log(this.state.selectedVenue);
        // Animate marker when clicked
        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        setTimeout(function(){
            marker.setAnimation(null);
        }, 1400);
    }
    displaySelectedMarkers() {
        // Get selected markers
        const selectedVenues = this.props.selectedVenues

        // Get MapContainer context
        const mapContainer = this;

        let markers = [];

        // Check if there is any selected venue and loop through array to build markers
        if(selectedVenues) {
            selectedVenues.forEach(function(venue){
                let markerPosition = {
                    lat: venue.location.lat,
                    lng: venue.location.lng
                }
                markers.push(<Marker
                                venue={venue}
                                key={venue.id}
                                name={venue.name}
                                id={venue.id}
                                position={markerPosition}
                                animation={mapContainer.props.google.maps.Animation.DROP}
                                onClick={mapContainer.onMarkerClick} />);
            });
        }

        return markers;
    }

    // -------------------------------
    // InfoWindow methods
    // -------------------------------
    onClose(props) {
        // Manage state
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
                selectedVenue: null
            });
        }
    }
    buildInfoWindowContent() {

        // Manage Info Window Content
        let selectedVenue;

        // Check for a selected venue in state. If there is no selected venue,
        // build a default object (this avoid errors like "Cannot read property
        // 'x' of undefined")
        if(this.state.selectedVenue) {
            selectedVenue = this.state.selectedVenue;
        } else {
            selectedVenue = {
                name: "Default name",
                location: {
                    formattedAddress: [
                        "Default",
                        "Address"
                    ]
                },
                categories: [
                    {
                        name: "Default category"
                    }
                ]
            };
        }

        return selectedVenue;
    }

    render() {
        // Get props and state
        const center = this.state.googleMapsConfig.center;
        const zoom = this.state.googleMapsConfig.zoom;

        // Display all markers from selected venues
        let markers = this.displaySelectedMarkers();

        // Manage Info Window Content
        let selectedVenue = this.buildInfoWindowContent();

        return (
          <Map
            google={this.props.google}
            initialCenter={center}
            zoom={zoom}>
            {markers}
            <InfoWindow
                marker={this.state.activeMarker}
                visible={this.state.showingInfoWindow}
                onClose={this.onClose}>
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
            </InfoWindow>
          </Map>
        );
    }
}

export default GoogleApiWrapper({
  apiKey: (GoogleMapsAPI.apiKey)
})(MapContainer)
