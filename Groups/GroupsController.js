const mongoose = require('mongoose');
const User = require('../Models/User');

class GroupController {
  async getGroups(req, res) {
    try {
      const user = await User.findById(req.user.id);
      return res.json(user.groups);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async getGroup(req, res) {
    try {
      const user = await User.findById(req.user.id);
      return res.json(user.groups.filter((group) => group.id == req.query.id)[0]);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async getGroupNames(req, res) {
    try {
      const user = await User.findById(req.user.id);
      return res.json(user.groups.map((group) => group.name));
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  async createGroup(req, res) {
    try {
      const user = await User.findById(req.user.id);
      user.groups.push({ ...req.body, id: new mongoose.Types.ObjectId() });
      user.save();
      return res.json(req.body);
    } catch (e) {
      return res.status(400).json({ message: 'collection creation error', errors: e });
    }
  }

  async deleteGroup(req, res) {
    try {
      const user = await User.findById(req.user.id);

      const temp = [];
      user.groups.forEach((group) => {
        if (group.id.toString() != req.query.id) {
          temp.push(group);
        }
      });
      user.groups = temp;
      user.markModified('groups');
      user.save();
      return res.json(user.groups);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }

  async updateGroup(req, res) {
    try {
      const user = await User.findById(req.user.id);

      user.groups.forEach((group, i) => {
        if (group.id.toString() === req.query.id) {
          user.groups[i] = { ...req.body, id: req.query.id };
        }
      });
      user.markModified('groups');
      user.save();
      return res.json(user.groups);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }

  async addToGroup(req, res) {
    try {
      const user = await User.findById(req.user.id);
      user.groups.forEach((group) => {
        if (group.name == req.query.name) {
          group.termins.push(req.body);
        }
      });
      user.markModified('groups');
      user.save();
      return res.json({ message: user.groups });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
}

module.exports = new GroupController();
