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
      // define association here
    }
    static addTodo({ title, duedate }) {
      if (!title) {
        throw new Error("Title is required.");
      }
      if (!duedate) {
        throw new Error("Due date is required.");
      }
      return this.create({ title: title, duedate: dueDate, completed: false });
    }
    setCompletionStatus(completed) {
      let r = completed;
      return this.update({ completed: r });
    }
    static getTodos() {
      return this.findAll();
    }

    static async getCompleted() {
      return this.findAll({
        where: {
          completed: true,
        },
      });
    }

    static getoverdueTodos() {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.lt]: date,
          },
          completed: {
            [Op.eq]: false,
          },
        },
      });
    }
    static getdueTodayTodos() {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.eq]: date,
          },
          completed: false,
        },
      });
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
    static getdueLaterTodos() {
      let date = new Date().toISOString().split("T")[0];
      return this.findAll({
        where: {
          duedate: {
            [Op.gt]: date,
          },
          completed: false,
        },
      });
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
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
