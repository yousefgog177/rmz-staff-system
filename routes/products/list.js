module.exports = {
    path: "/list",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.products_list) {
            return res.status(403).json({ error: "you don't have permission to see products" })
        }

        // Check if request wants all products
        const all = req.query.all === 'true';

        if (all) {
            // Get all products across all pages
            const productsResult = await req.heart.rmz.getAllProducts(req.storeData.rmz_key);

            if (!productsResult.success) {
                return res.status(productsResult.status || 500).json({ 
                    error: "Failed to fetch products",
                    message: productsResult.error 
                });
            }

            return res.status(200).json({
                data: productsResult.data,
                total: productsResult.total
            });
        }

        // Get page from query params
        const page = parseInt(req.query.page) || 1;

        // Get products from RMZ
        const productsResult = await req.heart.rmz.getProducts(req.storeData.rmz_key, page);

        if (!productsResult.success) {
            return res.status(productsResult.status || 500).json({ 
                error: "Failed to fetch products",
                message: productsResult.error 
            });
        }

        return res.status(200).json({
            data: productsResult.data,
            current_page: productsResult.current_page,
            per_page: productsResult.per_page,
            from: productsResult.from,
            to: productsResult.to,
            next_page_url: productsResult.next_page_url,
            prev_page_url: productsResult.prev_page_url,
            first_page_url: productsResult.first_page_url,
            path: productsResult.path,
            timestamp: productsResult.timestamp
        });

    }
};
