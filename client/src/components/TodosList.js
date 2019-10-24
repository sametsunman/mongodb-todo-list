import React, { Component } from 'react';
import { connect } from "react-redux";
import { addTodo, toggleTodo } from "../redux/actions";
import { getTodoList} from "../redux/selectors";

import axios from 'axios';

import { Col, Row, FormCheckbox, Button } from "shards-react";

class TodosList extends Component {

    constructor(props) {
        super(props);
        this.interval = null;
        this.state = {
            todos: []
        }
    }

    componentDidMount() {
        axios.get('/todos/')
            .then(response => {
                this.setState({ todos: response.data });
                response.data.map((item) => this.props.addTodo(item));
                
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentDidUpdate() {
        axios.get('/todos/')
            .then(response => {
                this.setState({ todos: response.data });
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    removeItem(id) {
        this.showAlert();
        axios.post('/todos/remove/' + id)
            .then(res => {
                console.log(res.data)
                this.props.showAlert('The task is removed');
            });

    }

    checkItem(id) {
        axios.post('/todos/check/' + id)
            .then(res => {
                //this.props.toggleTodo(id);
                (res.data) ? this.props.showAlert('The task is completed') : this.props.showAlert('The task isn`t completed');
            });

    }


    render() {

        const { todos } = this.state;
        const { editItem } = this.props;

          

        return (
            <div>
                {todos.map((item, i) =>

                    <Row className="m-2 rounded" style={{ boxShadow: '0px 0px 1px 0px black', background: 'rgba(0, 0, 0, 0.4)'}} key={i}>
                        <Col md="2" sm="3">
                            <FormCheckbox className="mt-2" toggle checked={item.completed || false} onChange={(e) => {e.preventDefault(); this.checkItem(item._id)}} />
                        </Col>
                        <Col md="7" sm="5">
                            <Row>
                                <span className="text-white" style={{fontSize:'larger',fontWeight: '400'}}>{item.title}</span>
                            </Row>
                            <Row>
                                <span className="text-white" style={{fontSize:'small'}}>{item.description}</span>
                            </Row>
                        </Col>
                        <Col md="3" sm="4">
                            <Row className="mt-2">
                                <Button theme="warning"  size="sm" className="mr-1" onClick={() => editItem(item._id)}><i className="material-icons">edit</i></Button>
                                <Button theme="danger" size="sm" onClick={() => this.removeItem(item._id)}><i className="material-icons">delete</i></Button>
                            </Row>
                        </Col>
                    </Row>
                )}


            </div>
        )
    }
}


const mapStateToProps = state => {
    const todos = getTodoList(state);
    return { todos };
};

export default connect(mapStateToProps, { addTodo,toggleTodo })(TodosList);