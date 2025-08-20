# MERN Major Project - Leetcode like coding platform
-A full-stack MERN application where users can register, solve coding problems, and admins can manage problems & users.
A lot of features and functionalities to be added in future.
 
# Tech Stack
-Frontend: React.js (to be added later)

-Backend: Node.js, Express.js

-Database: MongoDB, Redis

-Authentication: JWT, bcrypt

-Validation: validator library

-More to be added in future

# Daily Progress Log:

## DAY01 
- Defined User schema with fields: firstName, lastName, age, email, password, role, problemSolved  
 
## DAY02 
- Implemented registration and login flows  
- Added input validation and sanitization before database calls  
- Secured passwords with bcrypt.  
- Issued JWT tokens on successful authentication 

## DAY03 
- Added `/getProfile` so users can retrieve their own profile information  
- Implemented logout by blacklisting JWTs in Redis  
- Created middleware to reject any blacklisted token on protected routes  
- Introduced an admin-only `/admin/register` endpoint for onboarding new admins  
- Wrote `adminMiddleware` to ensure only existing admins can hit that route  
- Seeded the very first admin directly in the database to kick things off  
- Included the user’s role inside the JWT payload for easy permission checks  
- Defined the Problem model with fields for tags, title, description, examples, test cases, and creator ID.


# Upcoming Work
- AI-powered chatbot integration  
- Video integration for problem explanations  
- Build frontend using React.js  
- Enhance Admin Dashboard with more controls  
- Create Editor section   