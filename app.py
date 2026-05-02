import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


# 🔥 CORS fix
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # production me specific URL dena
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 🔥 model load
model = joblib.load("price_model.pkl")

# 📥 input structure
class PriceInput(BaseModel):
    distance: float
    noOfPeople: int
    ac: int
    food: int
    room: int
    category: int
    month: int
    dayType: int
    temperature: float
    humidity: float
    pressure: float
    windSpeed: float
    windDirection: float
    precipitation: float
    latitude: float
    longitude: float

# 🚀 prediction API
@app.post("/predict-price")
def predict_price(data: PriceInput):

    input_data = pd.DataFrame([{
        "distance": data.distance,
        "noOfPeople": data.noOfPeople,
        "ac": data.ac,
        "food": data.food,
        "room": data.room,
        "category": data.category,
        "month": data.month,
        "dayType": data.dayType,
        "temperature": data.temperature,
        "humidity": data.humidity,
        "pressure": data.pressure,
        "windSpeed": data.windSpeed,
        "windDirection": data.windDirection,
        "precipitation": data.precipitation,
        "latitude": data.latitude,
        "longitude": data.longitude
    }])

    prediction = model.predict(input_data)[0]

    return {
        "predictedPrice": round(float(prediction), 2)
    }