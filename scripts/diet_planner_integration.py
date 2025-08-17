"""
Diet Planner ML Model Integration Script
This script shows how to integrate your trained model with the API
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.neighbors import NearestNeighbors
import joblib
import json

def train_diet_model():
    """Train the diet planner model"""
    print("🚀 Starting Diet Planner model training...")
    
    # Load dataset
    data_path = "models/anuvaad_dataset.csv"
    df = pd.read_csv(data_path, encoding='ISO-8859-1')
    
    # Select features and target
    features = ['energy_kj', 'energy_kcal', 'carb_g', 'protein_g', 'fat_g', 'freesugar_g']
    target = 'food_name'
    
    # Clean dataset: drop rows with missing values
    df = df.dropna(subset=features + [target])
    
    # Features matrix
    X = df[features].values
    
    # Target labels
    y = df[target].values
    
    # Label encode food names
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    
    # Use NearestNeighbors for meal recommendation
    nn_model = NearestNeighbors(n_neighbors=5, algorithm='auto')
    nn_model.fit(X)
    
    # Save model and label encoder
    joblib.dump(nn_model, 'models/diet_planner_model.pkl')
    joblib.dump(le, 'models/diet_planner_label_encoder.pkl')
    joblib.dump(df, 'models/food_dataset.pkl')
    
    print("✅ Diet Planner model trained and saved!")
    return nn_model, le, df

def get_meal_recommendations(target_calories, target_protein, target_carbs, target_fat, meal_type="lunch"):
    """Get meal recommendations based on nutritional targets"""
    try:
        # Load trained model and data
        nn_model = joblib.load('models/diet_planner_model.pkl')
        le = joblib.load('models/diet_planner_label_encoder.pkl')
        df = joblib.load('models/food_dataset.pkl')
        
        # Create target nutritional profile
        # Convert kcal to kj (multiply by 4.184)
        target_profile = np.array([[
            target_calories * 4.184,  # energy_kj
            target_calories,          # energy_kcal
            target_carbs,            # carb_g
            target_protein,          # protein_g
            target_fat,              # fat_g
            target_carbs * 0.1       # freesugar_g (estimate)
        ]])
        
        # Find nearest neighbors
        distances, indices = nn_model.kneighbors(target_profile)
        
        # Get recommended foods
        recommended_foods = []
        for idx in indices[0]:
            food_data = df.iloc[idx]
            recommended_foods.append({
                'food_name': food_data['food_name'],
                'energy_kcal': food_data['energy_kcal'],
                'protein_g': food_data['protein_g'],
                'carb_g': food_data['carb_g'],
                'fat_g': food_data['fat_g'],
                'freesugar_g': food_data['freesugar_g'],
                'meal_type': meal_type
            })
        
        return recommended_foods
    
    except Exception as e:
        print(f"Error getting recommendations: {e}")
        return []

def calculate_bmr(age, gender, weight, height):
    """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
    if gender.lower() == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    return bmr

def calculate_daily_needs(profile):
    """Calculate daily nutritional needs based on user profile"""
    age = int(profile['age'])
    weight = float(profile['weight'])
    height = float(profile['height'])
    gender = profile['gender']
    activity_level = profile['activityLevel']
    goal = profile['goal']
    
    # Calculate BMR
    bmr = calculate_bmr(age, gender, weight, height)
    
    # Activity multipliers
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    
    multiplier = activity_multipliers.get(activity_level, 1.2)
    calories = bmr * multiplier
    
    # Adjust based on goal
    if goal == 'weight_loss':
        calories -= 500
    elif goal == 'weight_gain':
        calories += 500
    elif goal == 'muscle_gain':
        calories += 300
    
    # Calculate macros
    protein = (calories * 0.25) / 4  # 25% protein
    fats = (calories * 0.3) / 9      # 30% fats
    carbs = (calories * 0.45) / 4    # 45% carbs
    
    return {
        'calories': int(calories),
        'protein': int(protein),
        'carbs': int(carbs),
        'fats': int(fats)
    }

def generate_diet_plan(profile):
    """Generate complete diet plan for user"""
    # Calculate nutritional needs
    needs = calculate_daily_needs(profile)
    
    # Distribute calories across meals
    meal_distribution = {
        'breakfast': 0.25,  # 25% of daily calories
        'lunch': 0.35,      # 35% of daily calories
        'dinner': 0.30,     # 30% of daily calories
        'snacks': 0.10      # 10% of daily calories
    }
    
    diet_plan = {
        'daily_calories': needs['calories'],
        'daily_protein': needs['protein'],
        'daily_carbs': needs['carbs'],
        'daily_fats': needs['fats'],
        'meals': {}
    }
    
    # Generate meals for each type
    for meal_type, percentage in meal_distribution.items():
        meal_calories = int(needs['calories'] * percentage)
        meal_protein = int(needs['protein'] * percentage)
        meal_carbs = int(needs['carbs'] * percentage)
        meal_fats = int(needs['fats'] * percentage)
        
        recommendations = get_meal_recommendations(
            meal_calories, meal_protein, meal_carbs, meal_fats, meal_type
        )
        
        diet_plan['meals'][meal_type] = recommendations[:3]  # Top 3 recommendations
    
    return diet_plan

# Example usage
if __name__ == "__main__":
    # Train model (run once)
    train_diet_model()
    
    # Example profile
    sample_profile = {
        'age': '25',
        'gender': 'male',
        'weight': '70',
        'height': '175',
        'activityLevel': 'moderate',
        'goal': 'muscle_gain',
        'dietaryRestrictions': ['vegetarian']
    }
    
    # Generate diet plan
    plan = generate_diet_plan(sample_profile)
    print(json.dumps(plan, indent=2))
