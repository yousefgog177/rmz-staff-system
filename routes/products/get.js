module.exports = {
    path: "/get/:id",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.product_details) {
            return res.status(403).json({ error: "you don't have permission to see product details" })
        }

        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({ error: "product ID is required" });
        }

        // Get product from RMZ
        const productResult = await req.heart.rmz.getProduct(req.storeData.rmz_key, productId);

        if (!productResult.success) {
            return res.status(productResult.status || 500).json({ 
                error: "Failed to fetch product details",
                message: productResult.error 
            });
        }

        return res.status(200).json({
            data: productResult.data,
            timestamp: productResult.timestamp
        });

    }
};
