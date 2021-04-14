import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather.service';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { IWeatherData } from '../../data/schema/weatherData';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {IWeatherDataList} from '../../data/schema/weatherDataList';

const baseUrl = 'https://api.openweathermap.org/data/2.5/';
const appID = 'fecc96b805bc547775f602f5a2e3f1e2';
const city = 'Amsterdam';

describe('WeatherService (with mocks)', () => {

  let httpClient: HttpClient;
  let service: WeatherService;
  let httpTestingController: HttpTestingController;
  let weatherDataFromServer: IWeatherData;
  let weatherForecastDataFromServer: IWeatherDataList;

  beforeEach(() => {

    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test
      providers: [WeatherService]
    });

    // Inject the http, test controller, and service-under-test
    // as they will be referenced by each test.
    httpClient = TestBed.inject(HttpClient);
    service = TestBed.inject(WeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  // check for the current weather service
  it('should call the api to get current weather data', () => {
    // dummy data of current weather api
    weatherDataFromServer = {
      weather: [{description: 'broken clouds', icon: '03n'}],
      main: {temp: 284.54},
      wind: {speed: 4.6}
    };

    service.getWeatherByCity('Amsterdam').subscribe(weatherData => {
      expect(weatherData).toEqual(weatherDataFromServer, 'should return expected weatherData');
      expect(weatherData.wind.speed).toBe(4.6); }, fail
    );
    // WeatherService should have made one request to GET current weather data from expected URL
    const req = httpTestingController.expectOne(`${baseUrl}weather?units=metric&q=${city}&appid=${appID}`);
    expect(req.request.method).toEqual('GET');

    // fires the request using data weatherDataFromServer
    req.flush(weatherDataFromServer);
  });

  it('should not return empty weather data', () => {
    // dummy data of current weather api
    weatherDataFromServer = {
      weather: [{description: 'broken clouds', icon: '03n'}],
      main: {temp: 284.54},
      wind: {speed: 4.6}
    };

    service.getWeatherByCity('Amsterdam').subscribe(
      weatherData => expect(weatherDataFromServer.weather.length).toEqual(1, 'should not have empty weather array'),
      fail
    );

    const req = httpTestingController.expectOne(`${baseUrl}weather?units=metric&q=${city}&appid=${appID}`);
    req.flush(weatherDataFromServer); // Respond with weather array
  });

  it('should return an error when the server returns a 404', () => {
    const msg = ' Http failure response for https://api.openweathermap.org/data/2.5/weather?units=metric&q=Amsterdam&appid=fecc96b805bc547775f602f5a2e3f1e2: 404 Not Found';
    spyOn(service, 'handleError').and.callThrough();

    service.getWeatherByCity('Amsterdam').subscribe(
      weatherData => fail('expected to fail'),
      (error: HttpErrorResponse) => {
        expect(service.handleError).toHaveBeenCalled();
        expect(error).toContain(msg);
      });

    const retryCount = 2;
    for (let i = 0 ; i < retryCount; i++) {
      const req = httpTestingController.expectOne(`${baseUrl}weather?units=metric&q=${city}&appid=${appID}`);
      // respond with a 404 and the error message in the body
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    }
  });

  it('should turn network error into user-facing error', () => {
    const msg = 'simulated network error';
    spyOn(service, 'handleError').and.callThrough();

    // Create mock ErrorEvent, raised when something goes wrong at the network level.
    // Connection timeout, DNS error, offline, etc
    const errorEvent = new ErrorEvent('so sad', {
      message: msg,
      // The rest of this is optional and not used.
      // Just showing that you could provide this too.
      filename: 'weather.service.ts'
    });

    service.getWeatherByCity('Amsterdam').subscribe(
      weatherData => fail('expected to fail'),
      (error: HttpErrorResponse)  => {
        expect(service.handleError).toHaveBeenCalled();
        expect(errorEvent.message).toContain(msg);
      });

    const retryCount = 2;
    for (let i = 0 ; i < retryCount; i++) {
      const req = httpTestingController.expectOne(`${baseUrl}weather?units=metric&q=${city}&appid=${appID}`);

      // Respond with mock error
      req.error(errorEvent);
    }
  });

  // check for the weather forecast service
  it('should call the api to get weather forecast data', () => {
    // dummy data of weather forecast api
    weatherForecastDataFromServer = {
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
    };

    service.getWeatherForecastByCity('Amsterdam').subscribe(weatherForecastData => {
      expect(weatherForecastData).toEqual(weatherForecastDataFromServer, 'should return expected weatherForecastData');
      expect(weatherForecastData.city.name).toBe('Amsterdam'); }, fail
    );
    // WeatherForecastService should have made one request to GET current weather data from expected URL
    const req = httpTestingController.expectOne(`${baseUrl}forecast?units=metric&q=${city}&appid=${appID}`);
    expect(req.request.method).toEqual('GET');

    // fires the request using data weatherDataFromServer
    req.flush(weatherForecastDataFromServer);
  });

  /*Info: Similarly, we can proceed with handleError(errorResponse) for getWeatherForecastByCity() function
   as we have done for getWeatherByCity() function*/
});
