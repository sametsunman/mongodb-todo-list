const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();

let Todo = require('./model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://dbadmin:qwe123@asnus-sql-5enaw.mongodb.net/todolist', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connected successfully");
})

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'ToDo added successfully'});
        })
        .catch(err => {
            res.status(400).send('Adding new ToDo failed');
        });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send('Data is not found');
        else
            todo.title = req.body.title;
            todo.description = req.body.description;
            todo.completed = req.body.completed;

            todo.save().then(todo => {
                res.json('ToDo updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/check/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send('Data is not found');
        else
            todo.completed = !todo.completed;

            todo.save().then(todo => {
                res.json('ToDo updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/remove/:id').post(function(req, res) {
    Todo.findByIdAndDelete(req.params.id, function(err) {
        if (!err)
                res.json('ToDo removed');
        else
            res.status(400).send("Removing not possible");
    });
});


app.use('/todos', todoRoutes);


if(process.env.NODE_ENV === "production"){
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    })
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
