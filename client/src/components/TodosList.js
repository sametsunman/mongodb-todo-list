import React, {Component} from 'react';
import { connect } from "react-redux";
import { addTodo } from "../redux/actions";
import { getTodosByVisibilityFilter } from "../redux/selectors";

import { Link } from 'react-router-dom';
import axios from 'axios';

const Todo = props => (
    <tr>
        <td className={props.todo.completed ? 'completed' : ''}>{props.todo.title}</td>
        <td className={props.todo.completed ? 'completed' : ''}>{props.todo.description}</td>
        <td>
            <Link to={"/edit/"+props.todo._id}>Edit</Link>
            <Link to={"/remove/"+props.todo._id}>Delete</Link>
        </td>
    </tr>
)

class TodosList extends Component {

    constructor(props) {
        super(props);
        this.state = {todos: []};
    }

    componentDidMount() {
        axios.get('/todos/')
            .then(response => {
                this.setState({todos: response.data});
                this.props.addTodo(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentDidUpdate() {
        axios.get('/todos/')
        .then(response => {
            this.setState({todos: response.data});
            this.props.addTodo(response.data);
        })
        .catch(function (error) {
            console.log(error);
        })   
    }

    todoList() {
        return this.state.todos.map(function(currentTodo, i) {
            return <Todo todo={currentTodo} key={i} />;
        });
    }

    render() {
        return (
            <div>
                <h3>Todos List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.todoList() }
                    </tbody>
                </table>
            </div>
        )
    }
}


const mapStateToProps = state => {
    const { visibilityFilter } = state;
    const todos = getTodosByVisibilityFilter(state, visibilityFilter);
    return { todos };
};

export default connect(mapStateToProps,{ addTodo })(TodosList);