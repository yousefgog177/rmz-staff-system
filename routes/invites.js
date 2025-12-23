let fs = require('fs')
let path = require('path')
let express = require('express')

module.exports.execute = (heart, app, ws) => {

    const router = express.Router();

    router.use(async (req, res, next) => {

        req.heart = heart;

        if(req.headers.authorization){

            let session = await req.heart.db.sessions.findOne({
                token: req.headers.authorization,
                expire_at: { $gt: Date.now() }
            }).select({ownerID: 1})
            if(!session) return res.status(401).json({
                error: "Invaild session",
                code: 101
            })

            let userData = await req.heart.db.users.findOne({
                _id: session.ownerID
            }).select({password: 0})
            if(!userData) return res.status(404).json({
                error: "Invaild Account for session",
                code: 101
            })

            if(userData.storeID){
                let storeData = await req.heart.db.stores.findOne({
                    _id: userData.storeID
                })
                if (!storeData) return res.status(404).json({
                    error: "Invaild Store",
                    code: 101
                })
                req.storeData = storeData
            }

            req.userData = userData;

        }

        next()

    });

    var files = fs.readdirSync(path.join(__dirname, "invites")).filter(filename => filename.endsWith(".js"));
    for (var filename of files) {
        var request = require(`./invites/${filename}`);
        router[request.method](request.path, request.run);
    }

    router.use((req, res, next) => {
        res.status(404).send(`Not Found!`)
    });

    console.log("[ROUTES] invites is loaded!")
    app.use("/api/invites", router);

}