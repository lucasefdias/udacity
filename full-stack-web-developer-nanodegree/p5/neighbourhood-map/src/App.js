import React from 'react';
import './App.css';
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
            isFilterOn: false,
            selectedVenues: [],
            venues: [],
            venuesRetrieved: false
        };
        // Bind methods
        this.getVenues = this.getVenues.bind(this);
        this.turnFilterOn = this.turnFilterOn.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.resetSelectedVenues = this.resetSelectedVenues.bind(this);
        this.updateSelectedVenues = this.updateSelectedVenues.bind(this);
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
                console.log("API response received!");
                let venuesResponse = result.response.groups[0].items;
                let venues = [];

                // Build "sanitized" array
                venuesResponse.forEach(function(venue){
                    venues.push(venue.venue);
                });

                console.log("Old state:");
                console.log(this.state);

                // Update venues state
                this.setState({
                    venues: venues,
                    venuesRetrieved: true,
                    selectedVenues: venues
                });

                console.log("New state:");
                console.log(this.state);
            })
            .catch(error => {
                console.error('Failed retrieving information', error);
            });
    }


    // ------------------------------------------
    // Filter methods
    // ------------------------------------------
    resetFilter() {
        this.setState({
            isFilterOn: false
        }, this.resetSelectedVenues);
    }
    turnFilterOn() {
        this.setState({
            isFilterOn: true
        });
    }
    resetSelectedVenues() {
        this.setState({
            selectedVenues: this.state.venues
        });
    }
    updateSelectedVenues(newSelectedVenues) {
        this.setState({
            selectedVenues: newSelectedVenues
        });
    }

    render() {
        // Define button method based on filter state
        let buttonMethod;

        if(this.state.isFilterOn) {
            buttonMethod = this.resetFilter;
        } else {
            buttonMethod = this.turnFilterOn;
        }

        console.log()
        return (
            <div className="App">
                <Navbar />
                <Sidebar
                    isFilterOn={this.state.isFilterOn}
                    buttonMethod={buttonMethod}
                    selectedVenues={this.state.selectedVenues}
                    updateSelectedVenues={this.updateSelectedVenues}
                    venuesRetrieved={this.venuesRetrieved}/>
                <MapContainer
                    selectedVenues={this.state.selectedVenues}
                    venuesRetrieved={this.venuesRetrieved}/>
            </div>
        );
    }
}

export default App;
