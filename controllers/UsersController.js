const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
  static postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    const users = dbClient.db.collection('users');
    users.findOne({ email }, async (err, user) => {
      if (user) {
        return response.status(400).json({ error: 'Already exist' });
      }
      const hashedPassword = sha1(password);
      try {
        const result = await users.insertOne({ email, password: hashedPassword });
        return response.status(201).json({ id: result.insertedId, email });
      } catch (error) {
        return response.status(500).json({ error: 'Error creating user' });
      }
    });
  }
}

module.exports = UsersController;
