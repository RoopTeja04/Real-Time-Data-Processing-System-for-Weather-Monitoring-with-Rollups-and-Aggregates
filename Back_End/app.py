from flask import Flask, jsonify
from flask_cors import CORS
import requests
from database import WeatherData, Session
from datetime import datetime

app = Flask(__name__)
CORS(app) 

@app.route('/api/weather')
def get_weather():
    cities = ['Delhi', 'Mumbai', 'Chennai', 'Hyderabad', 'Bangalore', 'Kolkata']
    api_key = '79802fa8cfe11e9d14b052839fb57cf0'  

    weather_data = []
    session = Session()  

    for city in cities:
        response = requests.get(f'https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={api_key}')
        if response.status_code == 200:
            city_weather = response.json()
            weather_data.append({
                'city': city,
                'current_temp': city_weather['main']['temp'],
                'max_temp': city_weather['main']['temp_max'],
                'min_temp': city_weather['main']['temp_min'],
                'feels_like': city_weather['main']['feels_like'],
                'humidity': city_weather['main']['humidity'],
                'wind_speed': city_weather['wind']['speed'],
                'date_time': datetime.utcfromtimestamp(city_weather['dt']).isoformat(), 
                'condition': city_weather['weather'][0]['description']
            })

            new_data = WeatherData(
                date_time=datetime.utcfromtimestamp(city_weather['dt']),
                max_temp=city_weather['main']['temp_max'],
                min_temp=city_weather['main']['temp_min'],
                humidity=city_weather['main']['humidity'],
                wind_speed=city_weather['wind']['speed']
            )
            session.add(new_data)  

    session.commit()  
    session.close()   

    return jsonify(weather_data)

@app.route('/api/weather_data')
def get_weather_data():
    session = Session()
    data = session.query(WeatherData).all()
    session.close()
    
    return jsonify([{
        'date_time': wd.date_time.isoformat(),
        'max_temp': wd.max_temp,
        'min_temp': wd.min_temp,
        'humidity': wd.humidity,
        'wind_speed': wd.wind_speed
    } for wd in data])

if __name__ == '__main__':
    app.run(debug=True)