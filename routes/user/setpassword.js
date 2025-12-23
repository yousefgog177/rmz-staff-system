
module.exports = {
    path: "/psasword",
    method: "post",
    run: async (req, res) => {
        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (req.userData.password) return res.status(400).json({ error: "This user already have password" })

        await req.heart.db.users.updateOne({_id: req.userData._id}, {password: req.heart.db.hash(req.body.password)})
        
        return res.status(200).json({})

    }
};