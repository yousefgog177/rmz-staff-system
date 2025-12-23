module.exports = {
    path: "/statistics",
    method: "get",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.statics) {
            return res.status(403).json({ error: "you don't have permission to view statistics" })
        }

        // Get statistics from RMZ
        const statisticsResult = await req.heart.rmz.getStatistics(req.storeData.rmz_key);

        if (!statisticsResult.success) {
            return res.status(statisticsResult.status || 500).json({ 
                error: "Failed to fetch statistics",
                message: statisticsResult.error 
            });
        }

        return res.status(200).json({
            data: statisticsResult.data,
            timestamp: statisticsResult.timestamp
        });

    }
};
