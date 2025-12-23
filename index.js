let express = require('express');
let bodyParser = require('body-parser');
const config = require('./config');

let fs = require("fs")
let path = require("path")

const app = express();
app.use(bodyParser.json());

// CORS middleware to allow requests from Next.js frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

app.use(express.json());
app.listen(config.PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${config.PORT}`);
});

let Database = require("./db.js");
const db = new Database();

let heart = require("./heart.js")
let Heart = new heart(db);
Heart.db = db;

(async () => {
    const files = fs.readdirSync(path.join(process.cwd(), "routes"))
        .filter(filename => filename.endsWith(".js"));

    for (let filename of files) {
        const route = await import(`./routes/${filename}`);
        await route.execute(Heart, app);
    }
})();