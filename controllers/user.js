const User = require('../models/user');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const addUser = async (req, res) => {
    const user = new User({
        balance: 0,
        friends: [],
        name: req.oidc.user.name,
        email: req.oidc.user.email,
    });

    const existingUser = await User.findOne({ email: user.email })

    if (existingUser) {
        res.render("home", { user: existingUser });
    } else {
        await user
            .save()
            .then(data => {
                res.render("home", { user: req.user });
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "An error occured while creating the user",
                })
            })
    }
}


module.exports = { addUser }
