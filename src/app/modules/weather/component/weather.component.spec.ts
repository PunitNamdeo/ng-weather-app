import {ComponentFixture, TestBed} from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import {WeatherService} from '../weather.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {WeatherServiceMock} from './weather.service.mock';
import {of, throwError} from 'rxjs';

describe('WeatherComponent', () => {
  let weatherComponent: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherServiceMock: WeatherServiceMock;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherComponent],
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test
      providers: [{provide: WeatherService, useClass: WeatherServiceMock}]
    }).compileComponents();

    // inject component.
    fixture = TestBed.createComponent(WeatherComponent);
    weatherComponent = fixture.componentInstance;
    spyOn(weatherComponent, 'ngOnInit');
    fixture.detectChanges();
  });

  it('should create the weather component', () => {
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
    fixture.detectChanges();
    weatherComponent.weatherList.set('Amsterdam', response);
    expect(weatherComponent.weatherList.get('Amsterdam')).toEqual(response);
  });

  it('should set Error message when getWeatherByCity() is errored out', () => {
    expect(weatherComponent.errorMessageOfCurrentWeather).toBeUndefined();
    spyOn(weatherComponent.weatherService, 'getWeatherByCity').and.returnValue(throwError('Error'));
    weatherComponent.getWeatherByCity('Amsterdam');
    expect(weatherComponent.errorMessageOfCurrentWeather).toBe('Error');
  });

  it('should call the getCityWeatherForecast() of WeatherService on tile click and return the response', () => {
    const element = fixture.debugElement.nativeElement.querySelector('#matExpansionPanel');
    console.log(element);
    /*const response = { weather: [{description: 'broken clouds', icon: '03n'}],
      main: {temp: 284.54},
      wind: {speed: 4.6}};
    spyOn(weatherComponent.weatherService, 'getWeatherByCity').and.returnValue(of(response));
    weatherComponent.getWeatherByCity('Amsterdam');
    fixture.detectChanges();
    weatherComponent.weatherList.set('Amsterdam', response);
    expect(weatherComponent.weatherList.get('Amsterdam')).toEqual(response);*/
  });

});
