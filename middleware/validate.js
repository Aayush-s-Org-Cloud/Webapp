
const validateRequest = (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
        return res.status(400).json();
    }

    if (req.body && Object.keys(req.body).length > 0) {
        return res.status(400).json();
    }

    next();
};
module.exports = validateRequest;