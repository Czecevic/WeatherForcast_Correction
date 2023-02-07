const API_KEY_OPW = "e609c5aa34dce05160444d30a165ee10";
const API_KEY_OCD = "3456114c599c400fbcbafa7852f29bc4";

function ocd(arg) {
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${arg}&key=${API_KEY_OCD}&pretty=1&no_annotations=1&limit=1`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
}

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

function getWeather(id) {
  let path;
  if (id === 800) {
    path = "./assets/sun.svg";
  } else if (id >= 600 && 622 >= id) {
    path = "./assets/snow.svg";
  } else if (id >= 801 && 804 >= id) {
    if (id === 801 || id === 802) {
      path = "./assets/cloudy.svg";
    }
    if (id === 803 || id === 804) {
      path = "./assets/clouds.svg";
    }
  } else {
    path = "./assets/rain.svg";
  }
  document.querySelector("#container").innerHTML = `
    <div class="card-day" data-id=${id}>
        <img id="imageURL" class="card-icon" src="${path}" alt="weather image">
    </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("form-meteo").addEventListener("submit", (event) => {
    event.preventDefault();
    let meteo = [];
    let inputCityName = document.getElementById("city").value.toLowerCase();
    ocd(inputCityName).then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        meteo.push(data.results[0].geometry);
        opw(meteo);
      }
    });
  });
});
