const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (req, res, next) => {
    try {
        const { credential } = req.body;
        
        if (!credential) {
            return res.status(400).json({
                success: false,
                message: 'Google credential is required'
            });
        }

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        
        // Extract user information from the verified token
        const googleUser = {
            googleId: payload.sub,
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
            picture: payload.picture,
            emailVerified: payload.email_verified
        };

        // Attach verified user data to request
        req.googleUser = googleUser;
        next();

    } catch (error) {
        console.error('Google token verification failed:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid Google token'
        });
    }
};

module.exports = { verifyGoogleToken };