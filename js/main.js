//для кроссбраузерности ajax
function getXmlHttp() {
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}
////////////////////////////////////////////////////////////////////////////////
//Глобальные переменные
var timezone = "Europe/Moscow";
var default_url = 'https://worldtimeapi.org/api/timezone/'; //источник данных о времени
var url = default_url + timezone;
var switch_to_12 = false; //глобальная переменная для переключения 12/24
var refresh = 1;
//////////////////////////////////////////////////////////////////////////////
window.onload = function() {

  get_time(url); //запуск функции запроса и запуска времени

  document.querySelector('#format').onclick = function() {
  switch_to_12 = !switch_to_12;
  var value = switch_to_12 ? "12" : "24"; //смена значения данных на кнопке
    document.querySelector('#format').innerHTML = value;
}
  document.querySelector('#timezone').onchange = function() {
    url = default_url + this.value;//данные берутся из select в html разметке
    refresh = 60; //изменение счётчика на синхрон, чтобы перезапуститься со следующей секунды с новым url
  }
}
////////////////////////////////////////////////////////////////////////////////
function get_time(url) {
  var xmlhttp = getXmlHttp(); // Создаём объект XMLHTTP
  xmlhttp.open('GET', url, true); // Открываем асинхронное соединение
  xmlhttp.send(); // Отправляем POST-запрос
  xmlhttp.onreadystatechange = function() { // Ждём ответа от сервера
    if (this.readyState === 4 && this.status === 200) { // Ответ пришёл
      if (this.responseText === "error") alert("Ошибка!");
      else {
        var time_data = JSON.parse(this.responseText);
        set_time(time_data.datetime); //datetime "поле из приходящего значения от WT API"
      }
    }
  };
}
////////////////////////////////////////////////////////////////////////////////
function set_time(date_time) {
var date = date_time.substring(0,10),
    time = date_time.substring(11,19),
    hour    = parseInt(time.substring(0,2)),
    minutes = parseInt(time.substring(3,5)),
    secunds = parseInt(time.substring(6,8));
    
  timer(hour, minutes, secunds, switch_to_12);
  document.querySelector('#date').innerHTML = date_to_rus(date);
}

//////////////////////////////////////////////////////////////////////////////

//Перевод значения даты в русо-читабельное состояние
function date_to_rus(date) {
  var day    = date.substring(8,10),
      mounth = date.substring(5,7),
      year   = date.substring(0,4);

  switch (mounth) {
    case "01" : mounth = " Января "; break;
    case "02" : mounth = " Февраля "; break;
    case "03" : mounth = " Марта "; break;
    case "04" : mounth = " Апреля "; break;
    case "05" : mounth = " Мая "; break;
    case "06" : mounth = " Июня "; break;
    case "07" : mounth = " Июля "; break;
    case "08" : mounth = " Августа "; break;
    case "09" : mounth = " Сентября "; break;
    case "10" : mounth = " Октября "; break;
    case "11" : mounth = " Ноября "; break;
    case "12" : mounth = " Декабря "; break;
  }
  return day+mounth+year;
}

//функция посекундного хода времени
//часы, минуты, секунды передаются из обработанного запроса GET функцией set_time
//switch_to_12 - логический префикс для переключения 12/24
function timer(hour, minutes, secunds) {

  //проверка на переполнение
  if (secunds==60) { minutes++; secunds = 0; }
  if (minutes==60) { hour++; minutes = 0; }
  if (hour == 24)  { hour = 0; refresh = 60 } //для обновления даты
  
  var prefix= "";
  if (switch_to_12) prefix = (hour > 11 && hour != 0) ? " pm" : " am";
        
  var changeable_hour;
  document.querySelector("#clock").innerHTML =
    two_digits(changeable_hour = (hour > 12 && switch_to_12) ? hour%12 : hour) +":"+
    two_digits(minutes) +":"+
    two_digits(secunds) +
    prefix;
  
  if (refresh == 60) { //синхронизация с сервером каждые 60 секунд
    refresh = 1;
    get_time(url);
  }
  else { // посекундное обновление времени
    refresh++;
    secunds++; //пошёл отсчёт
    setTimeout("timer("+ hour +","+ minutes +","+ secunds +")", 1000);
  }
}
//функция для добавления нуля при значениях до десяти
function two_digits(number) {
  return (number < 10 ? "0" : "") + number;
}