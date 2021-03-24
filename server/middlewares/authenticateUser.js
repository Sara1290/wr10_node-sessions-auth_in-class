module.exports = function(req, res, next) {
    if (!req.session.user.admin) {
        res.status(403).send("Access Denied")
    } else {
        next();
    }
}