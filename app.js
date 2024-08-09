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



const plantCards = document.getElementById('plant-cards');
const searchInput = document.getElementById('plant-search');
const searchButton = document.getElementById('plant-button');

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
const searchResponse = async () => {
    fetch(`https://perenual.com/api/species-list?key=sk-936h668c7d202f5eb6181&q=${searchInput.value}`, requestOptions)
    .then(response => response.json())
    .then(result => {
        firstResult = result.data[0];
        plantCards.innerHTML += `<div class="card"><h2>${firstResult.common_name}</h2><p>${firstResult.scientific_name}</p><img src="${firstResult.default_image.thumbnail}"></div>`;
        console.log(firstResult);
    })
    .catch(error => {
        console.log('error', error);
        alert('No plants found');
    });
}



searchButton.onclick = searchResponse;
  
  
       



  
  

    // Calendar
    let events = [];
    let currentDate = new Date();
    let selectedEventIndex = null;

    function renderCalendar() {
        let month = currentDate.getMonth();
        let year = currentDate.getFullYear();
        document.getElementById('month-year').innerText = `${monthNames[month]} ${year}`;

        let firstDay = new Date(year, month, 1).getDay();
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let daysElement = document.getElementById('calendar-body');
        daysElement.innerHTML = '';

        for (let i = 0; i < firstDay; i++) {
            let emptyCell = document.createElement('div');
            daysElement.appendChild(emptyCell);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            let dayCell = document.createElement('div');
            dayCell.innerText = i;
            daysElement.appendChild(dayCell);

            events.forEach((event, index) => {
                let eventDate = new Date(event.date);
                if (eventDate.getDate() === i && eventDate.getMonth() === month && eventDate.getFullYear() === year) {
                    let eventElement = document.createElement('div');
                    eventElement.className = 'event';
                    eventElement.innerText = event.title;

                    let buttonsDiv = document.createElement('div');
                    buttonsDiv.className = 'event-buttons';
                    eventElement.appendChild(buttonsDiv);

                    let editButton = document.createElement('button');
                    editButton.className = 'event-button';
                    editButton.innerText = '✎';
                    editButton.onclick = (e) => { e.stopPropagation(); editEvent(index); };
                    buttonsDiv.appendChild(editButton);

                    let deleteButton = document.createElement('button');
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
        let title = document.getElementById('event-title').value;
        let date = document.getElementById('event-date').value;
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
        let event = events[index];
        document.getElementById('edit-event-title').value = event.title;
        document.getElementById('edit-event-date').value = event.date;
        document.getElementById('edit-modal').style.display = 'block';
    }

    function saveEvent() {
        let title = document.getElementById('edit-event-title').value;
        let date = document.getElementById('edit-event-date').value;
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
    let cityInput = document.getElementById('city_input'),
        searchBtn = document.getElementById('searchBtn'),
        api_key = 'a243c44257e0eb271a165113d704a3b3';
    const currentWeatherCard = document.querySelectorAll('.weather-left .card')[0];
    const fiveDaysForecastCard = document.querySelector('.day-forecast');

    function getWeatherDetails(name, lat, lon, country) {
        const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

        fetch(WEATHER_API_URL)
            .then(res => res.json())
            .then(data => {
                let date = new Date();
                currentWeatherCard.innerHTML = `
                    <div class="current-weather">
                        <div class="details">
                            <p>Now</p>
                            <h2>${(data.main.temp - 273.15).toFixed(2)}°C</h2>
                            <p>${data.weather[0].description}</p>
                        </div>
                        <div class="weather-icon">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
                        </div>
                    </div>
                    <hr>
                    <div class="card-footer">
                        <p><i class="fa-light fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
                        <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
                    </div>`;
            })
            .catch(() => {
                alert('Failed to fetch weather data');
            });

        fetch(FORECAST_API_URL)
            .then(res => res.json())
            .then(data => {
                let uniqueForecastDays = [];
                let fiveDaysForecast = data.list.filter(forecast => {
                    let forecastDate = new Date(forecast.dt_txt).getDate();
                    if (!uniqueForecastDays.includes(forecastDate)) {
                        return uniqueForecastDays.push(forecastDate);
                    }
                });

                fiveDaysForecastCard.innerHTML = '';
                for (let i = 1; i < fiveDaysForecast.length; i++) {
                    let date = new Date(fiveDaysForecast[i].dt_txt);
                    fiveDaysForecastCard.innerHTML += `
                        <div class="forecast-item">
                            <div class="icon-wrapper">
                                <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt="" />
                            </div>
                            <span>${(fiveDaysForecast[i].main.temp - 273.15).toFixed(2)}°C</span>
                            <p>${date.getDate()} ${months[date.getMonth()]}</p>
                            <p>${days[date.getDay()]}</p>
                        </div>
                    `;
                }
            })
            .catch(() => {
                alert('Failed to fetch forecast data');
            });
    }

    searchBtn.addEventListener('click', () => {
        let cityName = cityInput.value;
        const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

        fetch(GEOCODING_API_URL)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    let { lat, lon, country } = data[0];
                    getWeatherDetails(cityName, lat, lon, country);
                } else {
                    alert('City not found');
                }
            })
            .catch(() => {
                alert('Failed to fetch geocoding data');
            });
    });
});