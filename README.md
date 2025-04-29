# EstateLink - Government of India Property Management System

EstateLink is a comprehensive web application designed for the Government of India that integrates multiple property registration and management systems (DORIS, DLR, CERSAI, MCA21) into a single unified portal. This application allows citizens and government officials to search, view, and analyze property records and encumbrances from various databases in a standardized format.

## Key Features

- **Unified Property Search**: Search across multiple government property databases with a single standardized interface
- **Multi-Parameter Search**: Find properties using Property ID, Owner Details, Address, or Registration Number
- **Multi-Language Support**: Interface available in English and Hindi, with extensibility for other official Indian languages
- **Advanced Filtering**: Filter search results by property type, registration date, encumbrance status, and more
- **Aadhaar Integration**: Secure verification of property owners through Aadhaar
- **DigiLocker Support**: Seamless access to property documents stored in DigiLocker
- **Responsive Design**: Works on all devices from mobile phones to desktop computers
- **Government Standards Compliant**: Follows Indian government design standards and accessibility guidelines

## Technology Stack

### Backend

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- RESTful API architecture

### Frontend

- HTML5
- CSS3 with custom variables
- Vanilla JavaScript (ES6+)
- Responsive design with mobile-first approach

## Project Structure

```
EstateLink/
├── config/           # Configuration files
├── controllers/      # Controller logic
├── middleware/       # Express middleware
├── models/           # MongoDB models
├── public/           # Static assets
│   ├── css/          # CSS stylesheets
│   ├── js/           # Client-side JavaScript
│   └── images/       # Image assets
├── routes/           # API routes
│   └── api/          # API endpoints
├── utils/            # Utility functions
├── server.js         # Express server setup
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## API Endpoints

The system provides the following main API endpoints:

- `GET /api/property/search` - Search for properties with various parameters
- `GET /api/property/:id` - Get detailed information about a specific property
- `GET /api/property/:id/encumbrances` - Get encumbrance details for a property
- `GET /api/property/:id/history` - Get ownership history for a property
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/me` - Get current user details

## Installation and Setup

1. Clone the repository:

   ```
   git clone https://github.com/government-of-india/estatelink.git
   cd estatelink
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/estatelink
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   AADHAAR_API_KEY=your_aadhaar_api_key
   DIGILOCKER_API_KEY=your_digilocker_api_key
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Deployment

For production deployment, follow these steps:

1. Set the environment variables for production
2. Build the project:
   ```
   npm run build
   ```
3. Start the production server:
   ```
   npm start
   ```

## Security Features

- JWT-based authentication
- Input validation and sanitization
- Rate limiting and request throttling
- CORS protection
- Secure password hashing
- Audit logging
- Role-based access control

## Future Enhancements

- Integration with Bhuvan GIS for map-based property visualization
- Blockchain-based property record verification
- AI-powered duplicate detection
- Integration with e-Courts for property dispute information
- Integration with property tax payment systems

## License

This project is the property of the Government of India and is not licensed for private use or redistribution without explicit permission.

## Contact

For any queries or support related to this application, please contact:

- Ministry of Electronics & Information Technology
- National Informatics Centre
- Email: estatelink-support@gov.in
