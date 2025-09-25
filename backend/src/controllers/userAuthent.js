
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const Submission = require('../models/submission'); 
const redisClient = require('../config/redis');


const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id, 
            emailId: user.emailId,
            role: user.role
        },
        process.env.SECRET_KEY, 
        {
            expiresIn: '7d' // 7 days
        }
    );
};


const createUserResponse = (user) => {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        age: user.age,
        role: user.role,
        picture: user.picture,
        authProvider: user.authProvider,
        emailVerified: user.emailVerified,
        problemSolved: user.problemSolved
    };
};

// Single User Registration (Everyone uses this)
const register = async (req, res) => {
    try {
        const { firstName, lastName, emailId, age, password } = req.body;

        // Validation
        if (!firstName || !lastName || !emailId || !age || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        if (!validator.isEmail(emailId)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user - ALWAYS as regular user
        const newUser = new User({
            firstName,
            lastName,
            emailId,
            age,
            password: hashedPassword,
            role: 'user', // Always user initially
            authProvider: 'local'
        });

        await newUser.save();

        
        const token = generateToken(newUser);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful! Welcome to CodeClimb!',
            user: createUserResponse(newUser)
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Validation
        if (!emailId || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        if (!validator.isEmail(emailId)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Find user
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is registered with Google
        if (user.authProvider === 'google') {
            return res.status(400).json({
                success: false,
                message: 'This account is registered with Google. Please use Google Sign-In.'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

       
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            sameSite: 'lax'
        });

        res.status(200).json({
            success: true,
            message: user.role === 'admin' ? 'Welcome back, Admin!' : 'Login successful!',
            user: createUserResponse(user)
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const googleAuth = async (req, res) => {
    try {
        const { googleUser } = req; // From middleware
        const { googleId, email, firstName, lastName, picture, emailVerified } = googleUser;

       
        let user = await User.findOne({ googleId });

        if (user) {
            // Existing user - update their information
            user.picture = picture;
            user.emailVerified = emailVerified;
            await user.save();
        } else {
            // Check if user exists with same email but different auth provider
            const existingUser = await User.findOne({ emailId: email });
            
            if (existingUser && existingUser.provider === 'local') {
                return res.status(400).json({
                    success: false,
                    message: 'An account with this email already exists. Please sign in with your password.'
                });
            }

            // Create new user - ALWAYS as regular user
            user = new User({
                googleId,
                firstName,
                lastName,
                emailId: email,
                avatar: picture,
                provider: 'google',
                emailVerified,
                age: 18, 
                role: 'user' 
            });

            await user.save();
        }

       
        const token = generateToken(user);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 hour to match JWT expiry
            sameSite: 'lax'
        });

        res.status(200).json({
            success: true,
            message: user.role === 'admin' ? 'Welcome back, Admin!' : 'Google authentication successful!',
            user: createUserResponse(user)
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Promote User to Admin (Admin only)
const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        
        
        if (req.result.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'User is already an admin'
            });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).json({
            success: true,
            message: `${user.firstName} ${user.lastName} has been promoted to admin`,
            user: createUserResponse(user)
        });

    } catch (error) {
        console.error('Promote user error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get All Users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        if (req.result.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        const users = await User.find({}, '-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            users: users.map(user => createUserResponse(user))
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const logout = async (req, res) => {
    try {
        //token add to redis blocklist
        //clear cookies and send null
       
        const { token } = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`, "Blocked");
        await redisClient.expireAt(`token:${token}`, payload.exp);

        res.cookie("token", null, { expires: new Date(Date.now()) });

        res.send("logged out succesfully");

    } catch (error) {
        res.status(503).send("Error:" + error);
    }
};

// Check Authentication Status
const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(200).json({
                success: true,
                isAuthenticated: false,
                message: 'No token provided'
            });
        }

        
        const isBlacklisted = await redisClient.get(`token:${token}`);
        if (isBlacklisted === "Blocked") {
            res.clearCookie('token');
            return res.status(200).json({
                success: true,
                isAuthenticated: false,
                message: 'Token is blacklisted'
            });
        }

        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded._id); // Use _id from YOUR token format

        if (!user) {
            res.clearCookie('token');
            return res.status(200).json({
                success: true,
                isAuthenticated: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            isAuthenticated: true,
            user: createUserResponse(user)
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            res.clearCookie('token');
            return res.status(200).json({
                success: true,
                isAuthenticated: false,
                message: 'Invalid or expired token'
            });
        }

        console.error('Auth check error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const deleteProfile = async (req, res) => {
    try {
        const userId = req.result._id; 

       
        await Submission.deleteMany({ userId: userId });
        console.log(`Deleted all submissions for user: ${userId}`);

        // Then delete the user
        await User.findByIdAndDelete(userId);

        // Clear cookie
        res.clearCookie('token');

        res.status(200).json({
            success: true,
            message: 'User profile and all submissions deleted successfully'
        });

    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    register,
    login,
    googleAuth,
    promoteToAdmin,
    getAllUsers,
    logout,
    checkAuth,
    deleteProfile
};