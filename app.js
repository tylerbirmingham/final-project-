document.addEventListener('DOMContentLoaded', () => {
   
    // Grid Creator
    const gridSizeInput = document.getElementById('grid-size');
    const gridContainer = document.getElementById('grid-container');

    gridSizeInput.addEventListener('change', createGrid);

    function createGrid() {
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
        const draggableElementId = event.dataTransfer.getData('text/plain');
        const draggableElement = document.getElementById(draggableElementId);
        event.target.appendChild(draggableElement);
    }

    // Plant Search
    const plantSearch = document.getElementById('plant-search');
    const plantList = document.getElementById('plant-list');

    plantSearch.addEventListener('input', searchPlants);

    async function searchPlants() {
        const searchTerm = plantSearch.value;
        const url = `https://perenual.com/api/species-list?key=sk-936h668c7d202f5eb6181&search=${searchTerm}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            plantList.innerHTML = '';
            data.results.forEach(plant => {
                const listItem = document.createElement('li');
                listItem.textContent = plant.common_name;
                plantList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching plant data:', error);
        }
    }

    // Calendar
    let events = [];
    let currentDate = new Date();
    let selectedEventIndex = null;

    function renderCalendar() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        document.getElementById('month-year').innerText = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysElement = document.getElementById('calendar-body');
        daysElement.innerHTML = '';

        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            daysElement.appendChild(emptyCell);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.innerText = i;
            daysElement.appendChild(dayCell);

            events.forEach((event, index) => {
                const eventDate = new Date(event.date);
                if (eventDate.getDate() === i && eventDate.getMonth() === month && eventDate.getFullYear() === year) {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'event';
                    eventElement.innerText = event.title;

                    const buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'event-buttons';
                    eventElement.appendChild(buttonsDiv);

                    const editButton = document.createElement('button');
                    editButton.className = 'event-button';
                    editButton.innerText = '✎';
                    editButton.onclick = (e) => { e.stopPropagation(); editEvent(index); };
                    buttonsDiv.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'event-button';
                    deleteButton.innerText = '✖';
                    deleteButton.onclick = (e) => { e.stopPropagation(); deleteEvent(index); };
                    buttonsDiv.appendChild(deleteButton);

                    dayCell.appendChild(eventElement);
                }
            });
        }
    }

    function prevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    }

    function nextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    }

    function addEvent() {
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        if (title && date) {
            events.push({ title, date });
            renderCalendar();
            document.getElementById('event-title').value = '';
            document.getElementById('event-date').value = '';
        } else {
            alert('Please enter event title and date');
        }
    }

    function editEvent(index) {
        selectedEventIndex = index;
        const event = events[index];
        document.getElementById('edit-event-title').value = event.title;
        document.getElementById('edit-event-date').value = event.date;
        document.getElementById('edit-modal').style.display = 'block';
    }

    function saveEvent() {
        const title = document.getElementById('edit-event-title').value;
        const date = document.getElementById('edit-event-date').value;
        if (title && date) {
            events[selectedEventIndex] = { title, date };
            renderCalendar();
            closeModal();
        } else {
            alert('Please enter event title and date');
        }
    }

    function deleteEvent(index) {
        if (confirm('Are you sure you want to delete this event?')) {
            events.splice(index, 1);
            renderCalendar();
        }
    }

    function closeModal() {
        document.getElementById('edit-modal').style.display = 'none';
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    window.onload = renderCalendar;

    // Weather
    const validateZipCode = (zipCode) => {
        const zipCodeRegex = /^(\d{5}(-\d{4})?|\w+, \w+)$/;
        if (!zipCodeRegex.test(zipCode)) {
            alert("Invalid input. Please input a valid zipcode OR city, state");
            return false;
        }
        return true;
    };

    const weatherInfoBox = document.getElementById("weather-info");
    const zipcodeBox = document.getElementById('destination');
    const WeatherAPIKey = "4e0bb2c968d14bfebc164304240908";

    const getWeatherInfo = async () => {
        const zipCode = zipcodeBox.value;
        if (!validateZipCode(zipCode)) {
            return;
        }
        const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${WeatherAPIKey}&q=${zipCode}&days=7`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            weatherInfoBox.innerHTML = `<h2>${data.location.name}, ${data.location.region}</h2> Forecast for ${data.forecast.forecastday[0].date} through ${data.forecast.forecastday[6].date}`;
            data.forecast.forecastday.forEach(day => {
                const date = new Date(day.date);
                const weekday = date.toLocaleString('en-US', { weekday: 'short' });
                weatherInfoBox.innerHTML += `<p>${weekday}: ${day.day.condition.text} with a high of ${day.day.maxtemp_f}°F and a low of ${day.day.mintemp_f}°F.</p>`;

                const icon = document.createElement("img");
                icon.src = `https:${day.day.condition.icon}`;
                icon.classList.add("weather-icon");
                weatherInfoBox.appendChild(icon);
            });

            const resetButton = document.createElement("button");
            resetButton.textContent = "Reset";
            resetButton.addEventListener("click", () => {
                weatherInfoBox.innerHTML = "";
                zipcodeBox.value = "";
            });
            weatherInfoBox.appendChild(resetButton);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    document.getElementById('get-weather').addEventListener('click', getWeatherInfo);
});
