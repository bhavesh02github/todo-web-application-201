'use strict';
const { Model,Op } = require('sequelize');
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

    static addTodo({ title, dueDate }){
      return this.create({ title: title, duedate: dueDate, completed: false})
    }

    static getTodos() {
      return this.findAll();
    }

    markAsCompleted() {
      return this.update({ completed: true})
    }

    static getoverdueTodos(){
      const date = new Date();
      return this.findAll({
        where: {
          duedate: {
            [Op.lt]: date,  
          },
        },
      });
    }
    static getdueTodayTodos(){
      const date = new Date();
      return this.findAll({
        where: {
          duedate: {
            [Op.eq]: date,  
          },
        },
      });
    }
    static getdueLaterTodos(){
      const date = new Date();
      return this.findAll({
        where: {
          duedate: {
            [Op.gt]: date,  
          },
        },
      });
    }

  }
  Todo.init({
    title: DataTypes.STRING,
    duedate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, 
  {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
