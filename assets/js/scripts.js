var geoCoding = "http://api.openweathermap.org/geo/1.0/direct?q="
var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" 
var iconUrl = "http://openweathermap.org/img/wn/"
var appId = "bfb48c635c611d189b7dc9d06f07dc20";
var cityName = document.querySelector("#city");
var searchHistory = document.querySelector(".search-history");
var btnSearch = document.querySelector("#btn-search")
var searchCity = document.querySelector(".search-city");
var mainCardBody = document.querySelector(".main-card-body");
var stateList = document.querySelector("#state");
var btnState = document.querySelector("#btn-state");

var searchKey = "";
var stateName = "";
var states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

function loadStates() {
  for(i=0; i < states.length; ++i) {
    var l = document.createElement("li");
    var a = document.createElement("a");
    a.classList.add("dropdown-item");
    a.setAttribute("href","#");
    a.setAttribute("data-value",states[i]);
    a.textContent = states[i];
    l.appendChild(a);
    stateList.appendChild(l);
  }
}

loadStates();

function getWeather(requestUrl) {
  var newI = document.createElement('img')
  fetch(requestUrl)
      .then(function (response) {return response.json()})
      .then(function(data){
        
        searchCity.textContent =cityName.value + "," + stateName + " (" + moment.unix(data.current.dt).format("MM/DD/YYYY") + ") ";
        // Add the weather icon to the main card. 
        newI.src= iconUrl + data.current.weather[0].icon +".png"
        searchCity.appendChild(newI);

    // Populate the main weather card. 
    for(i=0; i<=5; i++) {
      var newP = mainCardBody.children;
      var child = newP[i];
      var newSpan = ""
      switch(i) {
        case 0:
          child.textContent = data.current.weather[0].main;
          child.classList.add("card-text");
          break;
        case 1:
          child.textContent = "Temperature: " + data.current.temp + "\xB0" +"F";
          child.classList.add("card-text");
          break;
        case 2:
          child.textContent = "Humidity: " + data.current.humidity + "%";
          child.classList.add("card-text");
          break;
        case 3:
          child.textContent = "Wind Speed: " + data.current.wind_speed + " MPH";
          child.classList.add("card-text");
          break;
        case 4:
          child.textContent = "UV Index: " ;
          newSpan = document.createElement("span");
          newSpan.textContent = data.current.uvi;
          child.appendChild(newSpan);
          child.classList.add("card-text","uvi-color");
          // Add the background color for the UV index with the css class.
          if(data.current.uvi <3){
              newSpan.classList.add("low");
            } else if (data.current.uvi <6) {
              newSpan.classList.add("moderate");
            } else if (data.current.uvi <8) {
              newSpan.classList.add("high");
            } else if (data.current.uvi <11) {
              newSpan.classList.add("very-high");
            } else {
              newSpan.classList.add("extreme");
          }
          break;
        case 5:
          child.textContent = "Feels Like: " + data.current.feels_like + "\xB0" +"F";
          child.classList.add("card-text");
          break;
      }
    } 

        console.log(data.daily[0].temp.day) // eve, morn, night
        console.log(data.daily[0].humidity)
        console.log(data.daily[0].feels_like.day) // eve, morn, night
        console.log(data.daily[0].weather[0].description)
        console.log(data.daily[0].weather[0].icon)
        console.log(data.daily[0].weather[0].main)
        console.log(data);

    // Populate the 5-day forecast cards
    for(i=1; i<=5; i++) {
      var whichCard = "card" + i;
      var activeCard = document.getElementById(whichCard);
      var children = activeCard.children;
      var newImage = document.createElement("img");

      child = children[0].children[0]; // The header tag in the card.
      child.textContent = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
      newImage.src= iconUrl + data.daily[i].weather[0].icon +".png"
      child.appendChild(newImage); // Add the weather icon to the h5 tag. 

      child = children[0].children[1]; // The 1st paragraph in the card.
      child.textContent = "Temp: " + data.daily[i].temp.day + "\xB0" +"F";
      child = children[0].children[2]; // The 2nd paragraph in the card.
      child.textContent = "Humidity : " + data.daily[i].humidity + "%";
      child = children[0].children[3]; // The 3rd paragraph in the card.
      child.textContent = data.daily[i].weather[0].description; 
     
    }

  })
}

function getCoord(city) {
  cityURL = geoCoding + city + "," + stateName + ",US&limit=1&appid=" + appId;
  console.log(cityURL);
  fetch(cityURL)
      .then(function (response) {return response.json()})
      .then(function(data){
        console.log(data);
        searchKey = weatherApi + data[0].lat + "&lon=" + data[0].lon + "&exclude=hourly,minutely&appid=" + appId + "&units=imperial";
        getWeather(searchKey);
      })
}


function getResults() {
  if(cityName.value =="") {

    cityName.focus();
  } else {
    getCoord(cityName.value);
  }
  
}

btnSearch.addEventListener("click", getResults)
stateList.addEventListener("click", function(e) {
  console.log(e.target)

  stateName = e.target.dataset.value; 
  btnState.textContent = "Selected State: " + stateName;
})

