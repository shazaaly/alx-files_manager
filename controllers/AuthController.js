import dbClient from '../utils/db';
const redisClient = require('redisClient');

import { v4 as uuidv4 } from 'uuid';

class AuthController {
    static async getConnect(req, res) {
        const auth = req.headers['authorization']
        if(!auth){
            res.status(401).json({
                message:"unauthorized"

            })
        }
        const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString('utf-8')
        const {email, password} = credentials.split(':')
        const hashedPassword = sha1(password)
        const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword })
        if(!user){
            res.status(401).json({
                message:"unauthorized"

            })
        }
        else{
            const token = uuidv4()
            redisClient.set(`auth_${token}`, user.id, 86400)
            return res.status(200).json({ token })


        }


    }

    static getDisconnect() { }
    static getDisconnect() { }


}

module.exports = AuthController;