
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false,
    error: null
     };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
         <h1>Something went wrong.</h1>
         <p>{this.stateerror.message}</p>
        </>
     
    );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;