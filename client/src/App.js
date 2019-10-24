import React, { Component } from 'react';
import { Container, Card, CardHeader, CardBody, CardFooter, Button, Row, Collapse } from "shards-react";
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
      selectedTodoItem: {}
    };
    this.toggle = this.toggle.bind(this);
    this.saveItem = this.saveItem.bind(this);
    this.setValue = this.setValue.bind(this);
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

    console.log(`Todo Title: ${this.state.selectedTodoItem.title}`);
    console.log(`Todo Description: ${this.state.selectedTodoItem.description}`);
    console.log(`Todo Completed: ${this.state.selectedTodoItem.completed}`);

    const newTodo = {
      title: this.state.selectedTodoItem.title,
      description: this.state.selectedTodoItem.description,
      completed: this.state.selectedTodoItem.completed
    }

    if (this.state.selectedTodoItem.id === undefined) {
      axios.post('/todos/add', newTodo).then(res => console.log(res.data));
      this.props.addTodo(newTodo);

    }
    else {
      axios.post('/todos/update/' + this.state.selectedTodoItem.id, newTodo).then(res => console.log(res.data));
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

    const { selectedTodoItem, collapse } = this.state;

    return (
      <Container className="d-flex justify-content-center p-5">
        <Card className="w-50" style={{ backgroundImage: `url(${background})` }}>
          <CardHeader className="text-center py-3"><h3 style={{ color: '#ffffff', textShadow: '0px 0px 12px black' }}>ToDo List App</h3></CardHeader>
          <CardBody className="py-0 px-3">
            <div className="p-2" style={{ boxShadow: '0px 0px 5px 0px black', background: 'rgba(255, 255, 255, 0.3)' }}>
              <Collapse open={collapse}>
                <TodosList editItem={this.editItem.bind(this)} />
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
