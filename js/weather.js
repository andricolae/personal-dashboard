cityInputField = document.getElementById("city-input");
getWeatherBtn = document.getElementById('get-weather');

cityInputField.addEventListener("input", function (e) {
    this.value = this.value.replace(/[^A-Za-z\s]/g, "");
});

myAPIkey = '9112df7df93eeef6138f52c4da4f36d3';

getWeatherBtn.addEventListener('click', () => {

    const city = cityInputField.value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${myAPIkey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').textContent = `Temperature: ${data.main.temp} °C`;
            document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
            document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
            document.getElementById('pressure').textContent = `Pressure: ${data.main.pressure} hPa`; 
        })
        .catch(error => console.error('Error fetching current weather:', error));
})