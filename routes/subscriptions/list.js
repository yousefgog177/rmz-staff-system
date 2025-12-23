module.exports = {
    path: "/list",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.subscriptions_list) {
            return res.status(403).json({ error: "you don't have permission to see subscriptions" })
        }

        // Get query params
        const params = {
            page: parseInt(req.query.page) || 1,
            customerEmail: req.query.customerEmail,
            customerCountryCode: req.query.customerCountryCode,
            customerPhone: req.query.customerPhone
        };

        // Get subscriptions from RMZ
        const subscriptionsResult = await req.heart.rmz.getSubscriptions(req.storeData.rmz_key, params);

        if (!subscriptionsResult.success) {
            return res.status(subscriptionsResult.status || 500).json({ 
                error: "Failed to fetch subscriptions",
                message: subscriptionsResult.error 
            });
        }

        return res.status(200).json({
            data: subscriptionsResult.data,
            current_page: subscriptionsResult.current_page,
            per_page: subscriptionsResult.per_page,
            from: subscriptionsResult.from,
            to: subscriptionsResult.to,
            next_page_url: subscriptionsResult.next_page_url,
            prev_page_url: subscriptionsResult.prev_page_url,
            first_page_url: subscriptionsResult.first_page_url,
            path: subscriptionsResult.path,
            timestamp: subscriptionsResult.timestamp
        });

    }
};
