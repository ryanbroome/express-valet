# park-pilot

## BASE URL `https://park-pilot.onrender.com`

## Authentication

This API requires authentication via JWT tokens. To authenticate, include the JWT token in the 'Authorization' header of your requests

Example : 
Authorization: Bearer your_jwt_token_here

## Endpoints

<!-- AUTH ENDPOINTS -->

URL : `/auth/token`
Method : POST
Description : Logs in a user and returns a JWT token
Request Body : {"username" : "your_username", "password" : "your_password"}
Response : {token : `your_jwt_token_here` }

URL : `/auth/register`
Method : POST
Description : Registers a new user and returns a JWT token
Request Body : {
    "username" : "your_username",
    "password" : "your_password",
    "firstName" : "your_firstName",
    "lastName" : "your_lastName",
    "email" : "your_email",
    "phone" : "your_phone",
    "locationId" : "your_locationId",
    "isAdmin" : "true || false"}
Response : {
    id,
    username,
    firstName,
    lastName,
    email,
    phone,
    totalParked,
    isAdmin,
    locationId}

<!-- USER ENDPOINTS -->

URL : `/users`
Method : POST
Description : Registers a new user and returns a JWT token
Request Body : {
    "username" : "your_username",
    "password" : "your_password",
    "firstName" : "your_firstName",
    "lastName" : "your_lastName",
    "email" : "your_email",
    "phone" : "your_phone",
    "locationId" : "your_locationId",
    "isAdmin" : "true || false"}
Response : {
    id,
    username,
    firstName,
    lastName,
    email,
    phone,
    totalParked,
    isAdmin,
    locationId}

URL : `/users`
Method : GET
Description : Registers a new user and returns a JWT token
Request Body : {}
Response : { [{user0}, {user1}, ...] }

URL : `/users/:username`
Method : GET
Description : Gets a user and returns user data
Request Body : {}
Response : {
    id,
    username,
    firstName,
    lastName,
    email,
    phone,
    totalParked,
    isAdmin,
    locationId}

URL : `/users/:username`
Method : PATCH
Description : Updates a user and returns new user data
Request Body : {
    username,
    firstName,
    lastName,
    phone,
    email,
    totalParked,
    locationId
}
Response : {
    username,
    firstName,
    lastName,
    email,
    phone,
    totalParked,
    isAdmin,
    locationId}

URL : `/users/parkOne/:username`
Method : PATCH
Description : Updates and increments the specified users totalParked count by 1
Request Body : {}
Response : {
    username,
    firstName,
    lastName,
    email,
    phone,
    totalParked,
    isAdmin,
    locationId}

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

location

transaction

vehicle
