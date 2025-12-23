
module.exports = {
    path: "/delete/:id",
    method: "delete",
    run: async (req, res) => {
        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.remove_staff) {
            return res.status(403).json({ error: "you don't have permission to remove invites" })
        }

        const inviteId = req.params.id;

        if (!inviteId) {
            return res.status(400).json({ error: "invite ID is required" });
        }

        const invite = await req.heart.db.invites.findOne({
            _id: inviteId,
            storeID: req.storeData._id
        });

        if (!invite) {
            return res.status(404).json({ error: "invite not found" });
        }

        await req.heart.db.invites.deleteOne({ _id: inviteId });

        return res.status(200).json({
            message: "Invite deleted successfully"
        });

    }
};
