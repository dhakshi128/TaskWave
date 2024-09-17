document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const celebration = document.getElementById('celebration');
    const progressBar = document.getElementById('progress-bar');
    
    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
    
    // Validate task using regular expression
    function validateTask(text) {
        const regex = /^[\w\s]+$/; // Allows alphanumeric characters and spaces
        return regex.test(text);
    }
    
    // Handle form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Task cannot be empty!');
        } else if (!validateTask(taskText)) {
            alert('Invalid task. Please use only alphanumeric characters and spaces.');
        } else {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    // Function to add a task
    function addTask(text) {
        const task = { text, completed: false };
        tasks.push(task);
        saveTasks();
        renderTasks();
    }

    // Function to save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to render tasks on the page
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            if (task.completed) {
                taskText.classList.add('completed');
            }
            
            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Undo' : 'Complete';
            completeButton.addEventListener('click', () => toggleComplete(index));
            
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editTask(index));
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(index));
            
            taskItem.appendChild(taskText);
            taskItem.appendChild(completeButton);
            taskItem.appendChild(editButton);
            taskItem.appendChild(deleteButton);
            taskList.appendChild(taskItem);
        });
        
        // Check if all tasks are completed
        if (tasks.every(task => task.completed)) {
            celebration.classList.remove('hidden');
        } else {
            celebration.classList.add('hidden');
        }
        
        // Update progress bar
        updateProgressBar();
    }

    // Function to update the progress bar
    function updateProgressBar() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const progress = (totalTasks === 0) ? 0 : (completedTasks / totalTasks) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}% Completed`;
    }

    // Function to toggle task completion
    function toggleComplete(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    // Function to edit a task
    function editTask(index) {
        const newText = prompt('Edit task:', tasks[index].text);
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
        }
    }

    // Function to delete a task
    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
});
