const nodemailer = require('nodemailer')
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

class Mailer {
    static sent = []

    constructor(from) {
        this.from = from
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'krystyna.garwol@gmail.com',
                pass: process.env.GMAIL_PASSWORD
            }
        })
    }
    sendEmailInvite(to) {
        const email = {
            from: this.from,
            to: to,
            subject: "Friend request",
            html: `Hi there,<br/><br/> I would like to invite you to be my friend on this banking app.<br/><br/> <a href="${process.env.BASE_URL}/friends/accept?from=${encodeURIComponent(this.from)}&to=${encodeURIComponent(to)}">Accept Request</a>`,
            replyTo: 'no-reply@banking-app.com'
        }
        this.transport.sendMail(email, (err, result) => {
            Mailer.sent.push(err || result)
            if (err) {
                console.log(err)
            } else {
                console.log(result)
            }
        })
    }
}

module.exports = Mailer;