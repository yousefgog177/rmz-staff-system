const fetch = require('node-fetch');

module.exports = {
    path: "/signup",
    method: "post",
    run: async (req, res) => {

        if (req.isFoundEmail) return res.status(404).json({
            error: "This email is already used", code: 104
        })

        let newUser = await req.heart.createNewUser(req.body.email, req.heart.db.hash(req.body.password))

        let mfaTicket = await req.heart.createMFATicket(newUser._id)

        await req.heart.sendMFACode(mfaTicket.code, req.body.email)

        res.status(200).json({ ticketID: mfaTicket._id })

    }
};
