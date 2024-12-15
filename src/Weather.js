import React from "react";
import {AutoComplete, Button, Form, Spin, Typography} from "antd";

const WeatherAPI = () => {
    const [city, setCity] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [weather, setWeather] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [cityList, setCityList] = React.useState([]); // used for selector component

    const api = process.env.REACT_APP_OpenWeatherAPI;
    const urlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${api}`;
    const urlCity = `https://api.openweathermap.org/geo/1.0/direct?limit=5&appid=${api}&q=`;
    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        if (!city.lat || !city.lon) {
            setError("Please select a city from list.");
            setLoading(false);
            return;
        }
        try {
            const url = urlWeather + "&lat="+city.lat+"&lon="+city.lon;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch the weather");
            }
            const data = await response.json();
            setWeather(data);
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
            // remove the duplicate with a Set
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
            setWeather(null);
            setCityList([]);
        }
    }

    const handleSelectCity = (selectedValue, city) => {
        setCity(city);
    }

    return (
        <div className="App">
            <Form
                onFinish={fetchWeather}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
            >
                <Form.Item label="City" rules={[{required: true}]}>
                    <AutoComplete
                        onSearch={handleSearchCity}
                        options={cityList}
                        value={city}
                        onSelect={handleSelectCity}
                        allowClear
                        >
                    </AutoComplete>
                </Form.Item>
                <Form.Item label={null}>
                    <Button type="primary"
                            onClick={fetchWeather}
                            disabled={loading || !city}
                    >
                        {loading ? <Spin /> : "Query"}
                    </Button>
                </Form.Item>

            </Form>


            {error && (
                <div>
                    <Typography.Title level={4} type="danger">{error}</Typography.Title>
                </div>
            )}
            {weather && city && (
                <div>
                    <Typography.Title level={4} style={{display: 'inline', marginRight: 8}}>Weather: </Typography.Title>
                    <Typography.Text mark style={{display: 'inline'}}>{weather.weather[0].main}</Typography.Text>
                    <br/>
                    <Typography.Title level={4} style={{display: 'inline', marginRight: 8}}>Temperature: </Typography.Title>
                    <Typography.Text mark style={{display: 'inline'}}>{(weather.main.temp - 273.15).toFixed(2) + "°C"}</Typography.Text>
                </div>

            )}

        </div>
    )
}

export default WeatherAPI;