const redisClient = require('./utils/redis');
const dbClient = require('./utils/db');

class AppController {

    async getStatus(req, res) {
        try {
            const redisActivity = await redisClient.isAlive() ? true : false;
            const dbActivity = await dbClient.isAlive() ? true : false;
            return res.status(200).json({
                "redis": redisActivity,
                "db": dbActivity
            });
        } catch (error) {
            return res.status(500).json({
                "redis": false,
                "db": false
            });
        }
    }

    async getStats(req, res) {
        try {
            const usersNum = await dbClient.nbUsers()
            const filesNum = await dbClient.nbFiles()
            return res.status(200).json({
                "users": usersNum, "files": filesNum

            })

        } catch (error) {
            return res.status(500).json({
                message: error.message
            })

        }


    }

}

module.exports = AppController