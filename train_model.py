import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score


# =========================
# LOAD CSV
# =========================
df = pd.read_csv("tour_price_data.csv")


# =========================
# BASIC CLEANING
# =========================
df = df.dropna().copy()

# Agar finalPrice me bahut bade outliers hain to hata do
# apne project ke hisaab se max value change kar sakte ho
df = df[(df["finalPrice"] >= 500) & (df["finalPrice"] <= 20000)].copy()


# =========================
# ENCODE CATEGORICAL COLUMNS
# =========================
le_category = LabelEncoder()
df["category"] = le_category.fit_transform(df["category"].astype(str))

le_day = LabelEncoder()
df["dayType"] = le_day.fit_transform(df["dayType"].astype(str))


# =========================
# FEATURES / TARGET
# =========================
X = df.drop("finalPrice", axis=1)
y = df["finalPrice"]

# Extra safety: target ko bhi realistic range me clip kar do
y = y.clip(500, 20000)


# =========================
# TRAIN TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


# =========================
# MODEL
# =========================
model = RandomForestRegressor(
    n_estimators=150,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)

model.fit(X_train, y_train)


# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test)

# Prediction ko realistic range me rakho
y_pred = pd.Series(y_pred).clip(500, 20000)

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("✅ Model trained successfully")
print(f"MAE: {mae:.2f}")
print(f"R2 Score: {r2:.2f}")


# =========================
# SAVE MODEL + ENCODERS + COLUMNS
# =========================
joblib.dump(model, "price_model.pkl")
joblib.dump(le_category, "category_encoder.pkl")
joblib.dump(le_day, "daytype_encoder.pkl")
joblib.dump(list(X.columns), "model_columns.pkl")

print("✅ Model and encoders saved successfully")


# =========================
# OPTIONAL TEST PREDICTION
# =========================
try:
    sample_input = X_test.iloc[[0]].copy()
    sample_prediction = model.predict(sample_input)[0]
    sample_prediction = max(500, min(20000, round(sample_prediction)))

    print("✅ Sample prediction:", sample_prediction)
except Exception as e:
    print("Sample prediction error:", e)