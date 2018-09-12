
// Geolocation api function to get lon and lat of the current position
window.onload=function geoFindMe() {
    let weatherData;
    //api key
    const key='01fcae271944d22144c979ac5af8eb3a';

    if (!navigator.geolocation){
      alert("<p>Geolocation is not supported by your browser</p>");
      return;
    }
    
    function success(position) {
      // get current position coordinates
      let lat  = position.coords.latitude;
      let lon = position.coords.longitude;
      // build up url to fetch data with it
      let userUrl= 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&units=metric&appid='+key;
      
      // call async function
      getWeather(userUrl).then(data => {
        weatherData=data;
        //in here we call all our function where we use data from api
        const weekArray=daysArray(weatherData);
        updateWeatherIcons(weekArray);
        updateWeatherTemperature(weekArray);
        updateWeatherWeekday(weekArray);
        updateCity(weatherData);
        weatherDescription(weekArray);
        
    });
    }
    function error() {
      alert("Unable to retrieve your location");
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }

  // Update time and date in the UI
  currentTimeAndDate();
  setInterval(()=> currentTimeAndDate(),60000);
  

  // Async function to fetch data from  api
async function getWeather(url){
    try{
        // fetch data with the given url
        const value= await fetch(url);
        // turn json into object
        const data= await value.json();
        return data; 
    }
    catch(error) {
        alert(error);                             
    }                                
}
// Finds weather objects for the next five days and return it as new array
function daysArray(obj){
    let tomorrow;
    let now;
    let days=[];
    // ekstract time of first object
    now=obj.list[0].dt_txt.split(' ');
    //based on now value calculate tomorrow (so that tomorrow points to 12:00 of the next day)   
    switch (now[1]){
        case '00:00:00' :
            tomorrow=4;
            break;
        case '03:00:00' :
            tomorrow=11;
            break;
        case '06:00:00' :
            tomorrow=10;
            break;
        case '09:00:00' :
            tomorrow=9;
            break;
        case '12:00:00' :
            tomorrow=8;
            break;
        case '15:00:00' :
            tomorrow=7;
            break;
        case '18:00:00' :
            tomorrow=6;
            break;
        case '21:00:00' :
            tomorrow=5;
            break;
        default:
            console.log('error');
    }
    //build days array using tomorrow variable (we have first object twice becouse of ui setup)
    days=[obj.list[0],obj.list[0],obj.list[tomorrow],obj.list[tomorrow+8],obj.list[tomorrow+16],obj.list[tomorrow+24]];

    return days
}

function updateWeatherIcons(obj){
    
    const todayIcon=document.querySelector('.weather__icon-now');
    const weekIcons=document.querySelectorAll('.weather__icon-weekday');
    // merge selectors in one node-list by spreading weekIcons 
    const allIcons=[todayIcon, ...weekIcons];
    // turn list into array and loop it 
    Array.from(allIcons).forEach((cur,index) => {
        //  update img src with our custom svg based on case we get from passed object
        switch(obj[index].weather[0].icon) {

            case "01d":
                cur.src='img/day.svg';
                break;
            case "01n":
                cur.src='img/night.svg';
                break;
            case "02d":
            case "03d":
                cur.src='img/cloudy-day-2.svg';
                break;
            case "02n":
            case "03n":
                cur.src='img/cloudy-night-2.svg';
                break;
            case "04d":
            case "04n":
            case "050d":
            case "050n":
                cur.src='img/cloudy.svg';
                break;
            case "011d":
            case "011n":
                cur.src='img/thunder.svg';
                break;
            case "09d":
            case "09n":
                cur.src='img/rainy-5.svg';
                break;
            case "010d":
            case "010n":
                cur.src='img/rainy-6.svg';
                break;
            case "013d":
            case "013n":
                cur.src='img/snowy-6.svg';
                break;               
            default :
                cur.src='img/cloudy.svg';
        }
    });
}

function updateWeatherTemperature(obj){
    const tempWeek=document.querySelectorAll('.temp--js');
    const allTemp=[...tempWeek];

    Array.from(allTemp).forEach((cur,index)=>{
        cur.textContent=`${parseInt(obj[index].main.temp)}`;
    });
}

function updateWeatherWeekday(obj){
    const weekDay=document.querySelectorAll('.weekday--js');
    const weekDay1=document.querySelector('.weekday--js');
    const week=['SUN','MON','TUE','WED','THU','FRI','SAT']
    const allDays=[...weekDay];

    Array.from(allDays).forEach((cur,index)=>{
        //get  date string for the current object
        let dateString=obj[index].dt_txt.split(' ');
        //use that string to get number of week day
        let day=new Date(dateString[0]).getDay();
        //pass that number to week array to get name of the current day in format defined trough week array
        cur.textContent=`${week[day]}`;
    });

    weekDay1.textContent='TODAY';
}
// Update UI with city and state for current location
function updateCity(obj){
    const state=document.querySelector('.header__city--state');
    const city=document.querySelector('.header__city');
    city.innerHTML=`${obj.city.name}<span class="header__city--state">,${obj.city.country}</span>`;
}
// Weather description for today
function weatherDescription(obj){
    const description=document.querySelector('.header__conditions');
    const wind=document.querySelector('.header__icon-1');
    const press=document.querySelector('.header__icon-2');
    const humidity=document.querySelector('.header__icon-3');

    description.textContent=obj[0].weather[0].description;
    wind.textContent=obj[0].wind.speed;
    press.textContent=`${obj[0].main.pressure} mbar`;
    humidity.textContent=`${obj[0].main.humidity} %`;
}

function currentTimeAndDate(){
    const timeUI=document.querySelector('.header__time');
    const dateUI=document.querySelector('.header__date');
    // Update time
    let time=new Date().toString().slice(16,21);
    timeUI.textContent=time;

    // Update date

    // get full weekday
    const week=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let weekDay=new Date().getDay();
    // get full month
    const months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let month= new Date().getMonth();
    // get year and day of the month
    let year= new Date().getFullYear();
    let day= new Date().getDate();
    // build date
    dateUI.textContent=`${week[weekDay]}, ${day} ${months[month]} ${year}`;
}








