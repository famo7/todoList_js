import { Todo } from './todo';
import { project } from './Project';

let allProjects = [];

function init() {
  const allProjectsJson = localStorage.getItem('projects');
  if (allProjectsJson) {
    allProjects = JSON.parse(allProjectsJson);
    populateProjects();
  } else {
    createNewProject('Default');
  }
}
window.onload = init;

const projectMenu = document.querySelector('.projectMenu');
const todoMenu = document.querySelector('#todoList ul');
const projectNameInput = document.querySelector('#projectName');
const todoDueDate = document.querySelector('#todoDueDate');
const title = document.querySelector('#title');
const description = document.querySelector('#description');
const priority = document.querySelector('.select1');
const editTodoDueDate = document.querySelector('#editTodoDueDate');
const editTitle = document.querySelector('#editTitle');
const editDescription = document.querySelector('#editDescription');
const editPriority = document.querySelector('.select2');
let currentProject = 'Default';

const projectExists = (name) => {
  if (allProjects.find((e) => e.name === name)) {
    return true;
  }
  return false;
};

const createNewProject = (name) => {
  if (!projectExists(name)) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.text = name;
    li.append(a);
    li.setAttribute('data-obj', JSON.stringify(name));

    projectMenu.prepend(li);
    allProjects.push(new project(name));
    localStorage.setItem('projects', JSON.stringify(allProjects));
  } else {
    alert('Name Cannot be empty or  exist already!');
  }
};

const createNewTodo = (title, description, dueDate, priority) => {
  allProjects.forEach((proj) => {
    if (proj.name === currentProject) {
      proj.addTodo(new Todo(title, description, dueDate, priority));
      localStorage.setItem('projects', JSON.stringify(allProjects));
    }
  });
};

document.querySelector('#addProject').addEventListener('click', (e) => {
  createNewProject(projectNameInput.value);
});

document.querySelector('#addTodo').addEventListener('click', (e) => {
  createNewTodo(
    title.value,
    description.value,
    todoDueDate.value,
    priority.value
  );
});

const initProjects = () => {
  projectMenu.addEventListener('click', (e) => {
    todoMenu.innerHTML = '';
    currentProject = e.target.textContent;

    let currentTodos = getCurrentTodos();

    populateTodos(currentTodos);
  });
};
const populateProjects = () => {
  allProjects.forEach((i) => {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.text = i.name;
    li.append(a);
    li.setAttribute('data-proj', JSON.stringify(i.name));
    projectMenu.prepend(li);
  });
};
initProjects();
const getCurrentTodos = () => {
  allProjects.forEach((proj) => {
    if (proj.name === currentProject) {
      populateTodos(proj.todos);
      return proj.todos;
    }
  });
  return null;
};

const populateTodos = (todos) => {
  if (todos) {
    todos.forEach((todo) => {
      let li = document.createElement('li');
      let span = document.createElement('span');
      let deletButton = document.createElement('button');
      let editButton = document.createElement('a');
      span.textContent = `${todo.title}(duedate: ${todo.dueDate})`;
      editButton.textContent = 'edit';
      editButton.href = '#my-modal-3';
      editButton.classList.add(
        'ml-3',
        'btn',
        'btn-primary',
        'btn-ghost',
        'btn-xs'
      );
      deletButton.textContent = 'delete';
      deletButton.classList.add(
        'ml-10',
        'btn',
        'btn-error',
        'btn-outline',
        'btn-xs'
      );

      li.setAttribute('data-obj', JSON.stringify(todo));
      li.append(span);
      li.append(deletButton);
      li.append(editButton);

      todoMenu.append(li);
    });
  }
};

todoMenu.addEventListener('click', (e) => {
  let todo = JSON.parse(e.target.parentNode.getAttribute('data-obj'));
  console.log(todo);
  if (e.target.textContent === 'delete') {
    allProjects.forEach((proj) => {
      if (proj.name === currentProject) {
        proj.todos = proj.todos.filter((t) => t.title !== todo.title);
        localStorage.setItem('projects', JSON.stringify(allProjects));

        todoMenu.innerHTML = '';
        populateTodos(proj.todos);
      }
    });
  } else if (e.target.textContent === 'edit') {
    document.querySelector('#editTodo').addEventListener('click', (e) => {
      allProjects.forEach((proj) => {
        if (proj.name === currentProject) {
          proj.todos.forEach((i) => {
            if (i.title === todo.title) {
              i.title = editTitle.value;
              i.description = editDescription.value;
              i.dueDate = editTodoDueDate.value;
              i.priority = editPriority.value;
              localStorage.setItem('projects', JSON.stringify(allProjects));
            }
          });
          todoMenu.innerHTML = '';
          populateTodos(proj.todos);
        }
      });
    });
  }
});
