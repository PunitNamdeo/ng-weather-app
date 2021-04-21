import {Observable, of} from 'rxjs';
import {IWeatherData} from '../../../data/schema/weatherData';
import {IWeatherDataList} from '../../../data/schema/weatherDataList';

export class WeatherServiceMock {

  getWeatherByCity(): Observable<IWeatherData> {
    return of({
      weather: [{description: 'broken clouds', icon: '03n'}],
      main: {temp: 284.54},
      wind: {speed: 4.6}
    });
  }

  getCityWeatherForecast(): Observable<IWeatherDataList> {
    return of({
      city: {name: 'Amsterdam', country: 'Netherlands'},
      list: [
        {
          weather: [{description: 'broken clouds', icon: '03n'}],
          main: {temp: 284.54},
          wind: {speed: 4.6}
        },
        {
          weather: [{description: 'light rain', icon: '10d'}],
          main: {temp: 281.54},
          wind: {speed: 1.6}
        }]
    });
  }
}
