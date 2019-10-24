import React, { Component } from 'react';
import { connect } from "react-redux";
import { addTodo } from "../redux/actions";
import { getTodosByVisibilityFilter } from "../redux/selectors";

import axios from 'axios';

import { Alert, Col, Row, FormCheckbox, Button } from "shards-react";

class TodosList extends Component {

    constructor(props) {
        super(props);
        this.interval = null;
        this.state = {
            todos: [],
            visible: false,
            countdown: 0,
            timeUntilDismissed: 5
        };

        this.showAlert = this.showAlert.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.clearInterval = this.clearInterval.bind(this);
    }

    showAlert() {
        this.clearInterval();
        this.setState({ visible: true, countdown: 0, timeUntilDismissed: 2 });
        this.interval = setInterval(this.handleTimeChange, 1000);
    }

    handleTimeChange() {
        if (this.state.countdown < this.state.timeUntilDismissed - 1) {
            this.setState({
                ...this.state,
                ...{ countdown: this.state.countdown + 1 }
            });
            return;
        }

        this.setState({ ...this.state, ...{ visible: false } });
        this.clearInterval();
    }

    clearInterval() {
        clearInterval(this.interval);
        this.interval = null;
    }

    componentDidMount() {
        axios.get('/todos/')
            .then(response => {
                this.setState({ todos: response.data });
                this.props.addTodo(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    componentDidUpdate() {
        axios.get('/todos/')
            .then(response => {
                this.setState({ todos: response.data });
                this.props.addTodo(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    removeItem(id) {
        this.showAlert();
        axios.post('/todos/remove/' + id)
            .then(res => console.log(res.data));

    }

    checkItem(id) {
        console.log(id);
        axios.post('/todos/check/' + id)
            .then(res => console.log(res.data));

    }


    render() {

        const { todos } = this.state;
        const { editItem } = this.props;

          

        return (
            <div>
                <Alert className="mb-2" open={this.state.visible} theme="danger">
                    Item has removed successfully
        </Alert>



                {todos.map((item, i) =>

                    <Row className="m-2 rounded" style={{ boxShadow: '0px 0px 1px 0px black', background: 'rgba(0, 0, 0, 0.4)'}} key={i}>
                        <Col md="2" sm="3">
                            <FormCheckbox className="mt-2" toggle value={item.completed || false} checked={item.completed || false} onClick={(e) => {e.preventDefault(); this.checkItem(item._id)}} />
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
    const { visibilityFilter } = state;
    const todos = getTodosByVisibilityFilter(state, visibilityFilter);
    return { todos };
};

export default connect(mapStateToProps, { addTodo })(TodosList);