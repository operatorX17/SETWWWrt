import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h1 className="text-6xl font-bold text-red-500 mb-4">⚡</h1>
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-8">
              The OG arsenal encountered a technical issue. Don't worry, the rebellion continues.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-red-600 transition-colors"
            >
              Reload Arsenal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;