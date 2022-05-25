import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: '',
    };
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateData', (tasks) => {
      this.setState({ tasks });
    });
    this.socket.on('addTask', (task) => {
      this.addTask(task);
    });
    this.socket.on('removeTask', (id) => {
      this.removeTask(id);
    });
  }

  removeTask(id) {
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id),
    });
    this.socket.emit('removeTask', id);
  }

  addTask(task) {
    this.setState({ tasks: [...this.state.tasks, task] });
  }

  submitForm(e) {
    e.preventDefault();
    const newTask = { id: uuidv4(), name: this.state.taskName };
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
    this.setState({ taskName: '' });
  }

  render() {
    const { tasks, taskName } = this.state;

    return (
      <div className="App">
    
        <header>
          <h1>to-do app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li className="task" key={task.id}>
                {task.name}
                <button onClick={() => this.removeTask(task.id)} className="btn btn--red">Remove</button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form" onSubmit={(e) => this.submitForm(e)}>
            <input 
              onChange={(e) => this.setState({ taskName: e.target.value })} 
              className="text-input" 
              autoComplete="off" 
              type="text" 
              placeholder="Type your task here" 
              id="task-name"
              value={taskName}
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };

};

export default App;