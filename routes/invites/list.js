
module.exports = {
    path: "/list",
    method: "get",
    run: async (req, res) => {
        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.see_staffs) {
            return res.status(403).json({ error: "you don't have permission to view invites" })
        }

        const invites = await req.heart.db.invites.find({ 
            storeID: req.storeData._id 
        }).select('-__v');

        return res.status(200).json({
            data: invites
        });

    }
};
