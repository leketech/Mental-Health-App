// Simple test script to verify frontend functionality
console.log('Frontend test script loaded');

// Check if required elements exist
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Check if root element exists
    const rootElement = document.getElementById('root');
    if (rootElement) {
        console.log('Root element found');
    } else {
        console.error('Root element not found');
    }
    
    // Simple test to verify JavaScript is running
    console.log('JavaScript is running correctly!');
});