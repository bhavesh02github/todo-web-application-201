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
    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    static getTodos() {
      return this.findAll();
    }

    setCompletionStatus(completed) {
      // if(completed)
      //   return this.update({ completed: false });
      // else{
      //   return this.update({ completed: true });}
      const status = !completed;
      return this.update({completed: status});
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }

    static getoverdueTodos() {
      const date = new Date();
      return this.findAll({
        where: {
          duedate: {
            [Op.lt]: date,
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static getdueTodayTodos() {
      const date = new Date();
      return this.findAll({
        where: {
          duedate: {
            [Op.eq]: date,
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static getdueLaterTodos() {
      const date = new Date();
      return this.findAll({
        where: {
          duedate: {
            [Op.gt]: date,
          },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }
    static getCompletedTodos() {
      return this.findAll({
        where: {
          completed :{
            [Op.eq]: true,
          },
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
