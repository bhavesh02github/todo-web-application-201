const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const bodypaser = require("body-parser");
var cookieParser = require("cookie-parser");

const path = require("path");
app.set("views", path.join(__dirname, "views"));

const passport = require('passport'); //9.4k (gzipped: 2.9k)
const connectEnsureLogin = require('connect-ensure-login'); //811 (gzipped: 368)
const session = require('express-session'); //21.3k (gzipped: 7.2k)
const LocalStrategy = require('passport-local'); //1.5k (gzipped: 719)
const bcrypt = require('bcrypt');
const saltRounds = 10;


const flash = require("connect-flash");

app.use(bodypaser.json());
app.use(express.urlencoded({ extented: false }));
app.use(cookieParser("shh! secret string"));
app.use(csrf("123456789iamasecret987654321look", ["POST", "PUT", "DELETE"]));
app.use(flash({}));


app.use(session({
  secret: "my-super-secret-key-213158451656811651",
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 //24hrs
  }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(function(request, response, next) {
  response.locals.messages = request.flash();
  next();
});

// app.use(flash());
// res.render(req.flash(type, message));

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (username, password, done) => {
  User.findOne({ where: { email: username }})
   .then(async function (user) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return done(null, user);
    }
    else {
      return done(null, false, { message: "Invalid Password" });
    }
   })
   .catch((error) => {
     return done(null, false, { message: "Invalid E-mail" });
   });
}));

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(error => {
      done(error, null);
    })
});

module.exports = {
  "**/*.js": ["eslint --fix", "prettier --write"],
};
//set EJS as view engine

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


const { Todo, User } = require("./models");

app.get("/", async (request, response) => {
  // console.log(request.user) 
  response.render("index", {
    title: "Todo apllication",
    csrfToken: request.csrfToken(),
  });
});


app.get("/todos", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  // console.log(request.user)\
  const loggedInUser = request.user.id;
  const allTodos = await Todo.getTodos(loggedInUser);
  const overdueTodos = await Todo.getoverdueTodos(loggedInUser);
  const dueTodayTodos = await Todo.getdueTodayTodos(loggedInUser);
  const dueLaterTodos = await Todo.getdueLaterTodos(loggedInUser);
  const CompletedTodos = await Todo.getCompleted(loggedInUser);

  if (request.accepts("html")) {
    response.render("todos", {
      title: "Todo application",
      allTodos,
      overdueTodos,
      dueTodayTodos,
      dueLaterTodos,
      CompletedTodos,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos, 
      overdueTodos, 
      dueTodayTodos, 
      dueLaterTodos, 
      CompletedTodos
    });
  }
});

app.get("/signup", (request, response) => {
  response.render("signup", { title: "Signup", csrfToken: request.csrfToken(), 
  })
})

app.post("/users", async (request, response) => {
  // Hash password using bcrypt
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds)
  console.log(hashedPwd)
  //console.log("Firstname", request.body.firstName);
  try { 
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd
    });
    request.login(user, (err) => {
      if(err) {
        console.log(err)
      }
      response.redirect("/todos");
    })
  } catch (error) {
    console.log(error);
  }
})

app.get("/login", (request, response) => {
  response.render("login", { title: "Login", csrfToken: request.csrfToken()});
})

app.post("/session", passport.authenticate('local', { failureRedirect: "/login" }),(request, response) => {
  console.log(request.user);
  response.redirect("/todos");
})

app.get("/signout",(request,response, next)=>{
  request.logout((err)=>{ 
    if (err){ return next(err);}
    response.redirect("/");
  });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (request, response) {
    console.log(request.user);
    response.redirect("/todos");
  }
);



// app.get("/todos", async (request, response) => {
//   console.log("Todo items", response.body);
//   try {
//     const todo = await Todo.findAll();
//     return response.send(todo);
//     // return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });

app.post("/todos", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  console.log("creating a todo", request.body);
  console.log(request.user);
  try {
    await Todo.addTodo({
      title: request.body.title,
      duedate: request.body.dueDate,
      userId: request.user.id

    });
    return response.redirect("/todos");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  console.log("we have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
// eslint-disable-line no-unused-vars
app.delete("/todos/:id",connectEnsureLogin.ensureLoggedIn(), async (request, response) => {
  console.log("Delete a todo by ID: ", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  }
  catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;
