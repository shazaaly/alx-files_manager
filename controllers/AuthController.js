const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
import crypto from 'crypto';

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
        const parts= credentials.split(':')
        if (parts.length < 2) {
            return res.status(401).json({ error: 'Unauthorized'});

            
        }
        const [email, password] = parts
        const hashedPassword = crypto.createHash('sha1').update(password).digest('hex')

        const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword })
        if(!user){
            res.status(401).json({
                message:"unauthorized"

            })
        }
        else{
            const token = uuidv4()
            await redisClient.set(`auth_${token}`, user._id, 86400)
            return res.status(200).json({ token })

        }


    }

    static async getDisconnect(request, response) {
        const token = request.header('X-Token');
        const key = `auth_${token}`;
        const id = await redisClient.get(key);
        if (id) {
          await redisClient.del(key);
          response.status(204).json({});
        } else {
          response.status(401).json({ error: 'Unauthorized' });
        }
      }

}

module.exports = AuthController;