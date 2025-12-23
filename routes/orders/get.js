module.exports = {
    path: "/get/:id",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.see_order) {
            return res.status(403).json({ error: "you don't have permission to view order details" })
        }

        const orderId = req.params.id;

        // Fetch order details from RMZ
        const orderResult = await req.heart.rmz.getOrder(req.storeData.rmz_key, orderId);

        if (!orderResult.success) {
            return res.status(orderResult.status || 500).json({ 
                error: "Failed to fetch order details",
                message: orderResult.error 
            });
        }

        return res.status(200).json(orderResult.data);

    }
};