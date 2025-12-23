
module.exports = {
    path: "/edit/:id",
    method: "put",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.add_staff) {
            return res.status(403).json({ error: "you don't have permission to edit staff permissions" })
        }

        const staffId = req.params.id;
        const { permissions } = req.body;

        if (!staffId) {
            return res.status(400).json({ error: "staff ID is required" });
        }

        if (!permissions) {
            return res.status(400).json({ error: "permissions are required" });
        }

        // Prevent editing owner
        if (staffId === req.storeData.ownerID) {
            return res.status(403).json({ error: "cannot edit store owner permissions" });
        }

        // Find staff member
        const staff = await req.heart.db.users.findOne({
            _id: staffId,
            storeID: req.storeData._id
        });

        if (!staff) {
            return res.status(404).json({ error: "staff member not found" });
        }

        // Update permissions
        await req.heart.db.users.updateOne(
            { _id: staffId },
            { permissions }
        );

        return res.status(200).json({
            message: "Staff permissions updated successfully"
        });

    }
};
