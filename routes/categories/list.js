module.exports = {
    path: "/list",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.categories_list) {
            return res.status(403).json({ error: "you don't have permission to see categories" })
        }

        // Get page from query params
        const page = parseInt(req.query.page) || 1;

        // Get categories from RMZ
        const categoriesResult = await req.heart.rmz.getCategories(req.storeData.rmz_key, page);

        if (!categoriesResult.success) {
            return res.status(categoriesResult.status || 500).json({ 
                error: "Failed to fetch categories",
                message: categoriesResult.error 
            });
        }

        return res.status(200).json({
            data: categoriesResult.data,
            current_page: categoriesResult.current_page,
            per_page: categoriesResult.per_page,
            from: categoriesResult.from,
            to: categoriesResult.to,
            next_page_url: categoriesResult.next_page_url,
            prev_page_url: categoriesResult.prev_page_url,
            first_page_url: categoriesResult.first_page_url,
            path: categoriesResult.path,
            timestamp: categoriesResult.timestamp
        });

    }
};
