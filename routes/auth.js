let fs = require('fs')
let path = require('path')
let express = require('express')

module.exports.execute = (heart, app) => {

    const router = express.Router();

    router.use(async (req, res, next) => {

        req.heart = heart;

        if (req.body.email) {
            req.isFoundEmail = await req.heart.db.users.findOne({ email: req.body.email }).select({ password: 1 })
        } 

        next()

    });

    var files = fs.readdirSync(path.join(__dirname, "auth")).filter(filename => filename.endsWith(".js"));
    for (var filename of files) {
        var request = require(`./auth/${filename}`);
        router[request.method](request.path, request.run);
    }

    router.use((req, res, next) => {
        res.status(404).send(`Not Found!`)
    });

    console.log("[ROUTES] auth is loaded!")
    app.use("/api/auth", router);

}