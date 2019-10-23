import React, {Component} from 'react';
import { connect } from "react-redux";
import { addTodo } from "../redux/actions";
import axios from 'axios';

class CreateTodo extends Component {

    constructor(props) {
        super(props);

        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            title: '',
            description: '',
            completed: false
        }
    }


    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();

        console.log(`Form submitted:`);
        console.log(`Todo Title: ${this.state.title}`);
        console.log(`Todo Description: ${this.state.description}`);
        console.log(`Todo Completed: ${this.state.completed}`);

        const newTodo = {
            title: this.state.title,
            description: this.state.description,
            completed: this.state.completed
        }

        axios.post('/todos/add', newTodo)
            .then(res => console.log(res.data));

        this.props.addTodo(newTodo);

        this.setState({
            title: '',
            description: '',
            completed: false
        })
    }

    render() {
        return (
            <div style={{marginTop: 20}}>
                <h3>Create New Todo</h3>
                <form onSubmit={this.onSubmit}>
                <div className="form-group">
                        <label>Title: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.title}
                                onChange={this.onChangeTitle}
                                />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.description}
                                onChange={this.onChangeDescription}
                                />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create Todo" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(
    null,
    { addTodo }
  )(CreateTodo);