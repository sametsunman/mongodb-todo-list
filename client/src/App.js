import React, { Component } from 'react';
import { Container, Card, CardHeader, CardBody, CardFooter, Button, Row, Collapse, Alert } from "shards-react";
import { connect } from "react-redux";
import { addTodo } from "./redux/actions";
import axios from 'axios';
import TodoDetail from "./components/TodoDetail";
import TodosList from "./components/TodosList";
import background from "./assets/background.jpg"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      selectedTodoItem: {},
      visible: false,
      message: '',
      countdown: 0,
      timeUntilDismissed: 5
    };
    this.toggle = this.toggle.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.setValue = this.setValue.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.clearInterval = this.clearInterval.bind(this);

}

showAlert(message) {
this.clearInterval();
this.setState({ message:message, visible: true, countdown: 0, timeUntilDismissed: 2 });
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

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  newItem() {
    this.setState({
      selectedTodoItem: {}
    });
    this.toggle();
  }

  editItem(id) {
    axios.get('/todos/' + id)
      .then(response => {
        const selectedTodoItem = {
          id: id,
          title: response.data.title,
          description: response.data.description,
          completed: response.data.completed
        }

        this.setState({
          selectedTodoItem: selectedTodoItem
        })
      })
      .catch(function (error) {
        console.log(error)
      })

    this.toggle();
  }

  saveItem() {

    const newTodo = {
      title: this.state.selectedTodoItem.title,
      description: this.state.selectedTodoItem.description,
      completed: this.state.selectedTodoItem.completed
    }

    if (this.state.selectedTodoItem.id === undefined) {
      axios.post('/todos/add', newTodo).then(res => console.log(res.data));
      this.props.addTodo(newTodo);
      this.showAlert('New task is added');

    }
    else {
      axios.post('/todos/update/' + this.state.selectedTodoItem.id, newTodo).then(res => console.log(res.data));
      this.showAlert('The task is updated');
    }

    this.setState({
      selectedTodoItem: {}
    });

    this.toggle();
  }

  setValue(name, value) {
    const selectedTodoItem = this.state.selectedTodoItem;

    this.setState({
      selectedTodoItem: {
        ...selectedTodoItem,
        [name]: value
      }
    });

  }

  render() {

    const { selectedTodoItem, collapse,visible,message } = this.state;

    return (
      <Container className="d-flex justify-content-center p-5">
        <Card className="w-50" style={{ backgroundImage: `url(${background})` }}>
          <CardHeader className="text-center py-3"><h3 style={{ color: '#ffffff', textShadow: '0px 0px 12px black' }}>ToDo List App</h3></CardHeader>
          <CardBody className="py-0 px-3">
          <Alert className="mb-2" open={visible} theme="info">
                <i className="material-icons mr-2">info</i>{message}
            </Alert>
            <div className="p-2" style={{ boxShadow: '0px 0px 5px 0px black', background: 'rgba(255, 255, 255, 0.3)' }}>
              <Collapse open={collapse}>
                <TodosList editItem={this.editItem.bind(this)} showAlert={this.showAlert.bind(this)}  />
              </Collapse>
              <Collapse open={!collapse}>
                <TodoDetail selectedTodoItem={selectedTodoItem} setValue={this.setValue.bind(this)} />
              </Collapse>
            </div>
          </CardBody>
          <CardFooter>
            <Row>
              {
                collapse ?
                  <Button pill className="ml-auto mr-3" onClick={() => this.newItem()}><b className="material-icons my-1" style={{ fontSize: "x-large" }}>add</b></Button>:
                  <Row className="ml-auto mr-3">
                  <Button pill className="mr-2" onClick={() => this.newItem()} theme="secondary"><b className="material-icons my-1" style={{ fontSize: "x-large" }}>close</b></Button>
                  <Button pill onClick={() => this.saveItem()}><b className="material-icons my-1" style={{ fontSize: "x-large" }}>save</b></Button>
                  </Row> 
              }
            </Row>
          </CardFooter>
        </Card>
      </Container>

    );
  }
}

export default connect(
  null,
  { addTodo }
)(App);
