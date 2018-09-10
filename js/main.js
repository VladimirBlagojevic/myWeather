

window.onload=function geoFindMe() {
    let weatherData;
    const key='01fcae271944d22144c979ac5af8eb3a';
  
    if (!navigator.geolocation){
      alert("<p>Geolocation is not supported by your browser</p>");
      return;
    }
  
    function success(position) {
      let lat  = position.coords.latitude;
      let lon = position.coords.longitude;
      let userUrl= 'http://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&units=metric&appid='+key;
      getWeather(userUrl).then(data => {
        weatherData=data;
        console.log(weatherData);
        const weekArray=daysArray(weatherData);
        updateWeatherIcons(weekArray);
        updateWeatherTemperature(weekArray);
        updateWeatherWeekday(weekArray);
    });
    }
  
    function error() {
      alert("Unable to retrieve your location");
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }

  // Async function to fetch data from  api
async function getWeather(url){
    try{
        const value= await fetch(url);
        const data= await value.json();
        return data; 
    }
    catch(error) {
        alert(error);                             
    }                                
}

function daysArray(obj){
    let tomorrow;
    let now;
    let days=[];
    now=obj.list[0].dt_txt.split(' ');
        
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

    days=[obj.list[0],obj.list[0],obj.list[tomorrow],obj.list[tomorrow+8],obj.list[tomorrow+16],obj.list[tomorrow+24]];

    return days
}

function updateWeatherIcons(obj){
    const todayIcon=document.querySelector('.weather__icon-now');
    const weekIcons=document.querySelectorAll('.weather__icon-weekday');
    const allIcons=[todayIcon, ...weekIcons];

    Array.from(allIcons).forEach((cur,index) => {
        switch(obj[index].weather[0].icon) {

            case "01d":
                cur.src='img/day.svg';
                break;
            case "01n":
                cur.src='img/night.svg';
                break;
            case "02d":
                cur.src='img/cloudy-day-2.svg';
                break;
            case "02n":
                cur.src='img/cloudy-night-2.svg';
                break;
            case "03d":
            case "03n":
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
        let dateString=obj[index].dt_txt.split(' ');
        let day=new Date(dateString[0]).getDay();
        cur.textContent=`${week[day]}`;
    });
    weekDay1.textContent='TODAY';
}






