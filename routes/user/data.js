
module.exports = {
    path: "/data",
    method: "get",
    run: async (req, res) => {
        if (!req.userData) return res.status(400).json({ error: "this action require login" })

        return res.status(200).json({ 
            storeID: req.userData.storeID, 
            permissions: req.userData.permissions,
            isOwner: req.storeData.ownerID === req.userData._id,
            isCompletedProfile: req.userData.password ? true : false
         })

    }
};