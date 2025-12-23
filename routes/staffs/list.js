
module.exports = {
    path: "/list",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.see_staffs) {
            return res.status(403).json({ error: "you don't have permission to see staffs" })
        }

        // Get all users for this store
        const staffs = await req.heart.db.users.find({ 
            storeID: req.storeData._id 
        })

        console.log(req.storeData)

        return res.status(200).json({
            data: staffs.map(x => {let pass = x._doc.password; delete x._doc.password; return {...x._doc, isCompletedProfile: pass?true:false}}),
            ownerID: req.storeData.ownerID
        });

    }
};
