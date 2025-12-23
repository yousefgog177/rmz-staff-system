/**
 * Configuration file template
 * Copy this file to config.js and fill in your actual credentials
 */

module.exports = {
    // MongoDB connection string
    MONGODB_URI: "mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE",
    
    // SendGrid API key for email services
    SENDGRID_API_KEY: "SG.YOUR_SENDGRID_API_KEY",
    
    // RMZ Merchant API base URL
    RMZ_API_URL: "https://merchant-api.rmz.gg/shawarma",
    
    // Backend API URL (for development)
    BACKEND_API_URL: "http://localhost:3001",
    
    // Server port
    PORT: 3001
};
