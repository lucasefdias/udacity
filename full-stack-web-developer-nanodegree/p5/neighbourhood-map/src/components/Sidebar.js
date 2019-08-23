import React from 'react'
import SearchBar from './SearchBar.js';
import '../App.css';


// --------------------------------------------
// Sidebar components
// --------------------------------------------
class Sidebar extends React.Component {

    // Set a constructor
    constructor(props) {
        super(props);
    }

    // -------------------------------
    // SearchBar methods
    // -------------------------------
    updateQuery = (queryString) => {
        this.props.updateQuery(queryString);
    }
    resetVenue = () => {
        this.props.resetVenue();
    }

    // -------------------------------
    // SidebarItem select methods
    // -------------------------------
    filterByClick = (venue) => {
        this.props.filterByClick(venue);
    }
    resetFilter = () => {
        this.props.resetFilter();
    }

    render() {
        return (
            <nav className="Sidebar" role="navigation">
                <div id="menuToggle">
                    {/*
                    A hidden checkbox is used as click reciever,
                    so we can use the :checked selector on it
                    */}
                    <input id="Sidebar-toggle" type="checkbox" />

                    {/* Menu icon*/}
                    <span></span>
                    <span></span>
                    <span></span>

                    {/* Sidebar is displayed when the menu icon is clicked*/}
                    <SidebarMenu
                        selectedVenues={this.props.selectedVenues}
                        queryString={this.props.queryString}
                        updateQuery={this.updateQuery}
                        resetVenue={this.resetVenue}
                        filterByClick={this.filterByClick}
                        resetFilter={this.resetFilter}/>
                </div>
            </nav>
        );
    }
}

class SidebarMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            isTextFilterOn : false
        };
    }

    // -------------------------------
    // SearchBar methods
    // -------------------------------
    updateQuery = (queryString) => {
        this.props.updateQuery(queryString);
    }
    resetVenue = () => {
        this.props.resetVenue();
    }

    // -------------------------------
    // SidebarItem select methods
    // -------------------------------
    // Toggle methods
    resetTextFilter = () => {
        this.setState({
          isTextFilterOn: false
        });
    }
    turnTextFilterOn = () => {
        this.setState({
          isTextFilterOn: true
        });
    }

    // Click filter methods
    filterByClick = (venue) => {
        this.props.filterByClick(venue);
    }
    resetFilter = () => {
        this.props.resetFilter();
        this.resetTextFilter();
    }

    render() {
        // Get relevant props and state
        const isTextFilterOn = this.state.isTextFilterOn;
        const selectedVenues = this.props.selectedVenues;

        // Store component context
        const sidebarMenuComponent = this;

        // Elements to be rendered
        let renderedList = [];

        // Check if there are any selected venues and iterate through array to build list
        if(selectedVenues) {
            selectedVenues.forEach(function(venue){
                renderedList.push(<SidebarItem
                                    key={venue.id}
                                    isTextFilterOn={isTextFilterOn}
                                    venue={venue}
                                    filterByClick={sidebarMenuComponent.filterByClick}
                                    resetFilter={sidebarMenuComponent.resetFilter}
                                    resetTextFilter={sidebarMenuComponent.resetTextFilter}/>);
            });
        }

        return (
            <div id="sidebarMenuContainer">
                <SearchBar
                    onChange={this.updateQuery}
                    queryString={this.props.queryString}
                    turnTextFilterOn={this.turnTextFilterOn}
                    resetVenue={this.resetVenue} />
                <div id="sidebarMenu">
                    <ul>
                      {renderedList}
                    </ul>
                </div>
            </div>
        );
    }
}

class SidebarItem extends React.Component {

    constructor(props) {
        super(props);
        this.state= {
            isToggleOn : false,
        };
    }

    // -------------------------------
    // Toggle methods
    // -------------------------------
    resetToggle = () => {
        this.setState({
            isToggleOn: false
        });
    }
    toggleSelection = () => {
        this.setState(state => ({
          isToggleOn: !state.isToggleOn
      }), this.filterMethod);
    }

    // -------------------------------
    // Filter methods
    // -------------------------------
    filterMethod = () => {
        // Choose appropriate method
        if(this.state.isToggleOn) {
            this.filterByClick();
        } else {
            this.resetFilter();
        }
        // Signal that venues are being filtered by selection, not by text
        this.props.resetTextFilter();
    }
    filterByClick = () => {
        this.props.filterByClick(this.props.venue);
    }
    resetFilter= () => {
        this.props.resetFilter();
    }

    render() {
        // Get props
        const key = this.props.venue.id;
        const name = this.props.venue.name;
        const isTextFilterOn = this.props.isTextFilterOn;

        // Build CSS class and method
        var itemClass = "Sidebar-item";

        // Manage CSS on filter state
        if(!isTextFilterOn) {
            if(this.state.isToggleOn) {
                itemClass += " Highlight";
            }
        }

        return (
            <li id={key} className={itemClass} onClick={this.toggleSelection}>{name}</li>
        );
    }
}

export default Sidebar;
