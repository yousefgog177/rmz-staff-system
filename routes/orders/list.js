module.exports = {
    path: "/list",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.see_orders) {
            return res.status(403).json({ error: "you don't have permission to view orders" })
        }

        // Get query parameters
        const { page, created_from, created_to, orderBy, orderDirection } = req.query;

        // Fetch orders from RMZ
        const ordersResult = await req.heart.rmz.getOrders(req.storeData.rmz_key, {
            page,
            created_from,
            created_to,
            orderBy,
            orderDirection
        });

        if (!ordersResult.success) {
            return res.status(500).json({ 
                error: "Failed to fetch orders",
                message: ordersResult.error 
            });
        }

        return res.status(200).json(ordersResult.data);

    }
};