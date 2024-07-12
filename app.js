// app.js

document.addEventListener('DOMContentLoaded', () => {
    const gridSizeInput = document.getElementById('grid-size');
    const gridContainer = document.getElementById('grid-container');

    gridSizeInput.addEventListener('change', createGrid);

    async function createGrid() {
        const size = gridSizeInput.value.split('x').map(Number);
        const [rows, cols] = size;
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        for (let i = 0; i < rows * cols; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.draggable = true;
            cell.addEventListener('dragover', e => e.preventDefault());
            cell.addEventListener('drop', handleDrop);
            gridContainer.appendChild(cell);
        }
    }

    function handleDrop(event) {
        const { target } = event;
        const draggableElement = event.dataTransfer.getData('text/plain');
        target.appendChild(document.getElementById(draggableElement));
    }

    const plantSearch = document.getElementById('plant-search');
    const plantList = document.getElementById('plant-list');

    plantSearch.addEventListener('input', searchPlants);

    async function searchPlants() {
        const query = plantSearch.value;
        const response = await fetch(`https://api.usdaplants.scott/v1/plants?key=sk-936h668c7d202f5eb6181&query=${query}`);
        const data = await response.json();
        plantList.innerHTML = data.map(plant => `<li draggable="true" ondragstart="drag(event)" id="${plant.commonName}">${plant.commonName}</li>`).join('');
    }

    function drag(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
    }
});

// Link to the index.html file
index.html

