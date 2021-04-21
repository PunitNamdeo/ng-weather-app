import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import {WeatherService} from '../weather.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {WeatherServiceMock} from './weather.service.mock';
import {of, throwError} from 'rxjs';
import {MatExpansionModule, MatExpansionPanel} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('WeatherComponent', () => {
  let weatherComponent: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherComponent],
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule, MatExpansionModule, MatTableModule, MatProgressBarModule, BrowserAnimationsModule],
      // Provide the service-under-test
      providers: [{provide: WeatherService, useClass: WeatherServiceMock}]
    }).compileComponents();
  });

  it('should create the weather component', () => {
    // inject component.
    fixture = TestBed.createComponent(WeatherComponent);
    weatherComponent = fixture.componentInstance;
    spyOn(weatherComponent, 'ngOnInit');
    fixture.detectChanges();
    expect(weatherComponent).toBeTruthy();
    expect(weatherComponent).toBeDefined();
  });

  it('should call the getWeatherByCity() of WeatherComponent on component init', () => {
    spyOn(weatherComponent.weatherService, 'getWeatherByCity').and.callThrough();
    weatherComponent.getWeatherByCity('Amsterdam');
    expect(weatherComponent.weatherService.getWeatherByCity).toHaveBeenCalled();
  });

  it('should call the getWeatherByCity() of WeatherService on component init and return the response', () => {
    const response = { weather: [{description: 'broken clouds', icon: '03n'}],
      main: {temp: 284.54},
      wind: {speed: 4.6}};
    spyOn(weatherComponent.weatherService, 'getWeatherByCity').and.returnValue(of(response));
    weatherComponent.getWeatherByCity('Amsterdam');
    weatherComponent.weatherList.set('Amsterdam', response);
    expect(weatherComponent.weatherList.get('Amsterdam')).toEqual(response);
  });

  it('should set Error message when getWeatherByCity() is errored out', () => {
    expect(weatherComponent.errorMessageOfCurrentWeather).toBeUndefined();
    spyOn(weatherComponent.weatherService, 'getWeatherByCity').and.returnValue(throwError('error has been thrown from service'));
    weatherComponent.getWeatherByCity('Amsterdam');
    expect(weatherComponent.errorMessageOfCurrentWeather).toBe('error has been thrown from service');
  });

  it('should call the getCityWeatherForecast() of WeatherService and return the response', () => {
    weatherComponent.errorMessageOfCurrentWeather = 'No Error';
    const response = {
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
        }]};
    spyOn(weatherComponent.weatherService, 'getWeatherForecastByCity').and.returnValue(of(response));
    weatherComponent.getCityWeatherForecast('Amsterdam');
    expect(weatherComponent.selectedWeatherForecast.length).toEqual(2);
    expect(weatherComponent.selectedWeatherForecast[0].wind.speed).toEqual(4.6);
    });

  it('should call the getCityWeatherForecast() of WeatherService and return the error response', () => {
    expect(weatherComponent.errorMessageOfForecastWeather).toBeUndefined();
    spyOn(weatherComponent.weatherService, 'getWeatherForecastByCity').and.returnValue(throwError('error has been thrown from service'));
    weatherComponent.getCityWeatherForecast('Amsterdam');
    expect(weatherComponent.errorMessageOfForecastWeather).toBe('error has been thrown from service');
  });

});
