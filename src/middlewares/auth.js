
const jwt = require('jsonwebtoken')
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        console.log("req => " +JSON.stringify( req.cookies))
        const cookies = req.cookies;

        const { token } = cookies

        if (!token) {
            return res.status(401).send("Please Login!");
        }
        const decodedMessage = await jwt.verify(token, "SahiL@2003")
        const { _id } = decodedMessage
        const getUser = await User.findById(_id)

        if (!getUser) {
            throw new Error("User not found");
        }
        req.user = getUser
        next();
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = { userAuth }