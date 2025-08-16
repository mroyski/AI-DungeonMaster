const BaseController = require('./BaseController');
const User = require('../models/user');

class AuthController extends BaseController {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return this.badRequest(res, 'Username and password required');
      }

      const user = await User.findOne({ username });
      if (!user || !user.passwordMatch(password)) {
        return this.unauthorized(res, 'Incorrect username or password');
      }

      return this.success(res, {
        id: user.id,
        username: user.username
      }, 'Login successful');
    } catch (error) {
      console.error('Login error:', error);
      return this.serverError(res, 'Login unsuccessful');
    }
  }
}

module.exports = new AuthController();