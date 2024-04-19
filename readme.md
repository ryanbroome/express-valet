# park-pilot

## Express Backend API Documentation

This backend API provides endpoints for managing valet parking locations, vehicles, transactions, users with authentication, and user management. It allows to build either a data analyst dashboard and an interactive front end for valets to process vehicles.

## Table of Contents

- [park-pilot](#park-pilot)
  - [Express Backend API Documentation](#express-backend-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [API Endpoints](#api-endpoints)
  - [BASE\_URL `https://park-pilot.onrender.com`](#base_url-httpspark-pilotonrendercom)
    - [Authentication](#authentication)
    - [Users](#users)
    - [Transactions](#transactions)
    - [Locations](#locations)
    - [Vehicles](#vehicles)
    - [Testing](#testing)
    - [Examples](#examples)
      - [Authentication Examples](#authentication-examples)
      - [User Examples](#user-examples)
      - [Transaction Examples](#transaction-examples)
      - [Location Examples](#location-examples)
      - [Vehicle Examples](#vehicle-examples)

## Installation

To install the necessary dependencies, run:

npm install

## Usage

To start the server, run:

npm start

The server will start on port 3001 by default.

## Configuration

Before running the server, make sure to set the following environment variables:

- `DB_CONNECTION_STRING`: Connection string for the database.
- `JWT_SECRET`: Secret key for JWT token generation.

## API Endpoints

## BASE_URL `https://park-pilot.onrender.com`

 `BASE_URL` + `ENDPOINT`

### Authentication

- `POST /auth/token`: Send request with valid username and password to obtain JWT token.
- `POST /auth/register`: Register a new user.

### Users

- `GET /users`: Get all users.
- `GET /users/:id`: Get a specific user by ID.
- `GET /users/:username`: Get a specific user by username.
- `PATCH /users/:id`: Update a user.
- `PATCH /users/:username`: Update a user.
- `DELETE /users/:username`: Delete a user by username.
- `DELETE /users/remove/:id`: Delete a user by id.

### Transactions

- `POST /transactions`: Create a new transaction.
- `GET /transactions/location/:locationId/status/:status`: Get all transactions with :locationId and :status.
- `GET /transactions/location/:locationId/user/:userId`: Get a transactions by location and user ID.
- `GET /transactions/range`: Get a transactions by location and user ID.
- `GET /transactions/search/location/:locationId/mobile/:mobile`: Search transactions by :locationId and :mobile.
- `GET /transactions/lostKeys/:locationId/:userId`: Search last 10 transactions by :locationId and :userId.
- `GET /transactions/:id`: Searchtransactions by :id.
- `PATCH /transactions/:id`: Update a transaction.
- `DELETE /transactions/:id`: Delete a transaction.

### Locations

- `POST /locations`: Create a new location.
- `GET /locations`: Get all locations.
- `GET /locations/id/:id`: Get a specific location by ID.
- `GET /locations/sitename/:sitename`: Get a specific location by :sitename.
- `PATCH /locations/:id`: Update a location.
- `DELETE /locations/:id`: Delete a location.

### Vehicles

- `POST /vehicles`: Create a new vehicle.
- `GET /vehicles`: Get all vehicles.
- `GET /vehicles/:id`: Get a specific vehicle by ID.
- `GET /vehicles/mobile/:mobile`: Get a specific vehicle by mobile.
- `GET /vehicles/status/:status`: Get vehicles by status.
- `PATCH /vehicles/:id`: Update a vehicle.
- `PATCH /vehicles/checkout/:id`: Update a vehicle by adding a CURRENT_TIMESTAMP to checkout.
- `DELETE /vehicles/:id`: Delete a vehicle.

### Testing

To run tests, use:

Authentication

This API requires authentication via JWT tokens. To authenticate, include the JWT token in the 'Authorization' header of your requests

Authorization: `Bearer your_jwt_token_here`

### Examples

#### Authentication Examples

URL : `/auth/token`
Method : POST
Description : Logs in a user and returns a JWT token
Request Body : { username : "your_username", password : "your_password"}
Response : { token : `your_jwt_token_here` }

URL : `/auth/register`
Method : POST
Description : Registers a new user and returns a JWT token
Request Body : {
    username : "your_username",
    password : "your_password",
    firstName : "your_firstName",
    lastName : "your_lastName",
    email : "your_email",
    phone : "your_phone",
    locationId : "your_locationId",
    isAdmin : "true || false"}
Response : { id, username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }

#### User Examples

URL : `/users`
Method : POST
Description : Registers a new user and returns a JWT token
Request Body : {
    username : "your_username",
    password : "your_password",
    firstName : "your_firstName",
    lastName : "your_lastName",
    email : "your_email",
    phone : "your_phone",
    locationId : "your_locationId",
    isAdmin : "true || false"}
Response : { id, username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }

URL : `/users`
Method : GET
Description : Gets all users
Request Body : {}
Response : { [{user0}, {user1}, ...] }

URL : `/users/:username`
Method : GET
Description : Gets a user and returns user data
Request Body : {}
Response : { id, username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }

URL : `/users/:username`
Method : PATCH
Description : Updates a user and returns new user data
Request Body : { username, firstName, lastName, phone, email, totalParked, locationId }
Response : { username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }

URL : `/users/parkOne/:username`
Method : PATCH
Description : Updates and increments the specified users totalParked count by 1
Request Body : {}
Response : { username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }

URL : `/users/:username`
Method : DELETE
Description : removes the specified user by username
Request Body : {}
Response : {deleted : username}

URL : `/users/remove/:id`
Method : DELETE
Description : removes the specified user by id
Request Body : {}
Response : {deleted : id}

#### Transaction Examples

URL : `/transactions`
Method : POST
Description : Creates a new transaction and returns new transaction id
Request Body : {
    userId : "your_userId",
    vehicleId : "your_vehicleId",
    locationId : "your_locationId",
   }
Response : { success : transaction.id }

URL : `/transactions/location/:locationId/status/:status`
Method : GET
Description : Gets all transactions with provided locationId and provided status
Request Body : {

 }
Response : { [{transaction}, {transaction}, ... ]}

URL : `/transactions/location/:locationId/user/:userId`
Method : GET
Description : Gets all transactions with provided locationId and provided userId
Request Body : {

 }
Response : { [{transaction}, {transaction}, ... ]}

URL : `/transactions/range`
Method : GET
Description : Gets all transactions with dates between the given start and end dates
Request Body : {
                 startYear : 99,
                 startMonth : 01,
                 startDay : 01,
                 endYear : 24,
                 endMonth : 12,
                 endDay : 31,
                 }
Response : { [{transaction}, {transaction}, ... ]}

URL : `/transactions/search/location/:locationId/mobile/:mobile`
Method : GET
Description : Gets all transactions with given locationId and with given partial mobile
Request Body : {

                 }
Response : { [{transaction}, {transaction}, ... ]}

URL : `/transactions/lostKeys/:locationId/:userId`
Method : GET
Description : Gets last ten transactions for given locationId and userId
Request Body : {

                 }
Response : { [{transaction}, {transaction}, ... ]}

URL : `/transactions/:id`
Method : GET
Description : Gets transaction for given transaction ID
Request Body : {

                 }
Response : { {
      transactionId,
      userId,
      vehicleId,
      locationId,
      transactionTime,
      ticketNum,
      vehicleStatus,
      checkIn,
      mobile,
      color,
      make,
      damages,
      checkOut,
      notes,
      sitename,
      firstName,
      lastName,
      phone,
      email,
      totalParked,
      isAdmin
      }}

URL : `/transactions/:id`
Method : PATCH
Description : Updates transaction for given transaction ID with request body data
Request Body : {

                 }
Response : {
    "transaction": {
            id: 6,
            userId: 1,
            vehicleId: 2,
            transactionTime: "2024-04-09T05:05:33.277Z"
      }}

URL : `/transactions/:id`
Method : DELETE
Description : Deletes a transaction for given transaction ID
Request Body : {

                 }
Response : {
            deleted : id
  }

#### Location Examples

URL : `/locations`
Method : POST
Description : Creates a location with given data
Request Body : {
                sitename : "your_sitename"
                 }
Response : {
            success : id
  }

URL : `/locations`
Method : GET
Description : Gets all locations
Request Body : {

 }
Response : { [{location}, {location}, ... ]}

URL : `/locations/id/:id`
Method : GET
Description : Gets location matching given ID
Request Body : {

 }
Response : { [{location} ]}

URL : `/locations/sitename/:sitename`
Method : GET
Description : Gets location matching given sitename
Request Body : {

 }
Response : { [{location} ]}

URL : `/locations/:id`
Method : PATCH
Description : Updates location for given location ID with request body data
Request Body : {

                 }
Response : {
    "location": {
            id: 6,
            sitename : "your_sitename"
      }}

URL : `/locations/:id`
Method : DELETE
Description : Deletes a location for given location ID
Request Body : {

                 }
Response : {
            deleted : id
  }

#### Vehicle Examples

URL : `/vehicles`
Method : POST
Description : Creates a vehicle with given data
Request Body : {
                ticketNum : "your_ticketNum",
                vehicleStatus : "your_vehicleStatus",
                mobile : "customer_mobile" ,
                color : "color",
                make : "make",
                damages : "damages",
                notes : "notes"
                 }
Response : {
            id,
            ticketNum,
            vehicleStatus,
            mobile,
            color,
            make,
            damages,
            notes
  }

URL : `/vehicles`
Method : GET
Description : Gets all vehicles
Request Body : {

 }
Response : { [{vehicle}, {vehicle}, ... ]}

URL : `/vehicles/:id`
Method : GET
Description : Gets vehicle matching given ID
Request Body : {

 }
Response : { [{vehicle} ]}

URL : `/vehicles/mobile/:mobile`
Method : GET
Description : Gets vehicles containing given partial or full mobile
Request Body : {

 }
Response : { [{vehicles}, ... ]}

URL : `/vehicles/status/:status`
Method : GET
Description : Gets vehicles matching given status
Request Body : {

 }
Response : { [{vehicles}, ... ]}

URL : `/vehicles/:id`
Method : PATCH
Description : Updates vehicle for given vehicle ID with request body data
Request Body : {
    vehicleStatus : 'parked',
    ticketNum : 0001,
    checkOut : "CURRENT_TIMESTAMP",
                 }
Response : {
    "vehicle": {
            id: 1,
            ticketNum,
            checkIn,
            checkOut,
            vehicleStatus,
            mobile,
            color,
            make,
            damages,
            notes

      }}
URL : `/vehicles/checkout/:id`
Method : PATCH
Description : Updates vehicleStatus, ticketNum, checkOut for given vehicle ID
Request Body : {
    vehicleStatus : 'parked',
    ticketNum : 0001,
    checkOut : "CURRENT_TIMESTAMP",
                 }
Response : {
    "vehicle": {
            id: 1,
            ticketNum,
            checkIn,
            checkOut,
            vehicleStatus,
            mobile,
            color,
            make,
            damages,
            notes
      }}

URL : `/vehicles/:id`
Method : DELETE
Description : Deletes a vehicle for given vehicle ID
Request Body : {

                 }
Response : {
            deleted : id
  }
  