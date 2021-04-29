const time = document.querySelector(".time"),
  greeting = document.querySelector(".greeting"),
  name = document.querySelector(".name"),
  focus = document.querySelector(".focus"),
  quote = document.querySelector(".quote"),
  quoteChange = document.querySelector(".quote-change"),
  bgChange = document.querySelector(".bg-change"),
  openModal = document.querySelector(".bg-view");

const dayOfWeek = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];
const month = [
  "января",
  "февряля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];
let bufferFocus, bufferName;
let images = new Array(4);
let loadImages = 0;
let buffHour = -1;

function showTime() {
  let today = new Date(),
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds(),
    dayOF = today.getDay(),
    date = today.getDate(),
    currentMonth = today.getMonth();

  time.innerHTML = `${dayOfWeek[dayOF]}, ${date} ${
    month[currentMonth]
  }<br>${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
  setTimeout(showTime, 1000);
}

function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

function setGreet() {
  let today = new Date(),
    hour = today.getHours();
  if (hour >= 6 && hour < 12) {
    greeting.textContent = "Доброе утро, ";
  } else if (hour >= 12 && hour < 18) {
    greeting.textContent = "Добрый день, ";
  } else if (hour >= 18 && hour < 24) {
    greeting.textContent = "Добрый вечер, ";
  } else {
    greeting.textContent = "Доброй ночи, ";
  }
}

function setBg() {
  let today = new Date(),
    hour = today.getHours();
  let image = new Image();
  if (hour >= 6 && hour < 12) {
    image.src = images[0]["value"][6 - (12 - hour)]["contentUrl"];
  } else if (hour >= 12 && hour < 18) {
    image.src = images[1]["value"][6 - (18 - hour)]["contentUrl"];
  } else if (hour >= 18 && hour < 24) {
    image.src = images[2]["value"][6 - (24 - hour)]["contentUrl"];
  } else {
    image.src = images[3]["value"][6 - (6 - hour)]["contentUrl"];
  }
  image.onload = function () {
    document.body.style.backgroundImage = `url('${image.src}')`;
  };
}

function getPhotos(imagses) {
  var request = new XMLHttpRequest();
  let query = ["morning", "afternoon", "evening", "night"];
  request.responseType = "json";
  request.open(
    "GET",
    `https://api.bing.microsoft.com/v7.0/images/search?q=${
      query[loadImages]
    } nature&count=6&imageType=Photo&offset=${Math.floor(
      Math.random() * 1000
    )}&maxWidth=1920&maxHeight=1080&minWidth=1600&minHeight=900`,
    true
  );
  request.setRequestHeader(
    "Ocp-Apim-Subscription-Key",
    "token"
  );
  request.send();

  request.onload = function () {
    if (request.status != 200) {
      getPhotos();
    } else {
      imagses[loadImages] = request.response;
      loadImages++;
      if (loadImages == 4) {
        setBg();
        addImagesToModal();
      } else {
        getPhotos(imagses);
      }
    }
  };

  request.onerror = function () {
    getPhotos();
  };
}

function getName() {
  if (
    localStorage.getItem("name") === null ||
    localStorage.getItem("name") == ""
  ) {
    name.textContent = "Введите имя";
  } else {
    name.textContent = localStorage.getItem("name");
  }
}

function setName(e) {
  if (e.type === "keypress") {
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText.length == "") {
        localStorage.setItem("name", bufferName);
        name.textContent = bufferName;
      } else {
        localStorage.setItem("name", e.target.innerText);
      }
      name.blur();
    }
  } else {
    if (e.target.innerText == "") {
      localStorage.setItem("name", bufferName);
      name.textContent = bufferName;
    } else {
      localStorage.setItem("name", e.target.innerText);
    }
  }
}

function getFocus() {
  if (
    localStorage.getItem("focus") === null ||
    localStorage.getItem("focus") == ""
  ) {
    focus.textContent = "Ваша задача";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

function setFocus(e) {
  if (e.type === "keypress") {
    if (e.which == 13 || e.keyCode == 13) {
      if (e.target.innerText.length == "") {
        localStorage.setItem("focus", bufferFocus);
        focus.textContent = bufferFocus;
      } else {
        localStorage.setItem("focus", e.target.innerText);
      }

      focus.blur();
    }
  } else {
    if (e.target.innerText == "") {
      localStorage.setItem("focus", bufferFocus);
      focus.textContent = bufferFocus;
    } else {
      localStorage.setItem("focus", e.target.innerText);
    }
  }
}

function focusOnClick(e) {
  bufferFocus = focus.textContent;
  focus.textContent = "";
}

function nameOnClick(e) {
  bufferName = name.textContent;
  name.textContent = "";
}

function changeImage() {
  console.log("");
}

function setQuote() {
  var request = new XMLHttpRequest();
  request.open("GET", "https://api.adviceslip.com/advice", true);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    if (request.status != 200) {
      setQuote();
    } else {
      let responseObj = request.response;
      quote.textContent = responseObj["slip"]["advice"];
    }
  };

  request.onerror = function () {
    setQuote();
  };
}

function refreshBG() {
  loadImages = 0;
  getPhotos(images);
}

function updateBg() {
  let today = new Date(),
    hour = today.getHours();
  if (hour == -1) {
    buffHour = hour;
  } else if (hour != buffHour && loadImages == 4) {
    setBg();
    setGreet();
    buffHour = hour;
  }
  setTimeout(updateBg, 1000 * 30);
}

function generateModal() {
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

  document.getElementsByClassName("close")[0].onclick = function () {
    document.getElementById("modal-window").style.display = "none";
    document.getElementsByTagName("body")[0].style.overflow = "visible";
  };

  openModal.onclick = function () {
    document.getElementById("modal-window").style.display = "block";
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  };

  window.onclick = function (event) {
    if (event.target == document.getElementById("modal-window")) {
      document.getElementById("modal-window").style.display = "none";
      document.getElementsByTagName("body")[0].style.overflow = "visible";
    }
  };
}

function addImagesToModal() {
  let modal = document.querySelector(".modal-main-content");
  let content = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < images[i]["value"].length; j++) {
      let image = new Image();
      image.src = images[i]["value"][j]["contentUrl"];
      content = content + `<img src="${image.src}" width="600px"></img>`;
    }
  }
  modal.innerHTML = content;
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
name.addEventListener("click", nameOnClick);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
focus.addEventListener("click", focusOnClick);
time.addEventListener("onchange", changeImage);
quoteChange.addEventListener("click", setQuote);
bgChange.addEventListener("click", refreshBG);

getPhotos(images);
showTime();
setGreet();
setQuote();
getName();
getFocus();
updateBg();
generateModal();
