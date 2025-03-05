const db = require("../../database/models")
const jwt = require("jsonwebtoken")

const authJWT = (...allowedRoles) => {
    return async (req, res, next) => {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({ info: "Unauthorized" })
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, parsed) => {
            if (err) {
                return res.status(401).json({ info: "Unauthorized" })
            }

            const user = await db.Users.findByPk(parsed.user_id, {
                include: { model: db.Roles, include: db.RoleTypes }
            })

            if (!user) {
                return res.status(400).json({ info: "User do not exist" })
            }

            req.user = user
            req.user.roles = user.Roles.map(role => role.RoleType.role_name)

            if (allowedRoles.length > 0) {
                const hasAccess = req.user.roles.some(role => allowedRoles.includes(role))
                if (!hasAccess) {
                    return res.status(403).json({
                        info: "User do not have permission to perform this action"
                    })
                }
            }

            next()
        })
    }
}

module.exports = authJWT