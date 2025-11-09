# SmartPark - Parking Management System

A fullstack web application for managing parking lots and monitoring parking slot availability in real-time.

## Technology Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express
- **Database**: MySQL with Sequelize ORM
- **Real-time Updates**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)

## Features

### MVP Features
- User Authentication (Login/Register)
- Role-based Access Control (USER/ADMIN)
- Parking Lot Management (CRUD operations for ADMIN)
- Real-time Parking Slot Status Updates
- Visualized Slot Management
- User Dashboard for Viewing Availability

### Database Schema

```
Users
- id (PK)
- username (unique)
- email (unique)
- password (hashed)
- role (enum: USER, ADMIN)

ParkingLots
- id (PK)
- name
- totalCapacity
- description

ParkingSlots
- id (PK)
- slotNumber
- status (enum: AVAILABLE, OCCUPIED, RESERVED)
- parkingLotId (FK)
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login

### Parking Lots
- GET /api/parking-lots - Get all parking lots
- GET /api/parking-lots/:id - Get specific parking lot
- POST /api/parking-lots - Create new parking lot (Admin only)
- PUT /api/parking-lots/:id - Update parking lot (Admin only)
- DELETE /api/parking-lots/:id - Delete parking lot (Admin only)

### Parking Slots
- GET /api/parking-slots/lot/:parkingLotId - Get all slots for a lot
- PUT /api/parking-slots/:id/status - Update slot status (Admin only)

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Environment Variables

Create a .env file in the backend directory with the following variables:
\`\`\`
PORT=5000
DB_NAME=smartpark_db
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
\`\`\`

Create a .env file in the frontend directory with:
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

### Installation Steps

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
cd smartpark
\`\`\`

2. Install Backend Dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

3. Install Frontend Dependencies:
\`\`\`bash
cd frontend
npm install
\`\`\`

4. Create Database:
\`\`\`sql
CREATE DATABASE smartpark_db;
\`\`\`

5. Run Database Migrations and Seed:
\`\`\`bash
cd backend
npm run seed
\`\`\`

6. Start the Backend Server:
\`\`\`bash
cd backend
npm run dev
\`\`\`

7. Start the Frontend Development Server:
\`\`\`bash
cd frontend
npm start
\`\`\`

### Default Users

After running the seed script, you can log in with these default users:

1. Admin User:
   - Username: admin
   - Password: admin123

2. Regular User:
   - Username: user
   - Password: user123

## Error Handling

The application implements comprehensive error handling:

- **Authentication Errors**: Returns 401 for unauthorized access
- **Authorization Errors**: Returns 403 for forbidden actions
- **Validation Errors**: Returns 400 with specific error messages
- **Server Errors**: Returns 500 with generic error message

## Future Improvements

1. Implement booking system with time slots
2. Add payment integration
3. Enhance real-time updates with WebSocket
4. Add analytics dashboard for admins
5. Implement automated testing
6. Add mobile responsiveness
7. Implement rate limiting and additional security measures

## Contributors

[Your Name]

## License

MIT License