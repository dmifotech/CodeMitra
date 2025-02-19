function authorizeRoles(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
        }
        next();
    };
}

module.exports = { authorizeRoles }; // ✅ Ensure this export exists
