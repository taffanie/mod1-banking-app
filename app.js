const express = require("express");
const app = express();
const mongoose = require('mongoose')
const { auth, requiresAuth } = require("express-openid-connect");
const { addUser } = require("./controllers/user");
const { inviteFriend, acceptInvite } = require('./controllers/friend');
const expressLayouts = require('express-ejs-layouts');
const User = require('./models/user');
const bodyParser = require('body-parser');

//Connect to Mongo
mongoose.connect(
    "mongodb://localhost/banking-app",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("Connected to MongoDB");
    }
);

//OIDC Config
const openIDconfig = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'JVkWTH5wk9QXUuW6cVPszA18WboBaUkt',
    issuerBaseURL: 'https://dev-c7kpmdkq.eu.auth0.com'
};
app.use(auth(openIDconfig));

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//Routes
app.get("/", requiresAuth(), addUser);

app.post("/deposit", requiresAuth(), async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    user.balance += parseInt(req.body.amount)
    user.save()
    res.status(200).redirect("/")
})

app.post("/transfer", requiresAuth(), async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    let friend = await User.findOne({ email: req.body.friend })
    user.balance -= parseInt(req.body.value)
    friend.balance += parseInt(req.body.value)
    user.save()
    friend.save()
    res.status(200).redirect("/")
})

app.post('/friends/invite', requiresAuth(), inviteFriend);

app.get('/friends/accept', requiresAuth(), acceptInvite)

//Server Initialization
app.listen(3000, () =>
    console.log("Listening on port 3000.")
);

module.exports = app;