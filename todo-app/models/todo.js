/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      // define association here
    }
    static addTodo({ title, duedate, userId }) {
      return this.create({ title: title, duedate: duedate, completed: false, userId });
    }
    setCompletionStatus(completed) {
      let r = completed;
      return this.update({ completed: r });
    }
    static getTodos() {
      return this.findAll();
    }

    static async getCompleted(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId
        },
        order: [["id", "ASC"]],
      });
    }

    static getoverdueTodos(userId) {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.lt]: date,
          },
          userId,
          completed: {
            [Op.eq]: false,
          },
        },
        order: [["id", "ASC"]],
      });
    }
    static getdueTodayTodos(userId) {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.eq]: date,
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static async remove(id,userId) {
      return this.destroy({
        where: {
          id,
          userId
        },
      });
    }
    static getdueLaterTodos(userId) {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.gt]: date,
          },
          userId,
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
  }
  Todo.init(
    {
      title:  DataTypes.STRING,
      duedate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
