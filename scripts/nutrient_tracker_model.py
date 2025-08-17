"""
Nutrient Tracker ML Model Training Script
This script trains a model to classify nutrient intake status and provide recommendations
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

print("🚀 Nutrient Tracker Model Training Started")

# Define the CSV file path
data_path = os.path.join("models", "anuvaad_dataset.csv")
print(f"📄 Loading dataset from {data_path}")

# Load the dataset
df = pd.read_csv(data_path, encoding="ISO-8859-1")

# Drop rows with missing values in essential columns
df.dropna(subset=['food_name', 'energy_kj', 'energy_kcal', 'carb_g', 'protein_g', 'fat_g', 'freesugar_g'], inplace=True)

print("✅ Dataset loaded and cleaned!")
print(f"📊 Dataset shape: {df.shape}")
print(f"🍽️ Number of unique foods: {df['food_name'].nunique()}")

# Define thresholds for Ideal / Excess / Deficient for each nutrient (per 100g serving)
thresholds = {
    'energy_kcal': (50, 250),   # Ideal between 50 and 250 kcal per serving
    'carb_g': (10, 50),         # Ideal between 10 and 50 g carbs
    'protein_g': (5, 20),       # Ideal between 5 and 20 g protein
    'fat_g': (3, 15),           # Ideal between 3 and 15 g fat
    'freesugar_g': (0, 10)      # Ideal less than 10 g free sugar
}

# Function to classify each nutrient value
def classify_nutrient(value, nutrient):
    """Classify nutrient value as Deficient, Ideal, or Excess"""
    low, high = thresholds[nutrient]
    if value < low:
        return 'Deficient'
    elif value > high:
        return 'Excess'
    else:
        return 'Ideal'

# Create individual nutrient status columns
for nutrient in thresholds.keys():
    df[f'{nutrient}_status'] = df[nutrient].apply(lambda x: classify_nutrient(x, nutrient))

# Create a combined target column by combining nutrient statuses
def combined_status(row):
    """Determine overall nutritional status based on individual nutrients"""
    statuses = [classify_nutrient(row[n], n) for n in thresholds.keys()]
    
    # If any nutrient is Excess, overall is Excess
    # Else if any Deficient, overall Deficient
    # Else Ideal
    if 'Excess' in statuses:
        return 'Excess'
    elif 'Deficient' in statuses:
        return 'Deficient'
    else:
        return 'Ideal'

# Add combined target column
df['nutrient_status'] = df.apply(combined_status, axis=1)

print("🏷️ Nutrient status distribution:")
print(df['nutrient_status'].value_counts())

# Features and target
features = ['energy_kcal', 'carb_g', 'protein_g', 'fat_g', 'freesugar_g']
X = df[features]
y = df['nutrient_status']

# Encode target labels
le = LabelEncoder()
y_encoded = le.fit_transform(y)

print(f"🎯 Target classes: {le.classes_}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)

print(f"📊 Training set size: {X_train.shape[0]}")
print(f"📊 Test set size: {X_test.shape[0]}")

# Train model
print("🤖 Training Random Forest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"🎯 Model Accuracy: {accuracy:.3f}")
print("\n📈 Classification Report:")
print(classification_report(y_test, y_pred, target_names=le.classes_))

# Feature importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n🔍 Feature Importance:")
print(feature_importance)

# Save model and label encoder
model_path = os.path.join("models", "nutrient_tracker_model.pkl")
encoder_path = os.path.join("models", "nutrient_tracker_label_encoder.pkl")

# Create models directory if it doesn't exist
os.makedirs("models", exist_ok=True)

joblib.dump(model, model_path)
joblib.dump(le, encoder_path)

print(f"💾 Model saved to: {model_path}")
print(f"💾 Label encoder saved to: {encoder_path}")

# Test the model with sample data
print("\n🧪 Testing model with sample predictions:")

# Sample Indian food nutritional values
test_samples = [
    [202, 36, 6, 4, 1],    # Chapati - should be Ideal
    [577, 9, 2, 59, 0],    # Samosa - should be Excess (high fat)
    [138, 28, 5, 0, 0],    # Idli - should be Ideal
    [50, 5, 2, 1, 0],      # Low nutrition - should be Deficient
]

test_names = ["Chapati", "Samosa", "Idli", "Low Nutrition Food"]

for i, sample in enumerate(test_samples):
    prediction = model.predict([sample])[0]
    predicted_class = le.inverse_transform([prediction])[0]
    probability = model.predict_proba([sample])[0]
    max_prob = max(probability)
    
    print(f"🍽️ {test_names[i]}: {predicted_class} (confidence: {max_prob:.2f})")

print("\n✅ Nutrient Tracker model training completed successfully!")

# Additional analysis - create nutrient recommendation rules
print("\n📋 Creating nutrient recommendation rules...")

def generate_recommendations(nutrient_values):
    """Generate recommendations based on nutrient values"""
    recommendations = []
    
    calories, carbs, protein, fat, sugar = nutrient_values
    
    # Calorie recommendations
    if calories < 50:
        recommendations.append("Increase calorie intake with nutrient-dense foods")
    elif calories > 250:
        recommendations.append("Consider portion control to manage calorie intake")
    
    # Protein recommendations
    if protein < 5:
        recommendations.append("Add more protein sources like dal, paneer, or eggs")
    elif protein > 20:
        recommendations.append("Balance protein with more vegetables and grains")
    
    # Carbohydrate recommendations
    if carbs < 10:
        recommendations.append("Include more complex carbs like brown rice or whole wheat")
    elif carbs > 50:
        recommendations.append("Reduce refined carbs and focus on fiber-rich options")
    
    # Fat recommendations
    if fat < 3:
        recommendations.append("Add healthy fats from nuts, seeds, or ghee")
    elif fat > 15:
        recommendations.append("Limit fried foods and use healthier cooking methods")
    
    # Sugar recommendations
    if sugar > 10:
        recommendations.append("Reduce sugar intake and choose natural sweeteners")
    
    return recommendations

# Test recommendation system
print("\n🎯 Testing recommendation system:")
for i, sample in enumerate(test_samples):
    recs = generate_recommendations(sample)
    print(f"\n🍽️ {test_names[i]} recommendations:")
    for rec in recs:
        print(f"   • {rec}")

print("\n🎉 All systems ready for Nutrient Tracker!")
