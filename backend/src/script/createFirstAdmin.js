
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');


require('dotenv').config();

const createFirstAdmin = async () => {
    try {
       
        await mongoose.connect(process.env.DB_CONNECT_STRING);
        
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log("Admin exists already")
            return process.exit(0);
        }

        // Create first admin
        
        const adminDetails = {
            firstName: 'Piyush',
            lastName: 'Admin',
            emailId: 'piyush@gmail.com',
            age: 22,
            password: process.env.FirstAdminPass, 
            role: 'admin',
            provider: 'local'
        };

        
        const hashedPassword = await bcrypt.hash(adminDetails.password, 10);

        // Create admin user
        const firstAdmin = new User({
            firstName: adminDetails.firstName,
            lastName: adminDetails.lastName,
            emailId: adminDetails.emailId,
            age: adminDetails.age,
            password: hashedPassword,
            role: adminDetails.role,
            provider: adminDetails.provider
        });

        await firstAdmin.save();
        return process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
    } finally {
        
       if (mongoose.connection.readyState) {
        await mongoose.connection.close();
      }

         process.exit(0);
    }
};


createFirstAdmin();

// Usage instructions:
// 1. Run: node script/createFirstAdmin.js
// 2. Use the created credentials to login as admin