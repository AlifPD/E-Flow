const bcrypt = require('bcrypt')

async function hashUsers(userData) {
    const hashedUsers = await Promise.all(
        userData.map(async (data) => {
            let hashedPass = await bcrypt.hash(data.password, 10);
            return {
                ...data,
                password: hashedPass,
            };
        })
    );
    return hashedUsers;
}

module.exports = hashUsers([
    {
        // id: , user id
        // employee_id: "", employee id (ex: HRD000001)
        // password: "",
        // fullname: "",
        // email: "",
        // phone: "",
        // address: "",
        // profile_picture: "",
        // department: "",
        // createdAt: new Date(),
        // updatedAt: new Date()
    }
])