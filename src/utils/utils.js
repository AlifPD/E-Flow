const { S3Client } = require("@aws-sdk/client-s3")

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    },
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT
})

module.exports = {
    s3Client
}