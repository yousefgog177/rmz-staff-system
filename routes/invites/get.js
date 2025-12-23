
module.exports = {
    path: "/get/:id",
    method: "get",
    run: async (req, res) => {

        const inviteId = req.params.id;

        if (!inviteId) {
            return res.status(400).json({ error: "invite ID is required" });
        }

        const invite = await req.heart.db.invites.findOne({
            _id: inviteId
        }).select('email storeID permissions');

        if (!invite) {
            return res.status(404).json({ error: "invite not found or expired" });
        }

        // Get store name
        const store = await req.heart.db.stores.findOne({ _id: invite.storeID });

        return res.status(200).json({
            data: {
                email: invite.email,
                storeName: store?.name || 'Unknown Store',
                permissions: invite.permissions
            }
        });

    }
};
