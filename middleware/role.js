module.exports = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ status: 'error', error: 'Just ADMIN can See And Update' });
        }
        next();
    }
};