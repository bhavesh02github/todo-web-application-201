const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const { Todo } = require("./models");
const bodypaser = require("body-parser");
var cookieParser = require("cookie-parser");
const path = require("path");
app.use(bodypaser.json());
app.use(express.urlencoded({ extented: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
module.exports = {
  "**/*.js": ["eslint --fix", "prettier --write"],
};
//set EJS as view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  const overdueTodos = await Todo.getoverdueTodos();
  const dueTodayTodos = await Todo.getdueTodayTodos();
  const dueLaterTodos = await Todo.getdueLaterTodos();
  const completedTodos = await Todo.getCompletedTodos();
  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      completedTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      completedTodos
    });
  }
});
app.get("/todos", async (request, response) => {
  try {
    const todo = await Todo.findAll();
    return response.send(todo);
    // return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.post("/todos", async (request, response) => {
  console.log("creating a todo", request.body);
  try {
    await Todo.addTodo({
      title: request.body.title,
      duedate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {

  try {
    const todo = await Todo.findByPk(request.params.id);
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
// eslint-disable-line no-unused-vars
app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by ID: ", request.params.id);
  try {
    const st = await Todo.remove(request.params.id);
    return response.json(st > 0);
  } catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;
