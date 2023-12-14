document.addEventListener('DOMContentLoaded', function() {
    const inputTodo = document.querySelector('#todo input');
    const todoList = document.querySelector('.todos');
    const saveButton = document.querySelector('.save');
    const clearButton = document.querySelector('.clear');
    const overlay = document.getElementById('overlay');
    const closeButton = document.querySelector('.closebtn');
    loadSavedTasks();

    inputTodo.addEventListener('keypress', function(event) {
        if (event.key === 'Enter'|| event.key==='"touchstart",') {
            addTodo();
        }
    });
    function addTodo() {
        const todoText = inputTodo.value;
        if (todoText !== '') {
            const newTodoItem = document.createElement('li');
            newTodoItem.innerHTML = `<span><i class="space"></i></span>${todoText}`;
            todoList.appendChild(newTodoItem);
            inputTodo.value = '';
            newTodoItem.addEventListener("dblclick",removeitem)
            newTodoItem.addEventListener("contextmenu",edititem);

        }
    }
    function removeitem(event){
        var item = event.target;
        if( item){
            todoList.removeChild(item);
        }
    }
    function edititem(event){
        event.preventDefault();

        var item = event.target;
        if( item){
            const text= item.textContent;
            const inputField= document.createElement("input");
            inputField.value= text;
            inputField.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    item.textContent = inputField.value;
                    inputField.remove();
                }
            });
            item.innerHTML = ''; 
            item.appendChild(inputField);

            inputField.focus();

        } 
    }
    clearButton.addEventListener('click',()=>{
        while(todoList.firstChild){
            todoList.removeChild(todoList.firstChild);
            saveAll();
        }
    });
    function removeTaskAndData(event) {
        const item = event.target;
        if (item) {
            todoList.removeChild(item);
            removeSavedData(item.textContent.trim()); 
        }
    }

    function removeSavedData(taskText) {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = savedTasks.filter(task => task !== taskText);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  
    todoList.addEventListener('dblclick', removeTaskAndData);
     
     saveButton.addEventListener('click',saveAll);
     function saveAll() {
        const tasks = Array.from(todoList.children).map(todo => todo.textContent.trim());
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadSavedTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const tasksArray = JSON.parse(savedTasks);
            tasksArray.forEach(taskText => {
                const newTodoItem = document.createElement('li');
                newTodoItem.innerHTML = `<span><i class="space"></i></span>${taskText}`;
                todoList.appendChild(newTodoItem);
                newTodoItem.addEventListener("contextmenu", edititem);
            });
        }
    }
})
