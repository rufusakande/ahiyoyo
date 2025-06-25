const jwt = require('jsonwebtoken');
const axios = require('axios');
const { JWT_SECRET, WP_URL } = require('../config/config');
const User = require("../models/User");

const authenticate = async (req, res, next) => {
    try {
        // Extract the JWT token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Le token JWT est manquant ou invalide' });
        }
        const token = authHeader.split(' ')[1];

        // Extract WordPress token
        const wordpressToken = req.headers.wordpresstoken || req.headers['wordpress-token'];
        if (!wordpressToken) {
            return res.status(401).json({ message: 'Le token WordPress est requis.' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { username: decoded.username };

        // Verify WordPress token by making a request to WordPress
        try {
            const wordpressResponse = await axios.get(`${WP_URL}/wp-json/wp/v2/users/me`, {
                headers: {
                    'Authorization': `Bearer ${wordpressToken}`
                }
            });

            const wordpressData = wordpressResponse.data;
            const user = await User.findOne({ where: { email: req.user.username } });
            //console.log(user);

            if (!user) {
                return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
            }

            const userData = {
                userId: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                email: user.email,
                phoneNumber: user.phoneNumber,
                whatsappNumber: user.whatsappNumber,
                alipayQR: user.alipayQR,
                idDocument: user.idDocument,
                isVerified: user.isVerified,
                profileCompleted: user.profileCompleted,
                verificationStatus: user.verificationStatus,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
          //  console.log(userData);

            // Enrich user object with WordPress data
            req.user =

            {
                userData,
             wordpress: {
                    ...req.user,
                    id: wordpressData.id,
                    email: wordpressData.email,
                    roles: wordpressData.roles,
                    name: wordpressData.name,
                    avatar_urls: wordpressData.avatar_urls
                }
            }
                ;

            next();
        } catch (wpError) {
            console.error('WordPress API Error:', wpError.message);
            return res.status(401).json({
                message: 'Le token WordPress est invalide ou expiré',
                error: wpError.response?.data?.message || 'Erreur de validation WordPress'
            });
        }


    } catch (error) {
        console.error('Auth Middleware Error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Le token JWT a expiré' });
        }
        return res.status(401).json({
            message: 'Erreur d\'authentification',
            error: error.message
        });
    }
};

module.exports = authenticate;