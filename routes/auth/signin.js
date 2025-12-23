
module.exports = {
    path: "/signin",
    method: "post",
    run: async (req, res) => {

        if (!req.isFoundEmail) return res.status(404).json({
            error: "We can't find account by this email", code: 104
        });

        if (req.heart.db.hash(req.body.password) !== req.isFoundEmail.password) return res.status(401).json({
            error: "Password not matched", code: 104
        });

        let mfaTicket = await req.heart.createMFATicket(req.isFoundEmail._id)

        await req.heart.sendMFACode(mfaTicket.code, req.body.email)

        res.status(200).json({ ticketID: mfaTicket._id })

    }
};
