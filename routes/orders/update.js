module.exports = {
    path: "/update/:id",
    method: "put",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        const orderId = req.params.id;
        const { status } = req.body;

        // Validate status
        const validStatuses = [1, 2, 3, 4, 5, 6];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: "Invalid status code",
                message: "Status must be between 1-6"
            });
        }

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        
        if (!isOwner) {
            // Check if user has permission to update this specific status
            if (!req.userData.permissions.update_order || !Array.isArray(req.userData.permissions.update_order)) {
                return res.status(403).json({ error: "you don't have permission to update orders" })
            }
            
            // Check if the specific status is in allowed list
            if (!req.userData.permissions.update_order.includes(status)) {
                return res.status(403).json({ 
                    error: "you don't have permission to update order to this status",
                    allowed_statuses: req.userData.permissions.update_order
                })
            }
        }

        if (!status) {
            return res.status(400).json({ 
                error: "Status is required" 
            });
        }

        // Update order in RMZ
        const updateResult = await req.heart.rmz.updateOrder(req.storeData.rmz_key, orderId, status);

        if (!updateResult.success) {
            return res.status(updateResult.status || 500).json({ 
                error: "Failed to update order",
                message: updateResult.error 
            });
        }

        return res.status(200).json({
            message: updateResult.message,
            data: updateResult.data
        });

    }
};