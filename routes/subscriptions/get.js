module.exports = {
    path: "/get/:id",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.subscription_details) {
            return res.status(403).json({ error: "you don't have permission to see subscription details" })
        }

        const subscriptionId = req.params.id;

        if (!subscriptionId) {
            return res.status(400).json({ error: "subscription ID is required" });
        }

        // Get subscription from RMZ
        const subscriptionResult = await req.heart.rmz.getSubscription(req.storeData.rmz_key, subscriptionId);

        if (!subscriptionResult.success) {
            return res.status(subscriptionResult.status || 500).json({ 
                error: "Failed to fetch subscription details",
                message: subscriptionResult.error 
            });
        }

        return res.status(200).json({
            data: subscriptionResult.data,
            timestamp: subscriptionResult.timestamp
        });

    }
};
