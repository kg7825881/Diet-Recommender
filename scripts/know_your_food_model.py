"""
Know Your Food ML Model Training Script
This script trains a model to classify and analyze Indian foods from the anuvaad dataset
"""

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import os
import numpy as np

print("🚀 Know Your Food Model Training Started")

# Define the CSV file path
data_path = os.path.join("models", "anuvaad_dataset.csv")
print(f"📄 Loading dataset from {data_path}")

# Load the dataset
df = pd.read_csv(data_path, encoding='ISO-8859-1')

# Clean and prepare the data
print("🧹 Cleaning dataset...")
# Drop rows with missing values in essential columns
essential_columns = ['food_name', 'energy_kj', 'energy_kcal', 'carb_g', 'protein_g', 'fat_g']
df = df.dropna(subset=essential_columns)

# Fill missing values for optional nutrients
df['freesugar_g'] = df['freesugar_g'].fillna(0)
df['fiber_g'] = df['fiber_g'].fillna(0)
df['sodium_mg'] = df['sodium_mg'].fillna(0)
df['calcium_mg'] = df['calcium_mg'].fillna(0)
df['iron_mg'] = df['iron_mg'].fillna(0)
df['vitaminc_mg'] = df['vitaminc_mg'].fillna(0)

print("✅ Dataset loaded and cleaned!")
print(f"📊 Dataset shape: {df.shape}")
print(f"🍽️ Number of unique foods: {df['food_name'].nunique()}")

# Create nutritional categories based on macronutrient composition
def categorize_food(row):
    """Categorize food based on nutritional composition"""
    calories = row['energy_kcal']
    protein = row['protein_g']
    carbs = row['carb_g']
    fat = row['fat_g']
    
    if calories <= 0:
        return 'Unknown'
    
    # Calculate percentages of calories from each macronutrient
    protein_pct = (protein * 4 / calories) * 100
    fat_pct = (fat * 9 / calories) * 100
    carb_pct = (carbs * 4 / calories) * 100
    
    # Categorization logic
    if protein_pct >= 25:
        return 'High Protein'
    elif fat_pct >= 45:
        return 'High Fat'
    elif carb_pct >= 65:
        return 'High Carbohydrate'
    elif calories <= 100:
        return 'Low Calorie'
    elif calories >= 400:
        return 'High Calorie'
    else:
        return 'Balanced'

# Add nutritional category
df['nutritional_category'] = df.apply(categorize_food, axis=1)

print("🏷️ Nutritional category distribution:")
print(df['nutritional_category'].value_counts())

# Create health score (0-100)
def calculate_health_score(row):
    """Calculate health score based on nutritional profile"""
    score = 50  # Base score
    
    calories = row['energy_kcal']
    protein = row['protein_g']
    fat = row['fat_g']
    sugar = row['freesugar_g']
    fiber = row['fiber_g']
    sodium = row['sodium_mg']
    
    # Protein bonus (higher protein is generally better)
    if protein >= 20:
        score += 25
    elif protein >= 15:
        score += 20
    elif protein >= 10:
        score += 15
    elif protein >= 5:
        score += 10
    
    # Calorie consideration (moderate calories preferred)
    if 100 <= calories <= 250:
        score += 15
    elif 250 < calories <= 350:
        score += 10
    elif calories > 500:
        score -= 20
    elif calories > 400:
        score -= 10
    
    # Fat consideration (moderate fat is okay)
    if fat <= 5:
        score += 10
    elif fat <= 15:
        score += 5
    elif fat > 25:
        score -= 15
    elif fat > 35:
        score -= 25
    
    # Sugar penalty (less sugar is better)
    if sugar <= 2:
        score += 15
    elif sugar <= 5:
        score += 10
    elif sugar <= 10:
        score += 5
    elif sugar > 20:
        score -= 20
    elif sugar > 15:
        score -= 15
    
    # Fiber bonus (more fiber is better)
    if fiber >= 10:
        score += 20
    elif fiber >= 5:
        score += 15
    elif fiber >= 3:
        score += 10
    
    # Sodium consideration (less sodium is better)
    if sodium <= 200:
        score += 10
    elif sodium <= 400:
        score += 5
    elif sodium > 1000:
        score -= 15
    elif sodium > 800:
        score -= 10
    
    return max(0, min(100, score))

df['health_score'] = df.apply(calculate_health_score, axis=1)

print(f"📊 Health score statistics:")
print(f"   Mean: {df['health_score'].mean():.1f}")
print(f"   Min: {df['health_score'].min()}")
print(f"   Max: {df['health_score'].max()}")

# Features for the model
features = ['energy_kj', 'energy_kcal', 'carb_g', 'protein_g', 'fat_g', 'freesugar_g', 'fiber_g']
target = 'food_name'

# Prepare data for training
X = df[features].fillna(0)  # Fill any remaining NaN values
y = df[target]

# Only keep foods that appear multiple times for better training
food_counts = y.value_counts()
valid_foods = food_counts[food_counts >= 2].index
mask = y.isin(valid_foods)
X = X[mask]
y = y[mask]

print(f"🎯 Number of foods for training: {len(valid_foods)}")
print(f"📊 Training samples: {len(X)}")

# Encode target labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded)

print(f"📊 Training set size: {X_train.shape[0]}")
print(f"📊 Test set size: {X_test.shape[0]}")

# Train model
print("🤖 Training Random Forest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=10)
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
test_accuracy = accuracy_score(y_test, y_pred)

print(f"🎯 Test Accuracy: {test_accuracy:.3f}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n🔍 Feature Importance:")
print(feature_importance)

# Create models directory if it doesn't exist
os.makedirs("models", exist_ok=True)

# Save model and encoder
model_path = os.path.join("models", "know_your_food_model.pkl")
encoder_path = os.path.join("models", "food_label_encoder.pkl")

joblib.dump(model, model_path)
joblib.dump(encoder, encoder_path)

print(f"💾 Model saved to: {model_path}")
print(f"💾 Encoder saved to: {encoder_path}")

# Save the enhanced dataset
enhanced_data_path = os.path.join("models", "enhanced_food_dataset.csv")
df.to_csv(enhanced_data_path, index=False)
print(f"💾 Enhanced dataset saved to: {enhanced_data_path}")

# Create food recommendation system
print("\n📋 Creating food recommendation system...")

def recommend_similar_foods(target_food_name, top_n=5):
    """Find foods similar to the target food"""
    if target_food_name not in df['food_name'].values:
        return []
    
    target_row = df[df['food_name'] == target_food_name].iloc[0]
    target_features = target_row[features].values
    
    # Calculate similarity scores
    similarities = []
    for idx, row in df.iterrows():
        if row['food_name'] == target_food_name:
            continue
        
        food_features = row[features].values
        
        # Calculate normalized Euclidean distance
        distance = np.sqrt(np.sum((target_features - food_features) ** 2))
        similarity = 1 / (1 + distance)  # Convert distance to similarity
        
        similarities.append({
            'food_name': row['food_name'],
            'similarity': similarity,
            'energy_kcal': row['energy_kcal'],
            'health_score': row['health_score'],
            'nutritional_category': row['nutritional_category']
        })
    
    # Sort by similarity and return top N
    similarities.sort(key=lambda x: x['similarity'], reverse=True)
    return similarities[:top_n]

# Test recommendation system
print("\n🎯 Testing food recommendation system:")
sample_foods = df['food_name'].unique()[:5]

for food in sample_foods:
    similar_foods = recommend_similar_foods(food, 3)
    print(f"\n🍽️ Foods similar to '{food}':")
    for similar in similar_foods:
        print(f"   • {similar['food_name']} (similarity: {similar['similarity']:.2f}, {similar['energy_kcal']:.0f} kcal)")

print("\n✅ Know Your Food model training completed successfully!")
print("🎉 Ready to analyze Indian foods with nutritional insights!")

# Save food database for API
food_database = []
for idx, row in df.iterrows():
    food_entry = {
        'name': row['food_name'],
        'energy_kcal': float(row['energy_kcal']),
        'energy_kj': float(row['energy_kj']),
        'protein_g': float(row['protein_g']),
        'carb_g': float(row['carb_g']),
        'fat_g': float(row['fat_g']),
        'freesugar_g': float(row['freesugar_g']),
        'fiber_g': float(row['fiber_g']),
        'sodium_mg': float(row['sodium_mg']) if pd.notna(row['sodium_mg']) else 0,
        'calcium_mg': float(row['calcium_mg']) if pd.notna(row['calcium_mg']) else 0,
        'iron_mg': float(row['iron_mg']) if pd.notna(row['iron_mg']) else 0,
        'vitaminc_mg': float(row['vitaminc_mg']) if pd.notna(row['vitaminc_mg']) else 0,
        'health_score': int(row['health_score']),
        'nutritional_category': row['nutritional_category']
    }
    food_database.append(food_entry)

# Save as JSON for easy API access
import json
food_db_path = os.path.join("models", "food_database.json")
with open(food_db_path, 'w') as f:
    json.dump(food_database, f, indent=2)

print(f"💾 Food database saved to: {food_db_path}")
print(f"📊 Total foods in database: {len(food_database)}")
