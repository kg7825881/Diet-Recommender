import { type NextRequest, NextResponse } from "next/server"

interface UserProfile {
  age: string
  gender: string
  weight: string
  height: string
  activityLevel: string
  goal: string
  dietaryRestrictions: string[]
}

interface NutritionalNeeds {
  calories: number
  protein: number
  carbs: number
  fats: number
}

export async function POST(request: NextRequest) {
  try {
    const profile: UserProfile = await request.json()

    // Calculate nutritional needs based on profile
    const nutritionalNeeds = calculateNutritionalNeeds(profile)

    // In a real implementation, you would:
    // 1. Load your trained model using joblib
    // 2. Process the nutritional needs through your ML model
    // 3. Get food recommendations from your dataset
    // 4. Return structured meal plans

    // For now, we'll return mock data that matches your expected structure
    const dietPlan = await generateMockDietPlan(nutritionalNeeds, profile)

    return NextResponse.json(dietPlan)
  } catch (error) {
    console.error("Diet planner API error:", error)
    return NextResponse.json({ error: "Failed to generate diet plan" }, { status: 500 })
  }
}

function calculateNutritionalNeeds(profile: UserProfile): NutritionalNeeds {
  const age = Number.parseInt(profile.age)
  const weight = Number.parseFloat(profile.weight)
  const height = Number.parseFloat(profile.height)

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr: number
  if (profile.gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  const multiplier = activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.2
  let calories = bmr * multiplier

  // Adjust based on goal
  switch (profile.goal) {
    case "weight_loss":
      calories -= 500 // 500 calorie deficit
      break
    case "weight_gain":
      calories += 500 // 500 calorie surplus
      break
    case "muscle_gain":
      calories += 300 // Moderate surplus for muscle gain
      break
    case "maintenance":
    case "general_health":
    default:
      // Keep calculated calories
      break
  }

  // Calculate macros
  const protein = Math.round((calories * 0.25) / 4) // 25% protein
  const fats = Math.round((calories * 0.3) / 9) // 30% fats
  const carbs = Math.round((calories * 0.45) / 4) // 45% carbs

  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fats,
  }
}

async function generateMockDietPlan(needs: NutritionalNeeds, profile: UserProfile) {
  // Mock Indian food data - replace with your actual ML model predictions
  const mockFoods = [
    {
      food_name: "Oats Upma with Vegetables",
      energy_kcal: 320,
      protein_g: 12,
      carb_g: 45,
      fat_g: 8,
      freesugar_g: 2,
      meal_type: "breakfast",
    },
    {
      food_name: "Moong Dal Khichdi",
      energy_kcal: 280,
      protein_g: 14,
      carb_g: 48,
      fat_g: 6,
      freesugar_g: 1,
      meal_type: "breakfast",
    },
    {
      food_name: "Vegetable Poha",
      energy_kcal: 250,
      protein_g: 8,
      carb_g: 42,
      fat_g: 7,
      freesugar_g: 3,
      meal_type: "breakfast",
    },
    {
      food_name: "Dal Tadka with Brown Rice",
      energy_kcal: 420,
      protein_g: 18,
      carb_g: 65,
      fat_g: 12,
      freesugar_g: 2,
      meal_type: "lunch",
    },
    {
      food_name: "Rajma Curry with Roti",
      energy_kcal: 380,
      protein_g: 16,
      carb_g: 55,
      fat_g: 10,
      freesugar_g: 4,
      meal_type: "lunch",
    },
    {
      food_name: "Vegetable Biryani",
      energy_kcal: 450,
      protein_g: 12,
      carb_g: 70,
      fat_g: 15,
      freesugar_g: 3,
      meal_type: "lunch",
    },
    {
      food_name: "Grilled Paneer with Vegetables",
      energy_kcal: 350,
      protein_g: 22,
      carb_g: 25,
      fat_g: 18,
      freesugar_g: 5,
      meal_type: "dinner",
    },
    {
      food_name: "Fish Curry with Rice",
      energy_kcal: 400,
      protein_g: 28,
      carb_g: 45,
      fat_g: 12,
      freesugar_g: 3,
      meal_type: "dinner",
    },
    {
      food_name: "Chicken Tikka with Salad",
      energy_kcal: 320,
      protein_g: 35,
      carb_g: 15,
      fat_g: 14,
      freesugar_g: 2,
      meal_type: "dinner",
    },
    {
      food_name: "Mixed Fruit Bowl",
      energy_kcal: 150,
      protein_g: 3,
      carb_g: 35,
      fat_g: 1,
      freesugar_g: 25,
      meal_type: "snacks",
    },
    {
      food_name: "Roasted Almonds",
      energy_kcal: 180,
      protein_g: 7,
      carb_g: 6,
      fat_g: 15,
      freesugar_g: 1,
      meal_type: "snacks",
    },
    {
      food_name: "Greek Yogurt with Berries",
      energy_kcal: 120,
      protein_g: 10,
      carb_g: 15,
      fat_g: 3,
      freesugar_g: 12,
      meal_type: "snacks",
    },
  ]

  // Filter foods based on dietary restrictions
  let filteredFoods = mockFoods
  if (profile.dietaryRestrictions.includes("vegetarian")) {
    filteredFoods = filteredFoods.filter(
      (food) => !food.food_name.toLowerCase().includes("fish") && !food.food_name.toLowerCase().includes("chicken"),
    )
  }
  if (profile.dietaryRestrictions.includes("vegan")) {
    filteredFoods = filteredFoods.filter(
      (food) =>
        !food.food_name.toLowerCase().includes("paneer") &&
        !food.food_name.toLowerCase().includes("yogurt") &&
        !food.food_name.toLowerCase().includes("fish") &&
        !food.food_name.toLowerCase().includes("chicken"),
    )
  }

  // Group foods by meal type
  const mealGroups = {
    breakfast: filteredFoods.filter((food) => food.meal_type === "breakfast"),
    lunch: filteredFoods.filter((food) => food.meal_type === "lunch"),
    dinner: filteredFoods.filter((food) => food.meal_type === "dinner"),
    snacks: filteredFoods.filter((food) => food.meal_type === "snacks"),
  }

  // Select meals for each type (you would use your ML model here)
  const selectedMeals = {
    breakfast: mealGroups.breakfast.slice(0, 2),
    lunch: mealGroups.lunch.slice(0, 2),
    dinner: mealGroups.dinner.slice(0, 2),
    snacks: mealGroups.snacks.slice(0, 3),
  }

  // Calculate nutritional summary
  const allMeals = Object.values(selectedMeals).flat()
  const nutritionalSummary = {
    total_calories: Math.round(allMeals.reduce((sum, meal) => sum + meal.energy_kcal, 0)),
    total_protein: Math.round(allMeals.reduce((sum, meal) => sum + meal.protein_g, 0)),
    total_carbs: Math.round(allMeals.reduce((sum, meal) => sum + meal.carb_g, 0)),
    total_fats: Math.round(allMeals.reduce((sum, meal) => sum + meal.fat_g, 0)),
  }

  return {
    daily_calories: needs.calories,
    daily_protein: needs.protein,
    daily_carbs: needs.carbs,
    daily_fats: needs.fats,
    meals: selectedMeals,
    nutritional_summary: nutritionalSummary,
  }
}
