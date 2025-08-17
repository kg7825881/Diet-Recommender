import { type NextRequest, NextResponse } from "next/server"

// Food database with Indian foods from anuvaad dataset
const foodDatabase = [
  {
    name: "Dal (Cooked)",
    energy_kcal: 116,
    energy_kj: 485,
    protein_g: 8.7,
    carb_g: 19.3,
    fat_g: 0.4,
    freesugar_g: 0.5,
    fiber_g: 7.6,
    sodium_mg: 5,
    calcium_mg: 27,
    iron_mg: 2.6,
    vitaminc_mg: 0,
    health_score: 85,
    nutritional_category: "High Protein",
  },
  {
    name: "Chapati/Roti",
    energy_kcal: 297,
    energy_kj: 1243,
    protein_g: 11.8,
    carb_g: 55.8,
    fat_g: 4.4,
    freesugar_g: 2.1,
    fiber_g: 11.5,
    sodium_mg: 558,
    calcium_mg: 81,
    iron_mg: 4.9,
    vitaminc_mg: 0,
    health_score: 78,
    nutritional_category: "High Carbohydrate",
  },
  {
    name: "Boiled Rice",
    energy_kcal: 130,
    energy_kj: 544,
    protein_g: 2.7,
    carb_g: 28.2,
    fat_g: 0.3,
    freesugar_g: 0.1,
    fiber_g: 0.4,
    sodium_mg: 1,
    calcium_mg: 10,
    iron_mg: 0.8,
    vitaminc_mg: 0,
    health_score: 65,
    nutritional_category: "High Carbohydrate",
  },
  {
    name: "Paneer Curry",
    energy_kcal: 265,
    energy_kj: 1109,
    protein_g: 18.3,
    carb_g: 6.7,
    fat_g: 20.8,
    freesugar_g: 4.2,
    fiber_g: 1.2,
    sodium_mg: 372,
    calcium_mg: 208,
    iron_mg: 0.9,
    vitaminc_mg: 2.8,
    health_score: 72,
    nutritional_category: "High Protein",
  },
  {
    name: "Chicken Curry",
    energy_kcal: 180,
    energy_kj: 753,
    protein_g: 25.8,
    carb_g: 3.2,
    fat_g: 7.5,
    freesugar_g: 2.1,
    fiber_g: 0.8,
    sodium_mg: 294,
    calcium_mg: 15,
    iron_mg: 1.3,
    vitaminc_mg: 1.5,
    health_score: 82,
    nutritional_category: "High Protein",
  },
  {
    name: "Samosa",
    energy_kcal: 308,
    energy_kj: 1289,
    protein_g: 6.4,
    carb_g: 32.7,
    fat_g: 17.8,
    freesugar_g: 1.2,
    fiber_g: 3.1,
    sodium_mg: 422,
    calcium_mg: 23,
    iron_mg: 1.8,
    vitaminc_mg: 0.5,
    health_score: 35,
    nutritional_category: "High Fat",
  },
  {
    name: "Idli",
    energy_kcal: 166,
    energy_kj: 695,
    protein_g: 4.6,
    carb_g: 35.4,
    fat_g: 0.8,
    freesugar_g: 0.3,
    fiber_g: 1.9,
    sodium_mg: 6,
    calcium_mg: 18,
    iron_mg: 1.1,
    vitaminc_mg: 0,
    health_score: 75,
    nutritional_category: "High Carbohydrate",
  },
  {
    name: "Dosa",
    energy_kcal: 168,
    energy_kj: 703,
    protein_g: 4.1,
    carb_g: 33.1,
    fat_g: 2.6,
    freesugar_g: 0.4,
    fiber_g: 1.2,
    sodium_mg: 7,
    calcium_mg: 20,
    iron_mg: 1.4,
    vitaminc_mg: 0,
    health_score: 70,
    nutritional_category: "High Carbohydrate",
  },
  {
    name: "Biryani",
    energy_kcal: 200,
    energy_kj: 837,
    protein_g: 8.1,
    carb_g: 35.2,
    fat_g: 4.5,
    freesugar_g: 1.8,
    fiber_g: 1.8,
    sodium_mg: 398,
    calcium_mg: 28,
    iron_mg: 1.9,
    vitaminc_mg: 2.1,
    health_score: 68,
    nutritional_category: "Balanced",
  },
  {
    name: "Rajma (Kidney Bean Curry)",
    energy_kcal: 127,
    energy_kj: 532,
    protein_g: 8.7,
    carb_g: 22.8,
    fat_g: 0.5,
    freesugar_g: 0.6,
    fiber_g: 6.4,
    sodium_mg: 12,
    calcium_mg: 28,
    iron_mg: 2.9,
    vitaminc_mg: 1.2,
    health_score: 88,
    nutritional_category: "High Protein",
  },
  {
    name: "Chole (Chickpea Curry)",
    energy_kcal: 164,
    energy_kj: 686,
    protein_g: 8.9,
    carb_g: 27.4,
    fat_g: 2.6,
    freesugar_g: 4.8,
    fiber_g: 7.6,
    sodium_mg: 318,
    calcium_mg: 49,
    iron_mg: 2.9,
    vitaminc_mg: 4.0,
    health_score: 80,
    nutritional_category: "High Protein",
  },
  {
    name: "Aloo Gobi",
    energy_kcal: 89,
    energy_kj: 372,
    protein_g: 2.8,
    carb_g: 16.8,
    fat_g: 2.1,
    freesugar_g: 3.2,
    fiber_g: 3.4,
    sodium_mg: 294,
    calcium_mg: 22,
    iron_mg: 0.8,
    vitaminc_mg: 28.1,
    health_score: 76,
    nutritional_category: "Low Calorie",
  },
  {
    name: "Palak Paneer",
    energy_kcal: 180,
    energy_kj: 753,
    protein_g: 11.2,
    carb_g: 7.4,
    fat_g: 13.6,
    freesugar_g: 3.1,
    fiber_g: 2.8,
    sodium_mg: 312,
    calcium_mg: 184,
    iron_mg: 2.7,
    vitaminc_mg: 9.8,
    health_score: 74,
    nutritional_category: "High Protein",
  },
  {
    name: "Butter Chicken",
    energy_kcal: 438,
    energy_kj: 1833,
    protein_g: 25.9,
    carb_g: 6.1,
    fat_g: 35.8,
    freesugar_g: 4.2,
    fiber_g: 0.9,
    sodium_mg: 588,
    calcium_mg: 41,
    iron_mg: 1.8,
    vitaminc_mg: 1.2,
    health_score: 45,
    nutritional_category: "High Fat",
  },
  {
    name: "Masala Dosa",
    energy_kcal: 188,
    energy_kj: 787,
    protein_g: 4.8,
    carb_g: 35.6,
    fat_g: 3.8,
    freesugar_g: 0.6,
    fiber_g: 2.1,
    sodium_mg: 298,
    calcium_mg: 24,
    iron_mg: 1.6,
    vitaminc_mg: 2.4,
    health_score: 72,
    nutritional_category: "High Carbohydrate",
  },
  {
    name: "Upma",
    energy_kcal: 158,
    energy_kj: 661,
    protein_g: 4.2,
    carb_g: 28.9,
    fat_g: 3.8,
    freesugar_g: 1.2,
    fiber_g: 2.4,
    sodium_mg: 412,
    calcium_mg: 18,
    iron_mg: 1.9,
    vitaminc_mg: 3.2,
    health_score: 69,
    nutritional_category: "High Carbohydrate",
  },
  {
    name: "Poha",
    energy_kcal: 130,
    energy_kj: 544,
    protein_g: 2.6,
    carb_g: 26.9,
    fat_g: 1.8,
    freesugar_g: 0.8,
    fiber_g: 1.6,
    sodium_mg: 298,
    calcium_mg: 12,
    iron_mg: 20.0,
    vitaminc_mg: 8.4,
    health_score: 71,
    nutritional_category: "High Carbohydrate",
  },
  {
    name: "Khichdi",
    energy_kcal: 120,
    energy_kj: 502,
    protein_g: 4.4,
    carb_g: 23.0,
    fat_g: 0.9,
    freesugar_g: 0.4,
    fiber_g: 1.8,
    sodium_mg: 6,
    calcium_mg: 17,
    iron_mg: 1.4,
    vitaminc_mg: 0,
    health_score: 79,
    nutritional_category: "Balanced",
  },
  {
    name: "Paratha",
    energy_kcal: 320,
    energy_kj: 1339,
    protein_g: 8.1,
    carb_g: 43.2,
    fat_g: 13.6,
    freesugar_g: 1.8,
    fiber_g: 3.4,
    sodium_mg: 423,
    calcium_mg: 62,
    iron_mg: 2.8,
    vitaminc_mg: 0,
    health_score: 58,
    nutritional_category: "High Fat",
  },
  {
    name: "Lassi",
    energy_kcal: 89,
    energy_kj: 372,
    protein_g: 3.2,
    carb_g: 13.6,
    fat_g: 2.5,
    freesugar_g: 13.0,
    fiber_g: 0,
    sodium_mg: 46,
    calcium_mg: 149,
    iron_mg: 0.1,
    vitaminc_mg: 0.8,
    health_score: 62,
    nutritional_category: "Low Calorie",
  },
]

// Generate recommendations based on nutritional analysis
function generateRecommendations(food: any): string[] {
  const recommendations: string[] = []

  // Calorie-based recommendations
  if (food.energy_kcal > 400) {
    recommendations.push("🔥 High calorie food - consume in smaller portions or as an occasional treat")
  } else if (food.energy_kcal < 100) {
    recommendations.push("✅ Low calorie option - great for weight management")
  }

  // Protein recommendations
  if (food.protein_g >= 15) {
    recommendations.push("💪 Excellent protein source - great for muscle building and satiety")
  } else if (food.protein_g >= 8) {
    recommendations.push("👍 Good protein content - pair with other protein sources for complete nutrition")
  } else if (food.protein_g < 5) {
    recommendations.push("⚠️ Low protein - consider adding protein-rich foods like dal, paneer, or chicken")
  }

  // Fat recommendations
  if (food.fat_g > 20) {
    recommendations.push("🟡 High fat content - balance with low-fat foods throughout the day")
  } else if (food.fat_g < 3) {
    recommendations.push("✅ Low fat option - good for heart health")
  }

  // Sugar recommendations
  if (food.freesugar_g > 10) {
    recommendations.push("⚠️ High sugar content - limit consumption, especially if diabetic")
  } else if (food.freesugar_g < 2) {
    recommendations.push("✅ Low sugar content - diabetes-friendly option")
  }

  // Fiber recommendations
  if (food.fiber_g >= 5) {
    recommendations.push("🌾 High fiber content - excellent for digestive health and blood sugar control")
  } else if (food.fiber_g < 2) {
    recommendations.push("📝 Low fiber - add vegetables or whole grains to increase fiber intake")
  }

  // Sodium recommendations
  if (food.sodium_mg > 400) {
    recommendations.push("🧂 High sodium content - limit if you have high blood pressure")
  } else if (food.sodium_mg < 100) {
    recommendations.push("✅ Low sodium - heart-friendly option")
  }

  // Calcium recommendations
  if (food.calcium_mg >= 100) {
    recommendations.push("🦴 Good calcium source - beneficial for bone health")
  }

  // Iron recommendations
  if (food.iron_mg >= 2) {
    recommendations.push("🩸 Good iron source - helps prevent anemia")
  }

  // Vitamin C recommendations
  if (food.vitaminc_mg >= 10) {
    recommendations.push("🍊 Rich in Vitamin C - boosts immunity and iron absorption")
  }

  // Default recommendation if none apply
  if (recommendations.length === 0) {
    recommendations.push("✅ Balanced nutritional profile - can be part of a healthy diet")
  }

  return recommendations
}

// Generate health insights
function generateHealthInsights(food: any): string[] {
  const insights: string[] = []

  // Health score insights
  if (food.health_score >= 80) {
    insights.push("🌟 This food has an excellent nutritional profile with high health benefits")
  } else if (food.health_score >= 60) {
    insights.push("👍 This food has a good nutritional balance with minor areas for improvement")
  } else if (food.health_score >= 40) {
    insights.push("⚖️ This food is moderately healthy - consume mindfully as part of a balanced diet")
  } else {
    insights.push("⚠️ This food should be consumed occasionally due to high calorie/fat content")
  }

  // Macronutrient distribution insights
  const totalCals = food.energy_kcal
  if (totalCals > 0) {
    const proteinPct = ((food.protein_g * 4) / totalCals) * 100
    const fatPct = ((food.fat_g * 9) / totalCals) * 100
    const carbPct = ((food.carb_g * 4) / totalCals) * 100

    if (proteinPct >= 30) {
      insights.push("💪 High protein density makes this food excellent for muscle maintenance and satiety")
    }

    if (fatPct >= 50) {
      insights.push("🟡 More than half the calories come from fat - consume in moderation")
    }

    if (carbPct >= 70) {
      insights.push("🌾 Carbohydrate-rich food - provides quick energy but pair with protein for balance")
    }
  }

  // Specific nutritional insights
  if (food.fiber_g >= 5) {
    insights.push("🌿 High fiber content supports digestive health and helps maintain stable blood sugar")
  }

  if (food.iron_mg >= 3) {
    insights.push("🩸 Excellent iron content - particularly beneficial for women and growing children")
  }

  if (food.calcium_mg >= 150) {
    insights.push("🦴 Rich in calcium - supports bone health and muscle function")
  }

  return insights
}

// Find similar foods based on nutritional profile
function findSimilarFoods(targetFood: any, allFoods: any[], count = 3): any[] {
  const similarities = allFoods
    .filter((food) => food.name !== targetFood.name)
    .map((food) => {
      // Calculate similarity based on macronutrient ratios and calories
      const targetRatios = {
        protein: targetFood.protein_g / targetFood.energy_kcal,
        carb: targetFood.carb_g / targetFood.energy_kcal,
        fat: targetFood.fat_g / targetFood.energy_kcal,
        calories: targetFood.energy_kcal / 100, // Normalize calories
      }

      const foodRatios = {
        protein: food.protein_g / food.energy_kcal,
        carb: food.carb_g / food.energy_kcal,
        fat: food.fat_g / food.energy_kcal,
        calories: food.energy_kcal / 100,
      }

      // Calculate Euclidean distance
      const distance = Math.sqrt(
        Math.pow(targetRatios.protein - foodRatios.protein, 2) +
          Math.pow(targetRatios.carb - foodRatios.carb, 2) +
          Math.pow(targetRatios.fat - foodRatios.fat, 2) +
          Math.pow(targetRatios.calories - foodRatios.calories, 2) * 0.1, // Weight calories less
      )

      return {
        ...food,
        similarity: 1 / (1 + distance),
      }
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, count)

  return similarities
}

export async function POST(request: NextRequest) {
  try {
    const { food_name, category_filter, calorie_range, protein_range } = await request.json()

    if (!food_name) {
      return NextResponse.json(
        {
          success: false,
          message: "Food name is required",
        },
        { status: 400 },
      )
    }

    // Search for food (case-insensitive, partial match)
    const searchTerm = food_name.toLowerCase().trim()
    let matchedFood = foodDatabase.find(
      (food) => food.name.toLowerCase().includes(searchTerm) || searchTerm.includes(food.name.toLowerCase()),
    )

    // If no exact match, try fuzzy matching
    if (!matchedFood) {
      matchedFood = foodDatabase.find((food) => {
        const foodWords = food.name.toLowerCase().split(/[\s/$$$$]+/)
        const searchWords = searchTerm.split(/[\s/$$$$]+/)

        return searchWords.some((searchWord) =>
          foodWords.some((foodWord) => foodWord.includes(searchWord) || searchWord.includes(foodWord)),
        )
      })
    }

    if (!matchedFood) {
      return NextResponse.json(
        {
          success: false,
          message: `Food "${food_name}" not found in our database. Try searching for common Indian foods like Dal, Roti, Rice, Paneer, etc.`,
        },
        { status: 404 },
      )
    }

    // Apply filters if specified
    let filteredFoods = foodDatabase

    if (category_filter && category_filter !== "all") {
      filteredFoods = filteredFoods.filter((food) => food.nutritional_category === category_filter)
    }

    if (calorie_range && calorie_range !== "all") {
      filteredFoods = filteredFoods.filter((food) => {
        switch (calorie_range) {
          case "low":
            return food.energy_kcal <= 150
          case "medium":
            return food.energy_kcal > 150 && food.energy_kcal <= 300
          case "high":
            return food.energy_kcal > 300
          default:
            return true
        }
      })
    }

    if (protein_range && protein_range !== "all") {
      filteredFoods = filteredFoods.filter((food) => {
        switch (protein_range) {
          case "low":
            return food.protein_g <= 5
          case "medium":
            return food.protein_g > 5 && food.protein_g <= 15
          case "high":
            return food.protein_g > 15
          default:
            return true
        }
      })
    }

    // Generate analysis
    const recommendations = generateRecommendations(matchedFood)
    const healthInsights = generateHealthInsights(matchedFood)
    const similarFoods = findSimilarFoods(matchedFood, filteredFoods, 5)

    return NextResponse.json({
      success: true,
      food: matchedFood,
      recommendations,
      health_insights: healthInsights,
      similar_foods: similarFoods,
      message: "Food analysis completed successfully",
    })
  } catch (error) {
    console.error("Food analysis error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during food analysis",
      },
      { status: 500 },
    )
  }
}
