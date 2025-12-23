let fs = require("fs")
let randomToken = require("random-token")
const config = require('./config');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.SENDGRID_API_KEY);

class Heart {
    constructor(db) {
        this.db = db;
        this.rmz = new (require("./rmz.js"))();
        this.config = config;
    }

    async createMFATicket(ownerID) {
        return await this.db.ticketsOTP({
            _id: randomToken(8),
            code: (require("random-token").create("0123456789"))(6),
            ownerID,
            expire_at: Date.now() + 300000,
        }).save()
    }

    async mfaCheck(mfaID, code) {

        let mfa = await this.db.ticketsOTP.findOne({ _id: mfaID, expire_at: { $gt: Date.now() } })
        console.log(mfa)
        if (!mfa) return null

        if (mfa.code !== code) return mfa

        return { approveToken: true, ownerID: mfa.ownerID }

    }

    async sendMFACode(otp, email) {

        try {
            const htmlTemplate = fs.readFileSync("./messages/OTP.html", "utf-8");
            const htmlContent = htmlTemplate.replace("[OTP_CODE]", otp);

            const msg = {
                to: email,
                from: "noreply@staffs.storiza.store",
                subject: "🔐 رمز التحقق الخاص بك (OTP)",
                html: htmlContent
            };

            await sgMail.send(msg);
            console.log(`✅ OTP sent to ${email}: ${otp}`);

            return {
                status: "success",
                message: `OTP sent to ${email}`
            };
        } catch (err) {
            console.error("❌ Failed to send OTP:", err.response?.body || err.message);

            return {
                status: "error",
                message: "Failed to send OTP",
                error: err.response?.body || err.message || "Unknown error"
            };
        }
    }

    async sendInviteEmail(email, inviteUrl) {

        try {
            const htmlTemplate = fs.readFileSync("./messages/Invite.html", "utf-8");
            const htmlContent = htmlTemplate
                .replace("[INVITE_EMAIL]", email)
                .replace(/\[INVITE_URL\]/g, inviteUrl);

            const msg = {
                to: email,
                from: "noreply@staffs.storiza.store",
                subject: "📧 دعوة للانضمام إلى فريق Storiza",
                html: htmlContent
            };

            await sgMail.send(msg);
            console.log(`✅ Invite sent to ${email}`);

            return {
                status: "success",
                message: `Invite sent to ${email}`
            };
        } catch (err) {
            console.error("❌ Failed to send invite:", err.response?.body || err.message);

            return {
                status: "error",
                message: "Failed to send invite",
                error: err.response?.body || err.message || "Unknown error"
            };
        }
    }

    async createSession(ownerID, RememberMe, details) {
        return await new this.db.sessions({
            _id: randomToken(8),

            token: randomToken(48),
            ownerID,

            details,

            expire_at: Date.now() + (RememberMe ? 2592000000 : 7200000),
        }).save()
    }

    async createNewUser(email, password, accountType) {
        if (!accountType) {
            return await new this.db.users({
                _id: randomToken(8),
                email: email,
                password: password
            }).save()
        } else {

        }
    }
}
module.exports = Heart;
