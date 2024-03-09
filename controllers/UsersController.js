import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return response.status(400).json({ error: 'Missing password' });
    }

    const users = dbClient.db.collection('users');
    const user = await users.findOne({ email });
    if (user) {
      return response.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);
    const result = await users.insertOne({ email, password: hashedPassword });
    return response.status(201).json({ id: result.insertedId, email });
  }
}

export default UsersController;