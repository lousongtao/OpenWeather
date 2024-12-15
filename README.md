# Getting Started with Open Weather

This project is published at: https://openweather.jerrylou.click/

## API key

The apiKey is stored in a .env file locally and did not push it in Github for security reasons. 
The Amplify can load this key in its parameters. 
I did not consider other special services for this key because this is a simple app.

## Functions

The input field can load up to 5 matched cities with the input value. While you choose one city and it can query the temperature. If you query one city not in its list, it can pop an error message.

This app requests the apis call directly to OpenWeather. I did not implement a server for it.
