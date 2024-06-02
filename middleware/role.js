let role = {
    ADMIN: "ADMIN",
    USER: "USER",
};

let rolePermisson = (role) => {
    return (res, req, next) => {
        // let role = req.user.role;
        if (req.user.role !== role) {
            return res.status(403).json({ err: "user can't see this page" })
        }
        next();
    }
}

module.exports = rolePermisson;
module.exports = role;