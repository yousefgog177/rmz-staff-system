
module.exports = {
    path: "/mfa",
    method: "post",
    run: async (req, res) => {

        let checkMfa = await req.heart.mfaCheck(req.body.ticketID, req.body.code)

        if (!checkMfa) return res.status(400).json({ error: "Invaild expired" })
        if (!checkMfa.approveToken) return res.status(400).json({ error: "Incorrect Code" })
        console.log(checkMfa)

        let session = await req.heart.createSession(checkMfa.ownerID, true, {
            userAgent: req.headers["user-agent"],
            ip: req.ip,
        });
        console.log(session)

        return res.status(200).json({ token: session.token })

    }
};