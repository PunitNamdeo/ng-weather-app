import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { IWeatherData } from '../../../data/schema/weatherData';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  providers: [WeatherService]
})

export class WeatherComponent implements OnInit {

  cities: string[] = ['Paris', 'Zurich', 'Amsterdam', 'Berlin', 'Rome']; // list of cities
  displayedColumns: string[] = ['dt_txt', 'temp', 'speed' , 'description']; // Weather Details table columns
  weatherList = new Map<string, IWeatherData>(); // map to save current weather status of all cities
  selectedWeatherForecast: IWeatherData[]; // forecast object of currently selected city
  errorMessageOfCurrentWeather: string; // store the error message if api gets fail
  errorMessageOfForecastWeather: string; // store the error message if api gets fail
  iconUrl: string = 'http://openweathermap.org/img/wn/';

  constructor(public weatherService: WeatherService){}

  // runs as the component loads
  ngOnInit(): void {
    // loop the weather service based on the defined location/city
    this.cities.forEach((cityObj, index) => {
      this.getWeatherByCity(this.cities[index]);
    });
  }

  // get current weather for a city
  getWeatherByCity(city): void {
    this.weatherService.getWeatherByCity(city).subscribe(data => {
      this.weatherList.set(city, data);
    }, (err: string) =>  this.errorMessageOfCurrentWeather = err);
  }

  // get forecast weather for a city
  getCityWeatherForecast(city): void {
    this.weatherService.getWeatherForecastByCity(city).subscribe(data => {
      // get only first 4 forecast data ( till next 12 hours )
      this.selectedWeatherForecast = data.list.slice(0, 4);
    }, (err: string) =>  this.errorMessageOfForecastWeather = err);
  }
}
