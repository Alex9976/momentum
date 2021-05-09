const moment = require("moment");
moment.locale('ru');

const time = document.querySelector(".time"),
  greeting = document.querySelector(".greeting"),
  name = document.querySelector(".name"),
  focus = document.querySelector(".focus"),
  city = document.querySelector(".city"),
  quote = document.querySelector(".quote"),
  quoteChange = document.querySelector(".quote-change"),
  bgChange = document.querySelector(".bg-change"),
  openModal = document.querySelector(".bg-view");

const weatherAPI = "94dc1074110348afc7eaa29770732d95";
const dayTime = ["morning", "afternoon", "evening", "night"];
const numberOfImages = 30;

let bufferFocus, bufferName, bufferCity;
let images = new Array(4);
for (let i = 0; i < 4; i++)
{
  images[i] = new Array(6);
}

let buffHour = -1;

function showTime()
{
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  time.innerHTML = `${capitalizeFirstLetter(moment().format('dddd'))}, ${moment().format('D MMMM')}<br>${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
  setTimeout(showTime, 1000);
}

function addZero(n)
{
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

function setGreet()
{
  let today = new Date(),
    hour = today.getHours();
  if (hour >= 6 && hour < 12)
  {
    greeting.textContent = "Доброе утро, ";
  }
  else if (hour >= 12 && hour < 18)
  {
    greeting.textContent = "Добрый день, ";
  }
  else if (hour >= 18 && hour < 24)
  {
    greeting.textContent = "Добрый вечер, ";
  }
  else
  {
    greeting.textContent = "Доброй ночи, ";
  }
}

function setBg() {
  let today = new Date(),
    hour = today.getHours();
  let image = new Image();

  if (hour >= 6 && hour < 12)
  {
    image.src = "./assets/images/" + dayTime[0] + "/" + images[0][6 - (12 - hour)] + ".jpg";
  }
  else if (hour >= 12 && hour < 18)
  {
    image.src = "./assets/images/" + dayTime[1] + "/" + images[1][6 - (18 - hour)] + ".jpg";
  }
  else if (hour >= 18 && hour < 24)
  {
    image.src = "./assets/images/" + dayTime[2] + "/" + images[2][6 - (24 - hour)] + ".jpg";
  }
  else
  {
    image.src = "./assets/images/" + dayTime[3] + "/" +  images[3][6 - (6 - hour)] + ".jpg";
  }
  image.onload = function()
  {
    document.body.style.backgroundImage = `url('${image.src}')`;
  };
}

function getPhotos(imagses)
{
  for (let i = 0; i < 4; i++)
  {
    for (let j = 0; j < 6; j++)
    {
      images[i][j] = Math.floor(Math.random() * (numberOfImages - 1)) + 1;
    }
  }
  setBg();
  addImagesToModal();
}

function getName()
{
  if (localStorage.getItem("name") === null || localStorage.getItem("name") == "")
  {
    name.textContent = "Введите имя";
  }
  else
  {
    name.textContent = localStorage.getItem("name");
  }
}

function setName(e)
{
  if (e.type === "keypress")
  {
    if (e.which == 13 || e.keyCode == 13)
    {
      if (e.target.innerText.length == "")
      {
        localStorage.setItem("name", bufferName);
        name.textContent = bufferName;
      }
      else
      {
        localStorage.setItem("name", e.target.innerText);
      }
      name.blur();
    }
  }
  else
  {
    if (e.target.innerText == "")
    {
      localStorage.setItem("name", bufferName);
      name.textContent = bufferName;
    }
    else
    {
      localStorage.setItem("name", e.target.innerText);
    }
  }
}

function getFocus()
{
  if (localStorage.getItem("focus") === null || localStorage.getItem("focus") == "")
  {
    focus.textContent = "Ваша задача";
  }
  else
  {
    focus.textContent = localStorage.getItem("focus");
  }
}

function setFocus(e)
{
  if (e.type === "keypress")
  {
    if (e.which == 13 || e.keyCode == 13)
    {
      if (e.target.innerText.length == "")
      {
        localStorage.setItem("focus", bufferFocus);
        focus.textContent = bufferFocus;
      }
      else
      {
        localStorage.setItem("focus", e.target.innerText);
      }
      focus.blur();
    }
  }
  else
  {
    if (e.target.innerText == "")
    {
      localStorage.setItem("focus", bufferFocus);
      focus.textContent = bufferFocus;
    }
    else
    {
      localStorage.setItem("focus", e.target.innerText);
    }
  }
}

function focusOnClick(e)
{
  bufferFocus = focus.textContent;
  focus.textContent = "";
}

function nameOnClick(e)
{
  bufferName = name.textContent;
  name.textContent = "";
}

function setQuote()
{
  var request = new XMLHttpRequest();
  request.open("GET", "https://api.adviceslip.com/advice", true);
  request.responseType = "json";
  request.send();

  request.onload = function ()
  {
    if (request.status != 200)
    {
      setQuote();
    }
    else
    {
      let responseObj = request.response;
      quote.textContent = responseObj["slip"]["advice"];
    }
  };

  request.onerror = function()
  {
    setQuote();
  };
}

function refreshBG()
{
  getPhotos(images);
}

function updateBg()
{
  let today = new Date(),
    hour = today.getHours();
  if (hour == -1)
  {
    buffHour = hour;
  } else if (hour != buffHour)
  {
    setBg();
    setGreet();
    buffHour = hour;
  }
  setTimeout(updateBg, 1000 * 30);
}

function generateModal()
{
  let mwindow = document.createElement("div");
  mwindow.id = "modal-window";
  mwindow.className = "modal";

  let mwindowContent = document.createElement("div");
  mwindowContent.className = "modal-content";
  mwindowContent.innerHTML = '<span class="close">&times;</span><br>';

  let content = document.createElement("div");
  content.className = "modal-main-content";
  mwindowContent.append(content);

  mwindow.append(mwindowContent);
  document.body.append(mwindow);

  document.getElementsByClassName("close")[0].onclick = function ()
  {
    document.getElementById("modal-window").className = "modal-hide";
    document.getElementsByTagName("body")[0].style.overflow = "visible";
    changeClass();
  };

  openModal.onclick = function ()
  {
    document.getElementById("modal-window").className = "modal-visible";
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  };

  window.onclick = function (event)
  {
    if (event.target == document.getElementById("modal-window"))
    {
      document.getElementById("modal-window").className = "modal-hide";
      document.getElementsByTagName("body")[0].style.overflow = "visible";
      changeClass();
    }
  };
}

async function changeClass()
{
  await sleep(550);
  document.getElementById("modal-window").className = "modal";
}

function sleep(ms)
{
  return new Promise(resolve => setTimeout(resolve, ms));
}

function addImagesToModal()
{
  let modal = document.querySelector(".modal-main-content");
  let content = "";
  for (let i = 0; i < 4; i++)
  {
    for (let j = 0; j < 6; j++)
    {
      content = content + `<img src="./assets/images/` + dayTime[i] + `/` + images[i][j] + `.jpg" width="600px"></img>`;    
    }
  }
  modal.innerHTML = content;
}

document.onkeydown = function (evt)
{
  evt = evt || window.event;
  if (evt.keyCode == 27)
  {
    if (document.getElementById("modal-window").className != "modal-hide" && document.getElementById("modal-window").className != "modal")
    {
      document.getElementById("modal-window").className = "modal-hide";
      document.body.style.overflow = "visible";
      changeClass();
    }
  }
};

function capitalizeFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWeatherForecast()
{
  var request = new XMLHttpRequest();
  request.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem('city')}&lang=ru&appid=${weatherAPI}&units=metric`, true);
  request.responseType = "json";
  request.send();

  request.onload = function ()
  {
    if (request.status != 200 && request.status != 404)
    {
        if (document.getElementById("weather") != null)
        {
          document.getElementById("weather").remove();
        }
        getWeatherForecast();
      
    }
    else if (request.status == 404)
    {
      if (document.getElementById("weather") != null)
      {
        document.getElementById("weather").remove();
      }
    }
    else
    {
      setWeather(request.response);
    }
  };

  request.onerror = function ()
  {
    getWeatherForecast();
  };
}

function setWeather(response)
{
  let weather = document.createElement('div');
  weather.className = "weather";
  weather.id = "weather";
  weather.innerHTML = `<span><img class="weather-img" src="http://openweathermap.org/img/wn/${response['weather'][0]['icon']}.png">${Math.round(response['main']['temp'])}&deg;<br>${capitalizeFirstLetter(response['weather'][0]['description'])}</span>`;
  if (document.getElementById("weather") != null)
  {
    document.getElementById("weather").remove();
  }
  city.after(weather);
  setTimeout(getWeatherForecast, 1000 * 3600);
}

function getCity()
{
  if (localStorage.getItem("city") === null || localStorage.getItem("city") == "")
  {
    city.textContent = "Введите город";
  }
  else
  {
    city.textContent = localStorage.getItem("city");
  }
}

function setCity(e)
{
  if (e.type === "keypress")
  {
    if (e.which == 13 || e.keyCode == 13)
    {
      if (e.target.innerText.length == "")
      {
        localStorage.setItem("city", bufferCity);
        city.textContent = bufferCity;
      }
      else
      {
        localStorage.setItem("city", e.target.innerText);
      }
      city.blur();
      getWeatherForecast();
    }  
  }
  else
  {
    if (e.target.innerText == "")
    {
      localStorage.setItem("city", bufferCity);
      city.textContent = bufferCity;
    }
    else
    {
      localStorage.setItem("city", e.target.innerText);
    }
    getWeatherForecast();
  }
}

function cityOnClick(e)
{
  bufferCity = city.textContent;
  city.textContent = "";
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
name.addEventListener("click", nameOnClick);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
focus.addEventListener("click", focusOnClick);
city.addEventListener("keypress", setCity);
city.addEventListener("blur", setCity);
city.addEventListener("click", cityOnClick);
quoteChange.addEventListener("click", setQuote);
bgChange.addEventListener("click", refreshBG);

generateModal();
getPhotos(images);
showTime();
setGreet();
setQuote();
getName();
getFocus();
getCity();
updateBg();
getWeatherForecast();
