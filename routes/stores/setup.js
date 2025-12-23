
module.exports = {
    path: "/setup",
    method: "post",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })

        if (req.userData.storeID) return res.status(400).json({ error: "this account already setup store" })

        // Check if API key is provided
        const { apiKey } = req.body;

        if (!apiKey) {
            return res.status(400).json({
                error: "API key is required",
                message: "Please provide your RMZ merchant API key"
            });
        }

        // Verify the API key with RMZ
        const storeInfo = await req.heart.rmz.getStoreInfo(apiKey);

        if (!storeInfo.success) {
            return res.status(401).json({
                error: "Invalid API key",
                message: storeInfo.error || "The provided RMZ API key is invalid or expired"
            });
        }

        let store = await req.heart.db.stores.findOne({ _id: storeInfo.data.id })
        if(store){
            return res.status(401).json({
                error: "USED STORE",
                message: "The provided RMZ API key is already used before and linked with account"
            });
        }

        await req.heart.db.stores({
            _id: storeInfo.data.id,

            rmz_key: apiKey,
            ownerID: req.userData._id,

        }).save()

        await req.heart.db.users.updateOne({_id: req.userData._id }, {
            storeID: storeInfo.data.id
        })

        return res.status(200).json({
            id: storeInfo.data.id,
            name: storeInfo.data.name,
            domain: storeInfo.data.domain,
            description: storeInfo.data.description,
            logo: storeInfo.data.logo,
            color: storeInfo.data.color
        });

    }
};