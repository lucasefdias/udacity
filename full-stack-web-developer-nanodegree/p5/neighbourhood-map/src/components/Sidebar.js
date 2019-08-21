import React from 'react'
import '../App.css';

// --------------------------------------------
// Sidebar components
// --------------------------------------------
class Sidebar extends React.Component {

    // Set a constructor
    constructor(props) {
        super(props);
        // Bind methods
        this.buttonMethod = this.buttonMethod.bind(this);
        this.updateSelectedVenues = this.updateSelectedVenues.bind(this);
    }

    // Associate corresponding button method
    buttonMethod() {
        this.props.buttonMethod();
    }
    // Associate method for updating selected venues
    updateSelectedVenues(newSelectedVenues) {
        this.props.updateSelectedVenues(newSelectedVenues);
    }

    render() {
        return (
            <nav className="Sidebar" role="navigation">
                <div id="menuToggle">
                    {/*
                    A hidden checkbox is used as click reciever,
                    so we can use the :checked selector on it
                    */}
                    <input type="checkbox" />

                    {/* Menu icon*/}
                    <span></span>
                    <span></span>
                    <span></span>

                    {/* Sidebar is displayed when the menu icon is clicked*/}
                    <SidebarMenu
                        isFilterOn={this.props.isFilterOn}
                        buttonMethod={this.buttonMethod}
                        selectedVenues={this.props.selectedVenues}
                        updateSelectedVenues={this.updateSelectedVenues}/>
                </div>
            </nav>
        );
    }
}

class SidebarMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tempSet: new Set(),
            buttonClicked: false
        }
        // Bind methods
        this.buttonMethod = this.buttonMethod.bind(this);
        this.toggleClickedState = this.toggleClickedState.bind(this);
        this.resetClickedState = this.resetClickedState.bind(this);
        this.addToTempSet = this.addToTempSet.bind(this);
        this.removeFromTempSet = this.removeFromTempSet.bind(this);
        this.updateSelectedVenues = this.updateSelectedVenues.bind(this);
    }

    // Associate corresponding button method
    buttonMethod() {
        if(!this.props.isFilterOn) {
            this.updateSelectedVenues();
        }
        // Each time the button is clicked, toggle clicked state
        this.toggleClickedState();
        this.props.buttonMethod();
    }
    toggleClickedState() {
        this.setState({
          buttonClicked: true
        });
    }
    resetClickedState() {
        this.setState({
          buttonClicked: false
        });
    }
    addToTempSet(value) {
        // Make a copy of set and add corresponding value
        let setCopy = this.state.tempSet;
        setCopy.add(value);

        // Manage state correctly to update tempSet
        this.setState({
          tempSet: setCopy
        });
    }
    removeFromTempSet(value) {
        // Make a copy of set and remove corresponding value
        let setCopy = this.state.tempSet;
        setCopy.delete(value);

        // Manage state correctly to update tempSet
        this.setState({
          tempSet: setCopy
        });
    }
    clearTempSet() {
        this.setState({
          tempSet: new Set()
        });
    }

    // Associate method for updating selected venues in App component
    updateSelectedVenues() {
        let newSelectedVenues;

        // Check if temporary set is null (no selection is made)
        if(this.state.tempSet) {
            newSelectedVenues = Array.from(this.state.tempSet);
            this.clearTempSet();
        }

        // Call parent method for updating selected venues
        this.props.updateSelectedVenues(newSelectedVenues);
    }

    render() {
        // Get props
        const isFilterOn = this.props.isFilterOn;
        const selectedVenues = this.props.selectedVenues;
        const tempSet = this.state.tempSet;

        // Store component context
        const sidebarMenuComponent = this;

        // Elements to be rendered
        let renderedList = [];
        let button;

        // Render corresponding button depending on filter state
        if (isFilterOn) {
            button = <SidebarButton
                        type="Reset"
                        buttonMethod={this.buttonMethod}
                        toggleClickedState={this.toggleClickedState}/>;
        } else {
            button = <SidebarButton
                        type="Filter"
                        buttonMethod={this.buttonMethod}
                        toggleClickedState={this.toggleClickedState}/>;
        }

        // Check if there are any selected venues and iterate through array to build list
        if(selectedVenues) {
            selectedVenues.forEach(function(venue){

                renderedList.push(<SidebarItem
                                    key={venue.id}
                                    isFilterOn={isFilterOn}
                                    venue={venue}
                                    tempSet={tempSet}
                                    addToTempSet={sidebarMenuComponent.addToTempSet}
                                    removeFromTempSet={sidebarMenuComponent.removeFromTempSet}
                                    buttonClicked={sidebarMenuComponent.state.buttonClicked}
                                    resetClickedState={sidebarMenuComponent.resetClickedState}/>);
            });
        }

        return (
            <div id="sidebarMenuContainer">
                {button}
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
        // Bind methods
        this.resetToggle = this.resetToggle.bind(this);
        this.toggleSelection = this.toggleSelection.bind(this);
        this.resetClickedState = this.resetClickedState.bind(this);
        this.setMethod = this.setMethod.bind(this);
        this.addToTempSet = this.addToTempSet.bind(this);
        this.removeFromTempSet = this.removeFromTempSet.bind(this);
    }

    // Manage toggle state
    resetToggle() {
        this.setState({
          isToggleOn: false
        });
    }
    toggleSelection() {
        this.setState(state => ({
          isToggleOn: !state.isToggleOn
        }), this.setMethod);
    }

    // Associate corresponding button reset method
    resetClickedState() {
        this.props.resetClickedState();
    }

    // Manage temporary set for updating filtered venues
    setMethod() {
        if(this.state.isToggleOn) {
            this.addToTempSet();
        } else {
            this.removeFromTempSet();
        }
    }
    addToTempSet() {
        this.props.addToTempSet(this.props.venue);
    }
    removeFromTempSet() {
        this.props.removeFromTempSet(this.props.venue);
    }

    render() {
        // Each the filter is activated, reset state
        if(this.props.buttonClicked) {
            this.resetToggle();
            this.resetClickedState();
        }

        // Get props
        const key = this.props.venue.id;
        const name = this.props.venue.name;

        // Build CSS class and method
        var itemClass = "Sidebar-item";
        var clickMethod;

        // Manage CSS and method depending on filter state
        if(!this.props.isFilterOn) {
            itemClass += "-unfiltered";
            clickMethod = this.toggleSelection;
            if(this.state.isToggleOn) {
                itemClass += " Highlight";
            }
        } else {
            clickMethod = null;
            itemClass += "-filtered";
        }

        return (
            <li id={key} className={itemClass} onClick={clickMethod}>{name}</li>
        );
    }
}

class SidebarButton extends React.Component {

    constructor(props) {
        super(props);
        // Bind methods
        this.buttonMethod = this.buttonMethod.bind(this);
    }

    buttonMethod() {
        this.props.buttonMethod();
    }

    render() {
        return (
            <div id="buttonDiv">
                <button id="filterButton" onClick={this.buttonMethod}>
                    {this.props.type}
                </button>
            </div>
        );
    }
}

export default Sidebar;
