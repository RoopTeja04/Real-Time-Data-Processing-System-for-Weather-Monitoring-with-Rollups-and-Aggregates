from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///weather_data.db"
engine = create_engine( DATABASE_URL )

Base = declarative_base()

class WeatherData(Base):
    __tablename__ = 'weather_data'
    
    id = Column(Integer, primary_key = True)
    date_time = Column(DateTime, default = datetime.utcnow)
    max_temp = Column(Float)
    min_temp = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)

Base.metadata.create_all(engine)

Session = sessionmaker(bind = engine)
