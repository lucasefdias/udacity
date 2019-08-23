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
            query: '',
            selectedVenues: [],
            venues: [],
            venuesRetrieved: false,
            activeMarker: null,
            showingInfoWindow: false,
            selectedVenue: null
        };
    }

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

                // Build "sanitized" array
                venuesResponse.forEach(function(venue){
                    venues.push(venue.venue);
                });

                // Update venues state
                this.setState({
                    venues: venues,
                    venuesRetrieved: true,
                    selectedVenues: venues
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
            query: queryString
        }, this.filterByText);
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
            selectedVenue: null
        });
    }

    // SidebarItem select methods
    filterByClick = (venue) => {
        // Select clicked venue
        this.selectVenue(venue);
    }
    resetFilter = () => {
        // Reset selected venue and clear filters
        this.resetVenue();
    }

    // ------------------------------------------
    // Venue selection methods
    // ------------------------------------------
    resetSelectedVenues = () => {
        this.setState({
            selectedVenues: this.state.venues
        });
    }
    updateSelectedVenues = (newSelectedVenues) => {
        this.setState({
            selectedVenues: newSelectedVenues
        });
    }
    selectVenue = (venue) => {
        // Set state to selected venue
        this.setState({
            selectedVenue: venue
        });
        // Update query string and filter sidebar
        this.updateQuery(venue.name.trim().toLowerCase());
    }
    resetVenue = () => {
        // Set selected venue state to null
        this.setState({
            selectedVenue: null
        });
        // Update query string and filter sidebar
        this.updateQuery('');
    }


    // ------------------------------------------
    // Map methods
    // ------------------------------------------
    selectMarker = (marker) => {
        // Manage state when marker is clicked
        this.setState({
            activeMarker: marker,
            showingInfoWindow: true,
            selectedVenue: marker.venue
        });
    }
    onClose = (props) => {
        // Manage state when InfoWindow is closed
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null,
                selectedVenue: null
            });
        }
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
                        queryString={this.state.query}
                        selectedVenue= {this.state.selectedVenue}
                        selectedVenues={this.state.selectedVenues}
                        venues={this.state.venues}
                        venuesRetrieved={ this.state.venuesRetrieved}/>
                </ErrorBoundary>
            </div>
        );
    }
}

export default App;
