const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secretKey = 'SuperSecret';

function generateAuthToken(userID, role) {
    const payload = { sub: userID, role: role };
    return jwt.sign(payload, secretKey, {expiresIn: '24h' });
}

function requireAuthentication(req, res, next) {
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ? authHeaderParts[1] : null;
    try {
        const payload = jwt.verify(token, secretKey);
        req.user = payload.sub;
        req.role = payload.role;
        next();
    } catch (err) {
        res.status(401).json({
            error: "Invalid authentication token provided."
        });
    }
}

async function hashAndSaltPassword(password) {
    return await bcrypt.hash(password, 8)
}

async function validateUser(user, password) {
    return !!user && await bcrypt.compare(password, user.password);
}

exports.requireAuthentication = requireAuthentication;
exports.generateAuthToken = generateAuthToken;
exports.hashAndSaltPassword = hashAndSaltPassword;
exports.validateUser = validateUser;
