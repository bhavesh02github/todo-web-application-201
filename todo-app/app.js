const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodypaser = require("body-parser");
const path = require("path");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
app.use(bodypaser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("Oops! Something went wrong!"));

app.use(csrf("this_should_be_32_character_long",["POST","PUT","DELETE"]));
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
      // allTodos: allTodos.filter(todo => !todo.completed),
      // overdueTodos: overdueTodos.filter(todo => !todo.completed),
      // dueTodayTodos: dueTodayTodos.filter(todo => !todo.completed),
      // dueLaterTodos: dueLaterTodos.filter(todo => !todo.completed),
      allTodos,
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      completedTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({ allTodos, overdueTodos, dueTodayTodos, dueLaterTodos,completedTodos });
  }
});

app.get("/todos", async (request, response) => {
  console.log("Todo items", response.body);
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
      completed: false,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("we have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  //  completed = todo.completed;
  try {
    const updatedTodo = await todo.setCompletionStatus(todo.completed);
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
    await Todo.remove(request.params.id);
    // response.send(deleted > 0);
    // return response.json(deleted);
    return response.json({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
