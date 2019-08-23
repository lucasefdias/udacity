import React from 'react'
import '../App.css';

// --------------------------------------------
// Navbar components
// --------------------------------------------
class Navbar extends React.Component {
    render() {
        return (
            <header className="App-header">
                <nav className="Navbar">
                    <a className="Navbar-brand" href="/">Neighbourhood Map</a>
                    <div className="Api-attribution">
                        Powered by Google Maps and Foursquare API data
                    </div>
                </nav>
            </header>
        );
    }
}

export default Navbar;
