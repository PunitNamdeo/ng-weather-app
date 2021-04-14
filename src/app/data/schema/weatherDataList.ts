import { IWeatherData } from './weatherData';

interface City {
  name: string;
  country: string;
}

export interface IWeatherDataList {
  list: IWeatherData[];
  city?: City;
}
