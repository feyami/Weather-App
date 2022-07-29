
class Variables {
  constructor() {
    this.default_TypeOfUnit = "metric";
    this.default_TypeOfPicture = "all";
    this.unit_Type = {
      metric: {
        value: "metric",
        temperature: "°C",
        humidity: "%",
        speed: " km/h",
        convertSpeed: 3.6
      },
      imperial: {
        value: "imperial",
        temperature: "°F",
        humidity: "%",
        speed: " mph",
        convertSpeed: 1
      }
    },
      this.picture_Type = {
        All: "all",
        Photo: "photo",
        Illustration: "illustration",
        Vector: "vector"
      }

  }

  setDefaultUnit(unitTypeValue) {
    this.default_TypeOfUnit = unitTypeValue;
  }
  setDefaultTypeOfPicture(pictureType) {
    this.default_TypeOfPicture = pictureType;
  }
}

class Connections {

  constructor() {
    this.variables = new Variables;
    this.openWeatherMap = {
      apiKey: "&appid=87623f5baaff84afe63d62a2ed8751b0",
      url: "https://api.openweathermap.org/data/2.5/weather?q=",
      unit: {
        metric: `&units=${this.variables.unit_Type.metric.value}`,
        imperial: `&units=${this.variables.unit_Type.imperial.value}`
      },

    },
      this.pixabay = {
        apiKey: "&key=28892770-92dc25cc82e65b8c01eed5871",
        url: "https://pixabay.com/api/?q=",
        type: {
          all: `&image_type=${this.variables.picture_Type.All}`,
          photo: `&image_type=${this.variables.picture_Type.Photo}`,
          illustration: `&image_type=${this.variables.picture_Type.Illustration}`,
          vector: `&image_type=${this.variables.picture_Type.Vector}`
        }

      }

  }

  getWeatherUrl(city, unitTypeValue) {
    let url = this.openWeatherMap.url + city + this.openWeatherMap.apiKey + this.openWeatherMap.unit[`${unitTypeValue}`];
    this.variables.setDefaultUnit(unitTypeValue);
    return url;
  }


  getTypeOfPictureUrl(description, typeOfPicture) {
    let url = this.pixabay.url + description + this.pixabay.apiKey + this.pixabay.type[`${typeOfPicture}`];
    this.variables.setDefaultTypeOfPicture(typeOfPicture);
    return url;
  }

}

class UI {
  constructor() {
    this.connections = new Connections;
    this.variables = new Variables;

  }
  
  fetchWeather(city="ankara") {
    fetch(this.connections.getWeatherUrl(city, this.variables.default_TypeOfUnit))
      .then((response) => {
        if (!response.ok) {
          //hata kodu yakalanacak....
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => this.displayWeather(data));
  }
  displayWeather(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src =
      "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    console.log(this.variables.unit_Type[`${this.variables.default_TypeOfUnit}`]["temperature"])
    document.querySelector(".temp").innerText = Math.floor(temp) + this.variables.unit_Type[`${this.variables.default_TypeOfUnit}`]["temperature"];
    document.querySelector(".humidity").innerText =
      "Humidity: " + humidity + this.variables.unit_Type[`${this.variables.default_TypeOfUnit}`].humidity;

    document.querySelector(".wind").innerText =
      "Wind speed: " + speed * this.variables.unit_Type[`${this.variables.default_TypeOfUnit}`].convertSpeed + this.variables.unit_Type[`${this.variables.default_TypeOfUnit}`].speed;;
    document.querySelector(".weather").classList.remove("loading");


    this.fetchPicture(description);

  }

  fetchPicture(description) {
    console.log(this.variables.default_TypeOfPicture)
    fetch(this.connections.getTypeOfPictureUrl(description, this.variables.default_TypeOfPicture))
      .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })

      .then(data => {

        this.loadImages(data);
      })

      .catch(error => console.log(error));
  }

  loadImages(data) {
    let section = document.querySelector("section");
    section.style.backgroundImage = `url(${data.hits[Math.floor(Math.random() * data.hits.length)].largeImageURL})`;
  }

};



const ui = new UI();

document.querySelector("#input").addEventListener("keydown", (event) => {
  if (event.key == "Enter")
    ui.fetchWeather(document.querySelector("#input").value);
});

document.querySelector("#search").addEventListener("click", () => {
  ui.fetchWeather(document.querySelector("#input").value);
});

function checkButton() {
  const radioButtonsMetric = document.querySelectorAll('input[name="unit"]');
  const radioButtonsPicture = document.querySelectorAll('input[name="picture"]');

  for (const radioButton of radioButtonsMetric) {
    if (radioButton.checked) {
      console.log(radioButton.value);
      ui.variables.setDefaultUnit(radioButton.value);
      break;
    }
  }
  for (const radioButton of radioButtonsPicture) {
    if (radioButton.checked) {
      console.log(radioButton.value);
      ui.variables.setDefaultTypeOfPicture(radioButton.value);
      break;
    }
  }
  ui.fetchWeather(document.querySelector("#input").value===""?"ankara":document.querySelector("#input").value);

}

ui.fetchWeather();






    // const url = 'https://api.unsplash.com/search/photos?query='+input.value+'&per_page=30&client_id=SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo';
    // const url = 'https://api.unsplash.com/photos/random?query='+input.value+'&per_page=30&client_id=SouHY7Uul-OxoMl3LL3c0NkxUtjIrKwf3tsGk1JaiVo';
    // const url = `https://pixabay.com/api/?q=${city}&key=28892770-92dc25cc82e65b8c01eed5871&image_type=all`;