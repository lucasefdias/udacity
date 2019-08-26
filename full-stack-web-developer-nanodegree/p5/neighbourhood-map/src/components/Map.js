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
            googleMapsConfig: GoogleMapsAPI
        };

        this.references = {};

        // Bind window (global) fallback method to component fallback
        window.gm_authFailure = this.gm_authFailure;
    }

    getOrCreateRef = (id) => {
        if (!this.references.hasOwnProperty(id)) {
            this.references[id] = React.createRef();
        }
        return this.references[id];
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
    getVisibleMarkers = () => {
        // Get markers and context
        const markers = this.props.markers;
        const mapComponent = this;

        // Visible markers array
        let visibleMarkers;

        // If markers array is loaded, filter visible markers and map them to
        // visibleMarkers array
        if(markers) {
            visibleMarkers = markers
                                .filter(marker => marker.isVisible)
                                .map((marker, index, arr) => {
                                    // Select appropriate animation
                                    let animation = mapComponent.setMarkerAnimation(marker, arr);
                                    return(
                                        <Marker
                                            ref={mapComponent.getOrCreateRef(marker.venue.id)}
                                            name={marker.venue.name}
                                            id={marker.venue.id}
                                            key={marker.venue.id}
                                            position={
                                                {
                                                    lat: marker.lat,
                                                    lng: marker.lng
                                                }
                                            }
                                            animation={animation}
                                            onClick={mapComponent.onMarkerClick}
                                            venue={marker.venue}
                                            isOpen= {marker.isOpen} />
                                    );
                                });
        }

        return visibleMarkers;
    }
    onMarkerClick = (props, marker, e) => {
        this.props.handleMarkerClick(marker);
    }
    setMarkerAnimation = (marker, arr) => {
        // Get relevant props
        const google = this.props.google;
        const markerSelected = this.props.markerSelected;
        const query = this.props.query;
        const markers = this.props.markers;

        // Initially, animation is set to null
        let animation = null;

        // If a marker is open (selected) it should bounce
        if(marker.isOpen){
            animation = google.maps.Animation.BOUNCE;
        }
        // If no marker is selected and all markers are visible and no query
        // is active, the marker should drop (re-enter)
        else if(!markerSelected && !query && arr.length === markers.length) {
            animation = google.maps.Animation.DROP;
        }

        return animation;
    }

    // -------------------------------
    // InfoWindow methods
    // -------------------------------
    buildInfoWindowContent = () => {

        // Manage Info Window Content
        let selectedVenue;

        // Check for an active marker or click filter.
        // If there is no selected marker or location on sidebar,
        // build a default object (this avoid errors like "Cannot read property
        // 'x' of undefined")
        if(this.props.activeMarker) {
            selectedVenue = this.props.activeMarker.venue;
        }
        else if(this.props.clickFilterActive) {
            selectedVenue = this.props.selectedVenue;
        }
        else {
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
    onClose = () => {
        this.props.handleInfoWindowClose();
    }
    setInfoWindowMarker = () => {
        // Get relevant props
        const activeMarker = this.props.activeMarker;
        const clickFilterActive = this.props.clickFilterActive;
        const selectedVenue = this.props.selectedVenue;

        let infoWindowMarker = null;

        // Check first for the simplest case (activeMarker is not null)
        if(activeMarker) {
            infoWindowMarker = activeMarker;
        }
        // Then check if click filter is active, which means that there is a selected venue
        else if(clickFilterActive) {
            infoWindowMarker = this.references[selectedVenue.id].current["marker"];
        }

        return infoWindowMarker;
    }

    render() {
        // Get relevant props and state
        const center = this.state.googleMapsConfig.center;
        const zoom = this.state.googleMapsConfig.zoom;
        const google = this.props.google;

        // Display all markers filtered (visible) markers
        let visibleMarkers = this.getVisibleMarkers();

        // Build InfoWindow
        let selectedVenue = this.buildInfoWindowContent();
        let infoWindowMarker = this.setInfoWindowMarker();

        return (
            <Map
                google={google}
                initialCenter={center}
                zoom={zoom}
                >
                {visibleMarkers}
                <InfoWindow
                    position={
                        infoWindowMarker
                        ? infoWindowMarker.position
                        : null
                    }
                    pixelOffset={new google.maps.Size(0,-50)}
                    visible={this.props.markerSelected}
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
