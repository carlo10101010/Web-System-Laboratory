const exerciseName = document.getElementById('exercise-name');
const weight = document.getElementById('weight');
const reps = document.getElementById('reps');
const addButton = document.getElementById('add-button');
const ul = document.getElementById('Workoutlist');
const searchBar = document.querySelector('.search-bar');

const editModal = document.getElementById('editWorkoutModal');
const editExerciseName = document.getElementById('edit-exercise-name');
const editWeight = document.getElementById('edit-weight');
const editReps = document.getElementById('edit-reps');
const saveEditButton = document.getElementById('save-edit-button');
let currentWorkoutId = null;

const modal = new bootstrap.Modal(editModal);

window.onload = () => {
    fetch('http://localhost:4000/api/workouts')
        .then(response => response.json())
        .then(data => {
            data.forEach(workout => {
                const li = document.createElement('li');
                li.classList.add('workout-item');
                li.dataset.id = workout._id;
                li.innerHTML = `
                    <div class="workout-details">
                        <p class="exercise-name">${workout.title}</p>
                        <small class="weight-and-reps">Weight: ${workout.load} kg | Reps: ${workout.reps}</small>
                    </div>
                    <div class="workout-buttons">
                        <button class="btn btn-warning btn-sm edit-button">Edit</button>
                        <button class="btn btn-danger btn-sm delete-button">Delete</button>
                    </div>
                    <hr>
                `;
                ul.appendChild(li);
            });
        })
        .catch(error => console.log('Error fetching workouts:', error));
};

addButton.addEventListener('click', () => {
    const newExercise = exerciseName.value.trim();
    const newWeight = weight.value.trim();
    const newReps = reps.value.trim();

    if (newExercise === '' || newWeight === '' || newReps === '') {
        alert('Please enter all fields: exercise name, weight, and reps.');
        return;
    }

    fetch('http://localhost:4000/api/workouts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: newExercise,
            load: newWeight,
            reps: newReps
        }),
    })
    .then(response => response.json())
    .then(data => {
        const li = document.createElement('li');
        li.classList.add('workout-item');
        li.dataset.id = data._id;
        li.innerHTML = `
            <div class="workout-details">
                <p class="exercise-name">${data.title}</p>
                <small class="weight-and-reps">Weight: ${data.load} kg | Reps: ${data.reps}</small>
            </div>
            <div class="workout-buttons">
                <button class="btn btn-warning btn-sm edit-button">Edit</button>
                <button class="btn btn-danger btn-sm delete-button">Delete</button>
            </div>
            <hr>
        `;
        ul.appendChild(li);

        exerciseName.value = '';
        weight.value = '';
        reps.value = '';
    })
    .catch(error => console.log('Error adding workout:', error));
});

ul.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
        const li = e.target.closest('li');
        const workoutId = li.dataset.id;

        if (workoutId) {
            fetch(`http://localhost:4000/api/workouts/${workoutId}`, {
                method: 'DELETE',
            })
            .then(() => {
                li.remove();
            })
            .catch(error => console.log('Error deleting workout:', error));
        } else {
            console.log('No workout ID found for deletion.');
        }
    }

    if (e.target.classList.contains('edit-button')) {
        const li = e.target.closest('li');
        const workoutId = li.dataset.id;

        currentWorkoutId = workoutId;
        const exercise = li.querySelector('.exercise-name').textContent;
        const weight = li.querySelector('.weight-and-reps').textContent.split(' | ')[0].split(': ')[1];
        const reps = li.querySelector('.weight-and-reps').textContent.split(' | ')[1].split(': ')[1];

        editExerciseName.value = exercise;
        editWeight.value = weight;
        editReps.value = reps;

        modal.show();
    }
});

saveEditButton.addEventListener('click', () => {
    const updatedExercise = editExerciseName.value.trim();
    const updatedWeight = editWeight.value.trim();
    const updatedReps = editReps.value.trim();

    if (updatedExercise === '' || updatedWeight === '' || updatedReps === '') {
        alert('Please enter all fields: exercise name, weight, and reps.');
        return;
    }

    fetch(`http://localhost:4000/api/workouts/${currentWorkoutId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: updatedExercise,
            load: updatedWeight,
            reps: updatedReps
        }),
    })
    .then(response => response.json())
    .then(data => {
        const li = ul.querySelector(`li[data-id="${currentWorkoutId}"]`);
        li.querySelector('.exercise-name').textContent = data.title;
        li.querySelector('.weight-and-reps').textContent = `Weight: ${data.load} kg | Reps: ${data.reps}`;

        modal.hide();
    })
    .catch(error => console.log('Error updating workout:', error));
});

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const workoutItems = ul.querySelectorAll('li');
    workoutItems.forEach(item => {
        const exerciseName = item.querySelector('.exercise-name').textContent.toLowerCase();
        if (exerciseName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});
