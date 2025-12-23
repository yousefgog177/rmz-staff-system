
module.exports = {
    path: "/accept/:id",
    method: "post",
    run: async (req, res) => {

        const inviteId = req.params.id;

        if (!inviteId) {
            return res.status(400).json({ error: "invite ID is required" });
        }

        const invite = await req.heart.db.invites.findOne({ _id: inviteId });

        if (!invite) {
            return res.status(404).json({ error: "invite not found or expired" });
        }

        // Check if user already exists
        const existingUser = await req.heart.db.users.findOne({ email: invite.email });
        if (existingUser) {
            await req.heart.db.invites.deleteOne({ _id: inviteId });
            return res.status(400).json({ error: "user already exists" });
        }

        // Create new user
        const randomToken = require("random-token");
        const newUser = await new req.heart.db.users({
            _id: randomToken(8),
            email: invite.email,
            storeID: invite.storeID,
            password: null,
            permissions: invite.permissions
        }).save();

        // Create session
        const session = await req.heart.createSession(newUser._id, false, {
            userAgent: req.headers['user-agent'],
            ip: req.ip
        });

        // Delete invite
        await req.heart.db.invites.deleteOne({ _id: inviteId });

        return res.status(200).json({
            message: "Invite accepted successfully",
            token: session.token,
            userId: newUser._id
        });

    }
};
