cityInputField = document.getElementById("city-input");
getWeatherBtn = document.getElementById('get-weather');
forecastDaysContainer = document.getElementById('forecast-days');
errorMessageDiv = document.getElementById('error-message');

cityInputField.addEventListener("input", function (e) {
    this.value = this.value.replace(/[^A-Za-z\s]/g, "");
});

myAPIkey = '9112df7df93eeef6138f52c4da4f36d3';

getWeatherBtn.addEventListener('click', () => {

    const city = cityInputField.value;

    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIkey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
            document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`;
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.textContent = 'Error fetching current weather';
        });


    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${myAPIkey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            forecastDaysContainer.innerHTML = '';

            const dailyForecasts = {};

            data.list.forEach((forecast) => {
                const forecastDate = new Date(forecast.dt * 1000); //api date is in seconds, Date obj wait miliseconds
                const date = forecastDate.toLocaleDateString();

                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = {
                        tempSum: 0,
                        humiditySum: 0,
                        windSpeedSum: 0,
                        pressureSum: 0,
                        count: 0,
                    };
                }

                dailyForecasts[date].tempSum += forecast.main.temp;
                dailyForecasts[date].humiditySum += forecast.main.humidity;
                dailyForecasts[date].windSpeedSum += forecast.wind.speed;
                dailyForecasts[date].pressureSum += forecast.main.pressure;
                dailyForecasts[date].count += 1;
            });

            Object.keys(dailyForecasts).forEach((date) => {
                const { tempSum, humiditySum, windSpeedSum, pressureSum, count } = dailyForecasts[date];

                const card = document.createElement('div');
                card.className = 'forecast-card';

                const avgTemp = (tempSum / count).toFixed(2);
                const avgHumidity = (humiditySum / count).toFixed(2);
                const avgWindSpeed = (windSpeedSum / count).toFixed(2);
                const avgPressure = (pressureSum / count).toFixed(2);

                card.innerHTML = `
                    <h4>${date}</h4>
                    <p>Temperature: ${avgTemp} °C</p>
                    <p>Humidity: ${avgHumidity}%</p>
                    <p>Wind Speed: ${avgWindSpeed} m/s</p>
                    <p>Pressure: ${avgPressure} hPa</p>  
                `;

                forecastDaysContainer.appendChild(card);
            });

        })
        .catch(error => {
            console.error('Error fetching forecast data:', error)
            errorMessageDiv.style.display = 'block';
            errorMessageDiv.textContent = 'Error fetching forecast data';
        });

})