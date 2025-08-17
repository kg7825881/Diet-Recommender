import { type NextRequest, NextResponse } from "next/server"

interface NutrientAnalysisRequest {
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
  targets: {
    calories: number
    protein: number
    carbs: number
    fats: number
    fiber: number
  }
}

interface NutrientStatus {
  status: "Deficient" | "Ideal" | "Excess"
  percentage: number
}

interface NutrientAnalysis {
  status: string
  score: number
  recommendations: string[]
  nutrient_breakdown: {
    calories: NutrientStatus
    protein: NutrientStatus
    carbs: NutrientStatus
    fats: NutrientStatus
    fiber: NutrientStatus
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: NutrientAnalysisRequest = await request.json()

    // Calculate nutrient status for each nutrient
    const nutrientBreakdown = {
      calories: analyzeNutrient(data.calories, data.targets.calories),
      protein: analyzeNutrient(data.protein, data.targets.protein),
      carbs: analyzeNutrient(data.carbs, data.targets.carbs),
      fats: analyzeNutrient(data.fats, data.targets.fats),
      fiber: analyzeNutrient(data.fiber, data.targets.fiber),
    }

    // Calculate overall score (0-100)
    const score = calculateNutritionScore(nutrientBreakdown)

    // Determine overall status
    const overallStatus = determineOverallStatus(nutrientBreakdown)

    // Generate recommendations
    const recommendations = generateRecommendations(nutrientBreakdown, data)

    const analysis: NutrientAnalysis = {
      status: overallStatus,
      score,
      recommendations,
      nutrient_breakdown: nutrientBreakdown,
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Nutrient analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze nutrients" }, { status: 500 })
  }
}

function analyzeNutrient(current: number, target: number): NutrientStatus {
  const percentage = Math.round((current / target) * 100)

  let status: "Deficient" | "Ideal" | "Excess"
  if (percentage < 70) {
    status = "Deficient"
  } else if (percentage <= 110) {
    status = "Ideal"
  } else {
    status = "Excess"
  }

  return { status, percentage }
}

function calculateNutritionScore(breakdown: NutrientAnalysis["nutrient_breakdown"]): number {
  let totalScore = 0
  let nutrientCount = 0

  Object.values(breakdown).forEach((nutrient) => {
    let nutrientScore = 0
    if (nutrient.status === "Ideal") {
      nutrientScore = 100
    } else if (nutrient.status === "Deficient") {
      // Score based on how close to ideal (70-100% gets higher score)
      nutrientScore = Math.max(0, (nutrient.percentage / 70) * 80)
    } else {
      // Excess - penalize more severely for going over
      const excessAmount = nutrient.percentage - 110
      nutrientScore = Math.max(0, 80 - excessAmount * 2)
    }

    totalScore += nutrientScore
    nutrientCount++
  })

  return Math.round(totalScore / nutrientCount)
}

function determineOverallStatus(breakdown: NutrientAnalysis["nutrient_breakdown"]): string {
  const statuses = Object.values(breakdown).map((n) => n.status)

  if (statuses.filter((s) => s === "Excess").length >= 2) {
    return "Excess"
  } else if (statuses.filter((s) => s === "Deficient").length >= 2) {
    return "Deficient"
  } else if (statuses.filter((s) => s === "Ideal").length >= 3) {
    return "Ideal"
  } else {
    return "Moderate"
  }
}

function generateRecommendations(
  breakdown: NutrientAnalysis["nutrient_breakdown"],
  data: NutrientAnalysisRequest,
): string[] {
  const recommendations: string[] = []

  // Calorie recommendations
  if (breakdown.calories.status === "Deficient") {
    recommendations.push("Increase calorie intake with healthy foods like nuts, avocados, and whole grains")
  } else if (breakdown.calories.status === "Excess") {
    recommendations.push("Reduce portion sizes and choose lower-calorie, nutrient-dense foods")
  }

  // Protein recommendations
  if (breakdown.protein.status === "Deficient") {
    recommendations.push("Add more protein sources like dal, paneer, eggs, or lean meats to your meals")
  } else if (breakdown.protein.status === "Excess") {
    recommendations.push("Balance protein intake with more vegetables and complex carbohydrates")
  }

  // Carbohydrate recommendations
  if (breakdown.carbs.status === "Deficient") {
    recommendations.push("Include more complex carbs like brown rice, quinoa, and whole wheat rotis")
  } else if (breakdown.carbs.status === "Excess") {
    recommendations.push("Reduce refined carbs and focus on fiber-rich vegetables and fruits")
  }

  // Fat recommendations
  if (breakdown.fats.status === "Deficient") {
    recommendations.push("Add healthy fats from sources like ghee, nuts, seeds, and olive oil")
  } else if (breakdown.fats.status === "Excess") {
    recommendations.push("Limit fried foods and use cooking methods like steaming, grilling, or baking")
  }

  // Fiber recommendations
  if (breakdown.fiber.status === "Deficient") {
    recommendations.push("Increase fiber intake with more vegetables, fruits, and whole grains")
  }

  // Indian-specific recommendations
  if (data.protein < data.targets.protein * 0.8) {
    recommendations.push("Try traditional protein-rich foods like rajma, chana, or moong dal")
  }

  if (data.fiber < data.targets.fiber * 0.7) {
    recommendations.push("Include more sabzi (vegetables) and fruits in your daily meals")
  }

  // General wellness recommendations
  if (breakdown.calories.status === "Ideal" && breakdown.protein.status === "Ideal") {
    recommendations.push("Great job maintaining balanced nutrition! Keep up the good work")
  }

  return recommendations.slice(0, 5) // Limit to 5 recommendations
}
