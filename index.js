const API_KEY_OPW = "e609c5aa34dce05160444d30a165ee10";
const API_KEY_OCD = "3456114c599c400fbcbafa7852f29bc4";

function ocd(arg) {
  return fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${arg}&key=${API_KEY_OCD}&pretty=1&limit=1`
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));
}

function opw(arg, id) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${arg[0].lat}&lon=${arg[0].lng}&cnt=7&exclude=minutely,hourly&units=metric&appid=${API_KEY_OPW}`
  )
    .then((response) => response.json())
    .then((data) => {
      let hour = new Date(data.daily[0].dt * 1000)
      console.log(hour)
      for (let i = 0; i < id; i++) {
        getWeather(data.daily[i].weather[0].id, data.daily[i].dt);
      }
      if (hour.getHours() >= 18 || hour.getHours() <= 8) {
        document.querySelector("body").style.backgroundColor = "#1f263b";
        document.querySelectorAll('*').forEach((node) => {
          node.style.color = "#fff"
        })
        document.querySelectorAll('img').forEach(element => {
          element.style.filter = "invert(1)"
        });
      } else {
        document.querySelector("body").style.backgroundColor = "#bcd4e6";
      }
    });
}

function getWeather(id, hours) {
  let path;
  let hour = new Date(hours * 1000);
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
  document.querySelector("#container").innerHTML += `
    <div class="card-day" data-id=${id}>
    <h1>${hour.toLocaleDateString("fr-FR", { weekday: "long" })}</h1>
        <img id="imageURL" class="card-icon" src="${path}" alt="weather image">
    </div>
    `;
}

document.addEventListener("DOMContentLoaded", () => {
  let date = new Date();
  document.getElementById("form-meteo").addEventListener("submit", (event) => {
    event.preventDefault();
    // console.log(date)
    let meteo = [];
    let inputCityName = document.getElementById("city").value.toLowerCase();
    let eltSelect = document.querySelector("select");
    ocd(inputCityName).then((data) => {
      for (let i = 0; i < data.results.length; i++) {
        meteo.push(data.results[0].geometry);
        opw(meteo, eltSelect.selectedIndex);
        if (document.querySelectorAll("img").length > 0) {
          document.querySelector("#container").innerHTML = "";
        }
      }
    });
  });
});
