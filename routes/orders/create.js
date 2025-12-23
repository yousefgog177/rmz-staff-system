module.exports = {
    path: "/create",
    method: "post",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.create_order) {
            return res.status(403).json({ error: "you don't have permission to create orders" })
        }

        const { customer, products, coupon_code, created_from } = req.body;

        if (!customer || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ 
                error: "Invalid order data",
                message: "Customer and products are required" 
            });
        }

        // Create order in RMZ
        const orderResult = await req.heart.rmz.createOrder(req.storeData.rmz_key, {
            customer,
            products,
            coupon_code,
            created_from: created_from + ".com"
        });

        if (!orderResult.success) {
            return res.status(orderResult.status || 500).json({ 
                error: "Failed to create order",
                message: orderResult.error 
            });
        }

        return res.status(201).json({
            message: orderResult.message,
            data: orderResult.data
        });

    }
};