require('dotenv').config({ path: `${process.cwd()}/.env` });
const express = require("express");
const cors = require("cors");
const router = require("./src/routes/router");
const { dbConnect } = require("./database/config/database")
const PORT = process.env.APP_PORT || 4000;

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) {
            return callback(null, true)
        }
        return callback(null, true)
    },
    optionsSuccessStatus: 200,
    credentials: true
}
const app = express()

app.use(express.json())
app.use(cors(corsOptions))

dbConnect(5).then(() => {
    if (process.env.NODE_ENV == 'production') {
        app.use("/api", router);
        app.listen(PORT, () => {
            console.log(`E-FLOW API RUNNING ON PORT ${PORT} WITH ${process.env.NODE_ENV} CONFIGURATION`);
        });
    } else if (process.env.NODE_ENV == 'development') {
        app.use("/dev/api", router);
        app.listen(PORT, () => {
            console.log(`E-FLOW API RUNNING ON PORT ${PORT} WITH ${process.env.NODE_ENV} CONFIGURATION`);
        });
    } else if (process.env.NODE_ENV == 'test') {
        console.log("E-FLOW API IS CURRENTLY RUNNING TEST, NO REQUEST WILL BE ACCEPTED");
    } else {
        console.log(`ERROR, UNKNOWN ENVIRONMENT: ${process.env.NODE_ENV}`);
    }
}).catch((err) => {
    console.error("DATABASE CONNECTION FAILED, SERVER NOT STARTED")
})

module.exports = app;