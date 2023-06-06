const jwt = require('jsonwebtoken');
const secretKey = 'SuperSecret';

function generateAuthToken(userID) {
    const payload = { sub: userID };
    return jwt.sign(payload, secretKey, {expiresIn: '24h' });
}

function requireAuthentication(req, res, next) {
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;
    try {
        const payload = jwt.verify(token, secretKey);
        req.user = payload.sub;
        next();
    } catch (err) {
        res.status(401).json({
            error: "Invalid authentication token provided."
        });
    }
}

exports.requireAuthentication = requireAuthentication;
exports.generateAuthToken = generateAuthToken;
