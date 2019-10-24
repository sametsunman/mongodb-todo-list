import React, {Component} from 'react';

class TodoDetail extends Component {

    render() {

        const {selectedTodoItem, setValue} = this.props;

        return (
            <div style={{marginTop: 20}}>
                <div className="form-group">
                        <label>Title: </label>
                        <input  type="text"
                                className="form-control"
                                value={selectedTodoItem.title || ""}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setValue("title",e.target.value);
                                }}
                                />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <input  type="text"
                                className="form-control"
                                value={selectedTodoItem.description || ""}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setValue("description",e.target.value);
                                }}
                                />
                    </div>
            </div>
        )
    }
}

export default TodoDetail;