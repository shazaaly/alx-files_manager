const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const fs = require('fs');


class FilesController{
    static async getUser(request) {
        const token = request.header('X-Token');
        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
        if (userId) {
          const users = dbClient.db.collection('users');
          const idObject = new ObjectID(userId);
          const user = await users.findOne({ _id: idObject });
          if (!user) {
            return null;
          }
          return user;
        }
        return null;
      }

      static async postUpload(req, res){
        const user = await FilesController.getUser(req);
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        const { name } = req.body;
        const { type } = req.body;
        const { isPublic } = req.body || false;
        const { parentId } = req.body || 0;
        const { data } = req.body;
        if (!name) {
          return res.status(400).json({ error: 'Missing name' });
        }
        if (!type) {
          return res.status(400).json({ error: 'Missing type' });
        }
        if (type !== 'folder' && !data) {
          return res.status(400).json({ error: 'Missing data' });
        }
        
        const files = dbClient.db.collection('files');
        const parentFile = await files.findOne({ _id: parentId });
        if (!parentFile) {
            return res.status(400).json({ error: 'Parent not found' });
        }
        if (parentFile.type !== 'folder') {
            return res.status(400).json({ error: 'Parent is not a folder' });
        }
        if (type == 'folder') {
            files.insertOne({
                userId: user._id,
                name,
                type,
                isPublic,
                parentId : parentFile._id || 0
            });
            return res.status(201).json({
                userId: user._id,
                name,
                type,
                isPublic,
                parentId : parentFile._id || 0
            });
            
        }else{
            const path = process.env.FOLDER_PATH || '/tmp/files_manager';
            const fileName = uuidv4();
            const filePath = `${path}/${fileName}`;
            const buff = Buffer.from(data, 'base64');
            fs.writeFile(filePath, buff, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Cannot write the file' });
                }
            });
            files.insertOne({
                userId: user._id,
                name,
                type,
                isPublic,
                parentId : parentFile._id || 0,
                localPath: filePath
            });
            return res.status(201).json({
                userId: user._id,
                name,
                type,
                isPublic,
                parentId : parentFile._id || 0,
                localPath: filePath
            });





        }

      }

}

module.exports = FilesController;