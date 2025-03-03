const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config.js');

const sequelize = new Sequelize(config[env]);

async function dbConnect(maxRet) {
    try {
        await sequelize.authenticate()
        console.log("DATABASE CONNECTED")
    } catch (error) {
        console.error(`DATABASE CONNECTION ERROR: ${error}`)

        if (maxRet) {
            console.log(`RETRYING DATABASE CONNECTION 5 SECONDS ... ${maxRet} RETRIES LEFT`)
            setTimeout(() => dbConnect(maxRet - 1), 5000)
        } else {
            console.error("DATABASE CONNECTION FAILED")
            process.exit(1)
        }
    }
}

module.exports = {sequelize, dbConnect};