# WeatherForcast_Correction

correction perso et simplifié de l'exercice

# etape 1

pouvoir se connecter à l'api et connecter son input à son js pour récuperer par la suite les noms des villes demanders

### côté HTML

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather ForeCast</title>
</head>
<body>
    <h1>Weather Forecast</h1>
    <form action="" method="get" class="form-meteo" id="form-meteo">
        <label for="name">Enter your city: </label>
        <input type="text" name="city" id="city" required>
        <input type="submit" value="Go!">
    </form>
    <div id="container"></div>
</body>
<script src="./index.js"></script>
</html>
```

### côté JS

```
const API_KEY_OPW = "e609c5aa34dce05160444d30a165ee10";
const API_KEY_OCD = "3456114c599c400fbcbafa7852f29bc4";



document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("form-meteo").addEventListener("submit", (event) => {
    event.preventDefault();
    let inputCityName = document.getElementById("city").value.toLowerCase();
    console.log(inputCityName);
  });
})
```

# etape 2

réussir à récuperer la lat et lng du premier fetch

### côté JS

rajouter cette partie du code :

```
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${inputCityName}&key=${API_KEY_OCD}&pretty=1&no_annotations=1&limit=1`)
    .then((response) => response.json())
    .then((data) => {console.log(data)})
```

faire le chemin jusqu'à lat et lng

# etape 3

réussir à récuperer les bonnes informations via des consoles log et les fetch mise en place

### câté JS

```
const API_KEY_OPW = "e609c5aa34dce05160444d30a165ee10";
const API_KEY_OCD = "3456114c599c400fbcbafa7852f29bc4";


function ocd(arg) {
  return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${arg}&key=${API_KEY_OCD}&pretty=1&no_annotations=1&limit=1`)
  .then((response) => response.json())
  .then((data) => {
    return data;
  })
}

function opw(arg) {
  console.log(arg[0].lat, arg[0].lng);
  return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${arg[0].lat}&lon=${arg[0].lng}&cnt=7&exclude=minutely,hourly&units=metric&appid=${API_KEY_OPW}`)
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("form-meteo").addEventListener("submit", (event) => {
    event.preventDefault();
    let meteo = []
    let inputCityName = document.getElementById("city").value.toLowerCase();
    ocd(inputCityName)
    .then((data) => {
      for(let i = 0; i < data.results.length; i++) {
        meteo.push(data.results[0].geometry);
        opw(meteo)
      }
    })
  })
})
```

# etape 4

ajout de la date

```
function opw(arg) {
  console.log(arg);
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${arg[0].lat}&lon=${arg[0].lng}&cnt=7&exclude=minutely,hourly&units=metric&appid=${API_KEY_OPW}`
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("locationHour").innerText =
        getHour(data.current.dt, data.timezone) + " UTC Time";
      return getWeather(data.current.weather[0].id);
    });
}

function getHour(hours, timezone) {
  // let hour = hours.split(" ")[0];
  let hour = new Date(hours * 1000);
  return hour.toLocaleString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
  });
}
```

# etape 5
