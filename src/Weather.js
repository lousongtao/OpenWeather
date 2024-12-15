import React from "react";
import {AutoComplete, Button, Form, Spin} from "antd";

const WeatherAPI = () => {
    const [city, setCity] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [cityList, setCityList] = React.useState([]); // query cities result if input some letters

    const api = "85de987be6ca9b72431b807e1822954e";
    const urlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=` + api;
    const urlCity = `https://api.openweathermap.org/geo/1.0/direct?limit=5&appid=` + api+ "&q=";
    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = urlWeather + "&lat="+city.lat+"&lon="+city.lon;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch the weather");
            }
            const data = await response.json();
            setResults(data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCity = async (value) => {
        setLoading(true);
        setError(null);
        try{
            const response = await fetch(urlCity+value);
            if (!response.ok) {
                throw new Error("Failed to fetch the city");
            }
            const data = await response.json();
            const cities = Array.from(new Set(data.map((item) => item.name + ", " + item.state + ", " + item.country)))
                .map(label => {
                    //find original data
                    const originalItem = data.find(item => label === item.name + ", " + item.state + ", " + item.country);
                    return {
                        city: originalItem.name,
                        state: originalItem.state,
                        country: originalItem.country,
                        label: label,
                        lat: originalItem.lat,
                        lon: originalItem.lon,
                        value: label
                    }
                });
            setCityList(cities);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearchCity = (value) => {
        setCity(value);
        if (value){
            fetchCity(value);
        } else {
            setCityList([]);
        }
    }

    const handleSelectCity = (selectedValue, city) => {
        setCity(city);
    }

    return (
        <div className="App">
            <Form onFinish={fetchWeather}>
                <Form.Item label="city" rules={[{required: true}]}>
                    <AutoComplete
                        onSearch={handleSearchCity}
                        options={cityList}
                        value={city}
                        onSelect={handleSelectCity}
                        allowClear
                        >
                    </AutoComplete>
                </Form.Item>
                <Button type="primary"
                        onClick={fetchWeather}
                        disabled={loading || !city}
                >
                    {loading ? <Spin /> : "Query"}
                </Button>
            </Form>


            {error && (
                <div>
                    {error}
                </div>
            )}
            {results && (
                <div>
                    {"weather: " + results.weather[0].main}
                    <br/>
                    {"temperature: " + (results.main.temp - 273.15).toFixed(2) + "°C"}
                </div>

            )}

        </div>
    )
}

export default WeatherAPI;