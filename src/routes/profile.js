const express = require("express");
const profileRouter = express.Router();
const { validateEditProfileData } = require('../utils/validation')
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData) {
      throw new error("Invalid Data!")
    }
    const loggedIn = req.user
    Object.keys(req.body).forEach((key) => (loggedIn[key] = req.body[key]))

    await loggedIn.save()

    res.json({
      message: `${loggedIn.firstName}, your profile is updated successfully`,
      data: loggedIn
    })

  } catch (error) {
    res.status(400).send("Error : " + error.message)
  }
})



module.exports = profileRouter;