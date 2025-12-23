module.exports = {
    path: "/create",
    method: "post",
    run: async (req, res) => {

        if (!req.userData) return res.status(400).json({ error: "this action require login" })
        if (!req.storeData) return res.status(400).json({ error: "store not found" })

        // Check permissions
        const isOwner = req.storeData.ownerID === req.userData._id;
        if (!isOwner && !req.userData.permissions.add_staff) {
            return res.status(403).json({ error: "you don't have permission to add staff" })
        }

        const { email, permissions } = req.body;

        if (!email) {
            return res.status(400).json({ error: "email is required" });
        }

        // Check if user already exists
        const existingUser = await req.heart.db.users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "user with this email already exists" });
        }

        // Check if invite already exists
        const existingInvite = await req.heart.db.invites.findOne({ 
            email, 
            storeID: req.storeData._id 
        });
        if (existingInvite) {
            return res.status(400).json({ error: "invite already sent to this email" });
        }

        // Create invite
        const randomToken = require("random-token");
        const invite = await new req.heart.db.invites({
            _id: randomToken(32),
            email,
            storeID: req.storeData._id,
            permissions: permissions || {
                see_orders: false,
                see_order: false,
                create_order: false,
                update_order: [],
                products_list: false,
                product_details: false,
                categories_list: false,
                subscriptions_list: false,
                subscription_details: false,
                statics: false,
                add_staff: false,
                remove_staff: false,
                see_staffs: false
            }
        }).save();

        // Send invite email
        const inviteUrl = `${req.heart.config.FRONT_URL}accept-invite/${invite._id}`;
        await req.heart.sendInviteEmail(email, inviteUrl);

        return res.status(200).json({
            message: "Invite sent successfully",
            inviteId: invite._id
        });

    }
};
