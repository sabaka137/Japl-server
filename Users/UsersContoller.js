const User = require("../Models/User");
const mongoose = require("mongoose");
const events = require("events");
const emitter = new events.EventEmitter();
class UsersContoller {
  async getTeachers(req, res) {
    try {
      // тута фильтр абоба
      const user = await User.find({});
      let resArray = user.filter((user) => user.role === "teacher");
      return res.json(resArray);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async getTeacher(req, res) {
    try {
      const user = await User.findById(req.query.id);
      return res.json(user);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async getUsers(req, res) {
    try {
      const user = await User.find({});
      return res.json(user);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async addToFavorite(req, res) {
    try {
      const user = await User.findById(req.user.id);
      user.favoriteTeachers.push(req.body.teacherId);

      user.save();
      return res.json(user);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async removeFromFavorite(req, res) {
    try {
      const user = await User.findById(req.user.id);
      let temp = [];
      user.favoriteTeachers.forEach((teacher) => {
        if (teacher != req.body.teacherId) {
          temp.push(teacher);
        }
      });
      user.favoriteTeachers = temp;
      user.markModified("favoriteTeachers");
      user.save();

      return res.json(user.favoriteTeachers);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async getFavoriteTeachers(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const teachers = await User.find({});
      let resArray = teachers.filter((teacher) => teacher.role === "teacher");

      const userFavorite = [];
      resArray.forEach((teacher) => {
        if (user.favoriteTeachers.includes(teacher._id)) {
          userFavorite.push(teacher);
        }
      });
      return res.json(userFavorite);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async getUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      return res.json(user);
    } catch (e) {
      return res.json(null);
    }
  }
  async refreshData(req, res) {
    try {
      const user = await User.findById(req.user.id);
      emitter.once("newLesson", (message) => {
        return res.json(user.lessons);
      });
    } catch (e) {}
  }
  async subscribeNotifications(req, res) {
    try {
      emitter.once("newNotification", async (message) => {
        const receiver = await User.findById(message.receiver);
        const user = await User.findById(req.user.id);
        console.log("User:", user.name, "Чел который получил смску", receiver.name);
        if (user._id == receiver._id) {
          console.log("Я получил уведомление", receiver.name);
          receiver.notifications.push(message);
          receiver.save();
          return res.json(receiver.notifications);
        } else {
          return res.json(user.notifications);
        }
      });
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async getLessons(req, res) {
    try {
      const user = await User.findById(req.user.id);
      return res.json(user.lessons);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async setLessons(req, res) {
    try {
      const user = await User.findById(req.user.id);
      const teacher = await User.findById(req.body.teacherId);
      let utctime = new Date(req.body.date)
        .toUTCString()
        .split(" ")[4]
        .split(":")
        .slice(0, -1)
        .join(":");
      teacher.schedule[req.body.dayIndex] = {
        ...teacher.schedule[req.body.dayIndex],
        time: teacher.schedule[req.body.dayIndex].time.map((el) =>
          el.time === utctime ? { ...el, isAvailable: false } : { ...el }
        ),
      };
      user.lessons.push(req.body);
      teacher.lessons.push(req.body);
      emitter.emit("newLesson", req.body);
      emitter.emit("newNotification", {
        sender: user._id,
        receiver: teacher._id,
        message: "Записался к вам на пробный урок",
      });
      user.save();
      teacher.save();
      return res.json("200");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
  async updateUser(req, res) {
    try {
      const user = await User.findById(req.user.id);
      Object.keys(req.body).forEach((el) => {
        req.body[el];
        if (req.body[el] !== "") {
          user[el] = req.body[el];
        }
      });
      user.save();
      return res.json("200");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  }
}

module.exports = new UsersContoller();
