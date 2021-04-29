var geoCoding = "http://api.openweathermap.org/geo/1.0/direct?q="
var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" 
var iconUrl = "http://openweathermap.org/img/wn/"
var appId = "bfb48c635c611d189b7dc9d06f07dc20";

var stateSelect = document.getElementById("state-select")
var cityName = document.querySelector("#city");
var searchHistory = document.querySelector(".search-history");
var btnSearch = document.querySelector("#btn-search")
var searchCity = document.querySelector(".search-city");
var mainCardBody = document.querySelector(".main-card-body");
var stateList = document.querySelector("#state");
var temps = document.querySelector(".temps");

var searchKey = "";
var stateName = "";
var states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

function loadStates() {
  for(i=0; i < states.length; ++i) {
    var l = document.createElement("option");
    l.setAttribute("value",states[i]);
    l.textContent = states[i];
    stateSelect.appendChild(l);
  }
}

loadStates();

function getWeather(requestUrl) {
  // Pulls the 7-day forecast for the requestUrl and populates the dashboard
  var newI = document.createElement('img')
  fetch(requestUrl)
      .then(function (response) {return response.json()})
      .then(function(data){
        
        searchCity.textContent =cityName.value + "," + stateName + " (" + moment.unix(data.current.dt).format("ddd") + " " + moment.unix(data.current.dt).format("MM/DD/YY") + ") ";
        // Add the weather icon to the main card. 
        newI.src= iconUrl + data.current.weather[0].icon +".png"
        searchCity.appendChild(newI);

    // Populate the main weather card. 
    for(i=0; i<=5; i++) {
      var newP = mainCardBody.children;
      var child = newP[i];
      var newSpan = ""
      var fixedNum = ""
      switch(i) {
        case 0:
          child.textContent = data.current.weather[0].main;
          child.classList.add("card-text");
          break;
        case 1:
          fixedNum = data.current.temp
          child.textContent = "Temperature: " + fixedNum.toFixed(1) + "\xB0" +"F";
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
          fixedNum = data.current.feels_like
          child.textContent = "Feels Like: " + fixedNum.toFixed(1) + "\xB0" +"F";
          child.classList.add("card-text");
          break;
      }
    } 

    fixedNum = data.daily[0].temp.morn
    temps.children[0].textContent = fixedNum.toFixed(1) + "\xB0";
    
    fixedNum = data.daily[0].temp.eve
    temps.children[1].textContent = fixedNum.toFixed(1) + "\xB0";

    fixedNum = data.daily[0].temp.night
    temps.children[2].textContent = fixedNum.toFixed(1) + "\xB0";

    fixedNum = data.daily[0].temp.min
    temps.children[3].textContent = fixedNum.toFixed(1) + "\xB0";

    fixedNum = data.daily[0].temp.max
    temps.children[4].textContent = fixedNum.toFixed(1) + "\xB0";

    // Populate the 5-day forecast cards
    for(i=1; i<=5; i++) {
      var whichCard = "card" + i;
      var activeCard = document.getElementById(whichCard);
      var children = activeCard.children;
      var newImage = document.createElement("img");

      child = children[0].children[0]; // The header tag in the card.
      child.textContent = moment.unix(data.daily[i].dt).format("ddd") + " " + moment.unix(data.daily[i].dt).format("MM/DD/YY");
      newImage.src= iconUrl + data.daily[i].weather[0].icon +".png"
      child.appendChild(newImage); // Add the weather icon to the h5 tag. 

      child = children[0].children[1]; // The 1st paragraph in the card.
      fixedNum = data.daily[i].temp.day
      child.textContent = "Temp: " + fixedNum.toFixed(1) + "\xB0" +"F";
      child = children[0].children[2]; // The 2nd paragraph in the card.
      child.textContent = "Humidity : " + data.daily[i].humidity + "%";
      child = children[0].children[3]; // The 3rd paragraph in the card.
      child.textContent = data.daily[i].weather[0].description; 
     
    }

  })
  // Save the search criteria to the history. 
  saveSearch();
}

function getCoord(city) {
  // Take the city and state name get the coordinates and pass them to the getWeather function. 
  cityURL = geoCoding + city + "," + stateName + ",US&limit=1&appid=" + appId;
 
  fetch(cityURL)
      .then(function (response) {return response.json()})
      .then(function(data){
        console.log(data);
        searchKey = weatherApi + data[0].lat + "&lon=" + data[0].lon + "&exclude=hourly,minutely&appid=" + appId + "&units=imperial";
        getWeather(searchKey);
      })
}

function getResults() {
  // Check that a city and state have been entered, call the function to get the Longitude and Latitude coordinates. 
  if(cityName.value =="") {

    cityName.focus();
  } else {
    stateName = stateSelect.value;
    getCoord(cityName.value);
  }
  
}

function saveSearch(){
  var currentSearch = {
    city: cityName.value,
    state: stateName
  }

  var a = [] // Local storage array. 
  a = JSON.parse(localStorage.getItem("searchHistory")) || [];
  console.log(a);

  // See if the item exists in the array already before adding it again. 
  if(a !== null) {
    let item = a.find(a => a.city === cityName.value && a.state === stateName);
    if(!item) {
      a.push(currentSearch); 
      localStorage.setItem("searchHistory", JSON.stringify(a));
    }
  }
  getSearchHistory();
}

function getSearchHistory() {
  var history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if(history !== null) {

    // Remove the child elements first, then add them from the history. 
    while(searchHistory.lastChild) {
      searchHistory.removeChild(searchHistory.lastChild);
    }
    // Sort the array before displaying the history. 
    history.sort(sortArray("city"));
    for(i=0; i < history.length; ++i) {
      var li = document.createElement("li");
      li.classList.add("list-group-item");
      li.textContent = history[i].city + "," + history[i].state;
      searchHistory.appendChild(li);
    }
  }
}

function sortArray(column) {
  return function(a,b) {
    if (a[column] > b[column]) {
      return 1;
    } else if (a[column] < b[column]) {
      return -1;
    }
    return 0;
  }
}

// Load the searchHistory once the page has finished loading. 
getSearchHistory();

btnSearch.addEventListener("click", getResults)

searchHistory.addEventListener("click", function(e) {
  // Split the string on the button link and call the getCoord function
  var results = e.target.textContent;
  var str = results.split(",");
  cityName.value = str[0];
  stateName = str[1];
  getCoord(cityName.value);
})
stateSelect.addEventListener("change", function(){
  cityName.value = "";
  cityName.focus();
  stateName = stateSelect.value;
})

