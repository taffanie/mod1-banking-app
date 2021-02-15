const User = require('../models/user');

const acceptInvite = async (req, res) => {
    const myEmail = req.query.to
    const friendEmail = req.query.from
    const existingUser = await User.findOne({ email: myEmail })
    const friend = await User.findOne({ email: friendEmail })

    const user = new User({
        balance: 0,
        friends: [],
        name: req.oidc.user.name,
        email: req.oidc.user.email,
    })
    if (!existingUser) {
        await user
            .save()
    }

    friend.friends.push(user.email, user.name)
    user.friends.push(friend.email, friend.name)

    res.sendStatus(201)
}
module.exports = { acceptInvite }