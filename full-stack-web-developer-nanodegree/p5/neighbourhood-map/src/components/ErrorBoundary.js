import React from 'react'
import '../App.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        // The state controls the presence and content of errors for each child component
        this.state = {
            error: null,
            errorInfo: null
        };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        // If there is an error, return error information
        if (this.state.errorInfo) {
            return (
                <div id="errorBoundary">
                    <h2>Oops ... something went wrong. :/</h2>
                    <details>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        // When no error occurs, just render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;
