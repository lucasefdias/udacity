import React from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary.js';
import FoursquareAPI from './components/Foursquare.js';
import MapContainer from './components/Map.js';
import Navbar from './components/Navbar.js';
import Sidebar from './components/Sidebar.js';


// --------------------------------------------
// App (main) component
// --------------------------------------------
class App extends React.Component {

    // Set a constructor with state variables that control children components
    constructor(props) {
        super(props);
        this.state = {
            activeMarker: null,
            clickFilterActive: false,
            markers: [],
            markerSelected: false,
            query: '',
            selectedVenue: null,
            selectedVenues: [],
            venues: []
        };
    }

    // ------------------------------------------
    // Lifecycle methods
    // ------------------------------------------
    // Required for AJAX request
    componentDidMount() {
        this.getVenues();
    }

    // ------------------------------------------
    // Venue retrieval methods
    // ------------------------------------------
    // Get venues using the Foursquare API
    getVenues = () => {
        // Build API endpoint
        const endpoint = FoursquareAPI.buildUrl();

        // Fetch all venues using Foursquare API and add to array
        fetch(endpoint)
            .then(response => response.json())
            .then(result => {
                let venuesResponse = result.response.groups[0].items;
                let venues = [];

                // Build "sanitized" venues array
                venuesResponse.forEach(function(venue){
                    venues.push(venue.venue);
                });

                // Build markers array
                let markers = venues.map(venue => {
                    return {
                      lat: venue.location.lat,
                      lng: venue.location.lng,
                      isOpen: false,
                      isVisible: true,
                      id: venue.id,
                      venue: venue
                    };
                });

                // Update state
                this.setState({
                    venues: venues,
                    venuesRetrieved: true,
                    selectedVenues: venues,
                    markers: markers
                });
            })
            .catch(error => {
                console.error('Failed retrieving information', error);
            });
    }


    // ------------------------------------------
    // Filter methods
    // ------------------------------------------
    // SearchBar
    updateQuery = (queryString) => {
        this.setState({
            query: queryString,
            markerSelected: false
        }, function(){
            this.closeAllMarkers();
            this.filterByText();
        });
    }
    filterByText = () => {
        // Array for filtered venues
        let filteredVenues = [];
        let query = this.state.query;

        // If query string is not empty, search all venues for matches
        if(query) {
            this.state.venues.forEach(function(venue){
                if(venue.name.toLowerCase().includes(query)){
                    filteredVenues.push(venue);
                }
            });
            this.updateSelectedVenues(filteredVenues);
        }
         // When query string is empty, simply reset selection to include all venues
        else {
            this.resetSelectedVenues();
        }
    }
    resetVenueByText = () => {
        this.setState({
            markerSelected: false,
            clickFilterActive: false
        });
    }

    // SidebarItem select methods
    filterByClick = (venue) => {
        // Close markers
        this.closeAllMarkers();

        // Select clicked venue
        this.selectVenue(venue);
    }
    resetFilter = () => {
        this.setState({
            activeMarker: null,
            markerSelected: false,
            clickFilterActive: false
        });
        // Update query string and clear sidebar filter
        this.updateQuery('');
    }

    // ------------------------------------------
    // Venue selection methods
    // ------------------------------------------
    resetSelectedVenues = () => {
        this.setState({
            selectedVenues: this.state.venues
        }, this.filterMarkers);
    }
    updateSelectedVenues = (newSelectedVenues) => {
        this.setState({
            selectedVenues: newSelectedVenues
        }, this.filterMarkers);
    }
    selectVenue = (venue) => {
        // Loop through markers array to find which marker is selected in sidebar
        const markers = this.state.markers.map(marker => {
            if(marker.venue === venue){
                marker.isOpen = true;
            } else {
                marker.isOpen = false;
            }
            return marker;
        });
        // Update state, triggering a filter
        // In this case we don't call updateQuery because it closes all markers
        this.setState({
            activeMarker: null,
            clickFilterActive: true,
            markers: Object.assign(this.state.markers, markers),
            markerSelected: true,
            query: venue.name.trim().toLowerCase(),
            selectedVenue: venue
        }, this.filterByText);
    }

    // ------------------------------------------
    // Map methods
    // ------------------------------------------
    // Marker methods
    filterMarkers = () => {
        // Get relevant state
        let selectedVenues = this.state.selectedVenues;

        const markers = this.state.markers.map(marker => {
            if(selectedVenues.includes(marker.venue)){
                marker.isVisible = true;
            } else {
                marker.isVisible = false;
            }
            return marker;
        });
        this.setState({
            markers: Object.assign(this.state.markers, markers)
        });
    }
    closeAllMarkers = () => {
        const markers = this.state.markers.map(marker => {
            marker.isOpen = false;
            return marker;
        });
        this.setState({
            markers: Object.assign(this.state.markers, markers),
            markerSelected: false
        });
    };
    handleMarkerClick = (marker) => {
        let activeMarker = null;

        // Check marker state and toggle activeMarker accordingly
        if(!marker.isOpen) {
            activeMarker = marker;
        }

        // Turn on selected state
        this.setState({
            activeMarker: activeMarker
        });

        // Select marker on map
        this.selectClickedMarker(marker.venue);
    }
    selectClickedMarker = (clickedMarkerVenue) => {
        // Auxiliar variable
        let markerSelected = false;

        // Loop through all markers to see which one is open
        const markers = this.state.markers.map(marker => {
            if(marker.venue === clickedMarkerVenue){
                if(marker.isOpen){
                    marker.isOpen = false;
                } else {
                    marker.isOpen = true;
                    markerSelected = true;
                }
            } else {
                marker.isOpen = false;
            }
            return marker;
        });
        // Update markers on state
        this.setState({
            markers: Object.assign(this.state.markers, markers),
            markerSelected: markerSelected
        });
    }

    // InfoWindow methods
    handleInfoWindowClose = () => {
        this.closeAllMarkers();
    }

    render() {
        return (
            <div className="App">
                <ErrorBoundary>
                    <Navbar />
                </ErrorBoundary>
                <ErrorBoundary>
                    <Sidebar
                        selectedVenues={this.state.selectedVenues}
                        queryString={this.state.query}
                        updateQuery={this.updateQuery}
                        resetVenue={this.resetVenueByText}
                        filterByClick={this.filterByClick}
                        resetFilter={this.resetFilter}/>
                </ErrorBoundary>
                <ErrorBoundary>
                    <MapContainer
                        activeMarker={this.state.activeMarker}
                        clickFilterActive={this.state.clickFilterActive}
                        markers={this.state.markers}
                        markerSelected={this.state.markerSelected}
                        query={this.state.query}
                        selectedVenue={this.state.selectedVenue}
                        handleMarkerClick={this.handleMarkerClick}
                        handleInfoWindowClose={this.handleInfoWindowClose}
                        updateVisibleMarkers={this.updateVisibleMarkers}/>
                </ErrorBoundary>
            </div>
        );
    }
}

export default App;
