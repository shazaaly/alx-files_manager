const dbClient = require('../utils/db');
const crypto = require('crypto');

class UsersController {

    static async postNew(req, res) {
        const {email, password} = req.body

        const existingUser = await dbClient.db.collection('users').findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                error: 'Already exist'
            })

        }
        if (!email) return res.json.status(400).send({ error: 'Missing email' })
        if (!password) return res.json.status(400).send({ error: 'Missing password' })

        const hashed = crypto.createHash('SHA1').update(password).digest('hex')
        const newUser = {
            email,
            password: hashed
        }
        try {
            await dbClient.db.Collection('users').insertOne(newUser)
            return res.stataus(201).json({
                email,
                id : insertedId
            })


        } catch (error) {
            return res.stataus(500).json({ error: 'Error creating user' })

        }

    }

}

module.exports = UsersController;