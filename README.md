 # Cars Application

This repository contains both the frontend and backend components of the Cars application.

## Project Structure

- `Cars_Frontend-main/` - Angular frontend application
- `car-nodejs/` - Node.js backend application

## Frontend (Angular)

The frontend is built with Angular and provides the user interface for the Cars application.

### Setup
```bash
cd Cars_Frontend-main
npm install
ng serve
```

The application will be available at `http://localhost:4200`

## Backend (Node.js)

The backend is built with Node.js and Express, providing the API for the Cars application.

### Setup
```bash
cd car-nodejs
npm install
npm start
```

The API will be available at `http://localhost:3000`

## Development

Both applications need to be running simultaneously for full functionality:
1. Start the backend server (port 3000)
2. Start the frontend development server (port 4200)

## Environment Variables

Both projects require environment variables to be set up:

### Backend (.env in car-nodejs/)
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (environment.ts in Cars_Frontend-main/src/environments/)
```
apiUrl: 'http://localhost:3000'
```