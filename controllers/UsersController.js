const dbClient = require('../utils/db');
const crypto = require('crypto');

class UsersController {
    static async postNew(request, response) {
      const { email, password } = request.body;
  
      if (!email) {
        return response.status(400).json({ error: 'Missing email' });
      }
      if (!password) {
        return response.status(400).json({ error: 'Missing password' });
      }
  
      try {
        const users = dbClient.db.collection('users');
        const user = await users.findOne({ email });
  
        if (user) {
          return response.status(400).json({ error: 'Already exists' });
        }
  
        const hashedPassword = sha1(password);
        const result = await users.insertOne({ email, password: hashedPassword });
  
        return response.status(201).json({ id: result.insertedId, email });
      } catch (error) {
        console.error('Error creating user:', error);
        return response.status(500).json({ error: 'Internal server error' });
      }
    }
  }
  
  module.exports = UsersController;