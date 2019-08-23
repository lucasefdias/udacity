import React from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import '../App.css';
import GoogleMapsAPI from './googleMapsConfig.js';

// --------------------------------------------
// Map components
// --------------------------------------------
export class MapContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            googleMapsConfig: GoogleMapsAPI,
            activeMarker: null,
            showingInfoWindow: false,
            markers: []
        };
        // Bind window (global) fallback method to component fallback
        window.gm_authFailure = this.gm_authFailure;
    }

    componentDidUpdate(prevProps){
        // Get relevant props
        const selectedVenue = this.props.selectedVenue;
        const selectedVenues = this.props.selectedVenues;
        const query = this.props.query;

        // Initial setup
        if(this.props.venuesRetrieved && this.props.venues !== prevProps.venues){
            this.resetMarkers();
        }

        // Load markers on map once selected venues are updated in the parent component
        // If there is any query text (either by selection or input) prevents re-render all markers
        // (using filterMarkerOnMap instead)
        else if (selectedVenues.length && (selectedVenues !== prevProps.selectedVenues)) {
            if (!query) {
                this.resetMarkers();
            }
        }

        // Filter markers if props changed and update state
        else if (selectedVenues !== prevProps.selectedVenues && query) {
            this.filterMarkersOnMap();
        }

        // Animate selected venue marker whenever it is selected on the sidebar or clicked on map
        if(selectedVenue && prevProps.selectedVenue){
            if (selectedVenue.name !== prevProps.selectedVenue.name) {
                this.setState({
                    markers: this.animateSelectedMarker()
                });
            }
        }
    }

    // -------------------------------
    // Error handling
    // -------------------------------
    gm_authFailure = () => {
        this.setState({
            googleMapError: true
        });
    };

    // -------------------------------
    // Marker methods
    // -------------------------------
    loadMarkersOnMap = () => {
        // Get selected markers
        const selectedVenues = this.props.selectedVenues;

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
                                onClick={mapContainer.onMarkerClick}
                                animation={mapContainer.props.google.maps.Animation.DROP} />);
            });
        }

        return markers;
    }

    filterMarkersOnMap = () => {
        const selectedVenues = this.props.selectedVenues;
        let markers = this.state.markers;

        // Loop through markers array to find which markers are selected in the filter
        markers.forEach(function(marker){
            // If a marker is present in the selection, set map to current map
            if(!selectedVenues.includes(marker.venue)){
                marker.setMap(null);
            }
        });

        console.log(markers);

        // Return the updated markers array
        this.updateMarkers(markers);
    }
    updateMarkers = (markers) => {
        this.setState({
            markers: markers
        });
    }
    resetMarkers = () => {
        this.setState({
            markers: this.loadMarkersOnMap()
        });
    }

    onMarkerClick = (props, marker, e) => {
        // Update father component state with selected marker
        // this.props.onMarkerClick(marker);
        // Animate marker
        this.toggleBounce(marker);
        // Build InfoWindow
        this.buildInfoWindowContent(props);
    }
    toggleBounce = (marker) => {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
        }
    }
    animateSelectedVenue = (venueId) => {
        // destructure the app's state object into individual variables
        const { map, markers, largeInfowindow } = this.state;

        // Loop through markers array to find the impacted marker
        markers.forEach(function(marker){
            if (venueId === marker.venue.id) {
                // Set animation for marker
                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                // Open InfoWindow for the selected venue
                // GoogleMap.populateInfoWindow(map, markers[i], largeInfowindow);
            } else {
                // Set animation of all other maps to null
                marker.setAnimation(null);
            }

        });
        // Return the updated markers array
        return markers;
    };

    // -------------------------------
    // InfoWindow methods
    // -------------------------------
    onClose = (props) => {
        // Manage state
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    }
    buildInfoWindowContent = () => {

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
        let markers = this.state.markers;

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
