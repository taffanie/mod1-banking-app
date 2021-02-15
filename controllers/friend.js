const Mailer = require('../models/mailer');
const User = require('../models/user');

const inviteFriend = (req, res) => {
    const email = req.body.to;
    const mailer = new Mailer(req.oidc.user.email);
    mailer.sendEmailInvite(email);
    res.status(201).render("invite", { friend: email });
}

const acceptInvite = async (req, res) => {
    const existingFriend = await User.findOne({ email: req.query.to })
    const user = await User.findOne({ email: req.query.from })
    const friend = new User({
        balance: 0,
        friends: [],
        name: req.oidc.user.name,
        email: req.oidc.user.email,
    })
    if (!existingFriend) {
        await friend
            .save()
    }

    user.friends.push(friend.email)
    user.save()
    friend.friends.push(user.email)
    friend.save()
    res.render("accept", { user: req.user })
}

module.exports = { inviteFriend, acceptInvite }