const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')
const User = require('../models/user')
requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowStatus = ['ignored', 'interested']
        if (!allowStatus.includes(status)) {
            res.status(400).json({ message: "Invalid status type: " + status })
        }
        console.log("toUserId :" + toUserId)
        const toUser = await User.findById(toUserId)
        if (!toUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        console.log("toUser :" + toUser)
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnectionRequest) {
            return res
                .status(400)
                .send({ message: "Connection Request Already Exists!!" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save();
        console.log(req.user)
        res.json({
            message:
                req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        });
    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {


    const loggedinUser = req.user
    const { status, requestId } = req.params
    const allowedStatus = ["accepted", "rejected"]
    if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status is not allowed" })
    }
    console.log("requestId" + requestId)
    console.log("loggedinUser._id" + loggedinUser._id)
    const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedinUser._id,
        status: "interested"
    })
    console.log("connectionRequest" + connectionRequest)
    if (!connectionRequest) {
        return res.status(404).json({ message: "Connection request not found!" })
    }

    connectionRequest.status = status
    
    const data =  await   connectionRequest.save()


    res.json({ message: "Connect request " + status + " successfully!", data })
})



module.exports = requestRouter;