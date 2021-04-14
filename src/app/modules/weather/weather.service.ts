import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { IWeatherData } from '../../data/schema/weatherData';
import { IWeatherDataList } from '../../data/schema/weatherDataList';

@Injectable({
  providedIn: 'root'
})

// contains services for open weather API
export class WeatherService {

  // API data
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5/';
  private appID: string = 'fecc96b805bc547775f602f5a2e3f1e2';

  constructor(private http: HttpClient) {
  }

  // current weather API call
  getWeatherByCity(city: string): Observable<IWeatherData> {
    return this.http.get<IWeatherData>(`${this.baseUrl}weather?units=metric&q=${city}&appid=${this.appID}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // weather forecast API call
  getWeatherForecastByCity(city: string): Observable<IWeatherDataList> {
    return this.http.get<IWeatherDataList>(`${this.baseUrl}forecast?units=metric&q=${city}&appid=${this.appID}`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // common error handling for one service class. For multiple services HttpInterceptor would be right choice.
  handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
