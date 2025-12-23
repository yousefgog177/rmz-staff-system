
module.exports = {
    path: "/kick/:id",
    method: "delete",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.remove_staff) {
            return res.status(403).json({ error: "you don't have permission to remove staff" })
        }

        const staffId = req.params.id;

        if (!staffId) {
            return res.status(400).json({ error: "staff ID is required" });
        }

        // Prevent removing owner
        if (staffId === req.storeData.ownerID) {
            return res.status(403).json({ error: "cannot remove store owner" });
        }

        // Find staff member
        const staff = await req.heart.db.users.findOne({
            _id: staffId,
            storeID: req.storeData._id
        });

        if (!staff) {
            return res.status(404).json({ error: "staff member not found" });
        }

        // Delete staff member
        await req.heart.db.users.deleteOne({ _id: staffId });

        // Delete all sessions for this user
        await req.heart.db.sessions.deleteMany({ ownerID: staffId });

        return res.status(200).json({
            message: "Staff member removed successfully"
        });

    }
};
