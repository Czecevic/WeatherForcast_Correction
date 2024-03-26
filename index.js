// API Keys
const API_KEY_OPW = "e609c5aa34dce05160444d30a165ee10";
const API_KEY_OCD = "93d0797359da49bf830dc5d10f58197b";

// declaration
const city = document.querySelector("#form-meteo");
const nameOfCity = document.querySelector("#city");
const eltSelect = document.querySelector("select");

// call API
const openCageData = async (city) => {
  const reponse = await fetch(`
    https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${API_KEY_OCD}
    `);
  const data = await reponse.json();
  return data;
};

const openWeatherMap = async (position) => {
  const reponse = await fetch(`
    https://api.openweathermap.org/data/2.5/forecast?lat=${position.lat}&lon=${position.lng}&appid=${API_KEY_OPW}
    `);
  const data = await reponse.json();
  return data;
};

// temps - meteo
const getWeather = (id, hours) => {
  let path;
  let day = new Date(hours * 1000);
  if (id === 800) {
    path = "../assets/sun.svg";
  } else if (id === 801 || id === 802) {
    path = "../assets/cloudy.svg";
  } else if (id === 803 || id === 804) {
    path = "../assets/clouds.svg";
  } else if (id > 600 && id < 622) {
    path = "../assets/snow.svg";
  } else {
    path = "../assets/rain.svg";
  }
  document.querySelector("#container").innerHTML += `
    <div class="card-day">
        <h1> ${day.toLocaleDateString("fr-FR", { weekday: "long" })}</h1>
        <img class="card-icon" src="${path}" alt="weather icon">
    </div>
  `;
};

// temps - heure
const time = (timeNow, timeset, timesun) => {
  if (timeNow >= timeset || timeNow <= timesun) {
    document.querySelector("body").style.backgroundColor = "#07406b";
    document.querySelectorAll("*").forEach((node) => {
      node.style.color = "#fff";
    });
    document.querySelectorAll("img").forEach((img) => {
      img.style.filter = "invert(1)";
    });
  } else {
    document.querySelectorAll("*").forEach((node) => {
      node.style.color = "#000";
    });
    document.querySelector("body").style.backgroundColor = "#bcd4e6";
  }
};

// evenement
city.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cityName = nameOfCity.value;
  let count = 0;
  openCageData(cityName)
    .then((data) => {
      return data.results[0].geometry;
    })
    .then((meteo) => {
      return openWeatherMap(meteo);
    })
    .then((data) => {
      if (document.querySelectorAll("img").length > 0) {
        document.querySelector("#container").innerHTML = "";
      }
      let hour = data.list[0].dt_txt.split(" ")[1];
      data.list.forEach((element) => {
        if (
          element.dt_txt.split(hour).length > 1 &&
          count < eltSelect.selectedIndex
        ) {
          let idOfMeteo = element.weather[0].id;
          count++;
          getWeather(idOfMeteo, element.dt);
        }
      });
      let localTime = Math.floor(
        (Date.now() + data.city.timezone * 1000) / 1000
      );
      let timeDec = new Date(localTime * 1000).getHours() - 2;
      let sunsetDec = new Date(data.city.sunset * 1000).getHours();
      let sunriseDec = new Date(data.city.sunrise * 1000).getHours();
      time(timeDec, sunsetDec, sunriseDec);
    });
});
