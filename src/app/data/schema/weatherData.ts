interface  Main {
  temp: number;
}

interface  Weather {
  description?: string;
  icon?: string;
}

interface Wind {
  speed: number;
}

export interface IWeatherData {
  main: Main;
  wind?: Wind;
  weather?: Weather[];
  dt_txt?: string;
}
