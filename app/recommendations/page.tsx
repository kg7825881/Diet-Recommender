"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Utensils, Target, Calendar, Download } from "lucide-react"
import Link from "next/link"

interface AssessmentData {
  age: string
  gender: string
  height: string
  weight: string
  activityLevel: string
  primaryGoal: string
  targetWeight: string
  timeframe: string
  dietType: string
  allergies: string[]
  mealsPerDay: string
  healthConditions: string[]
}

export default function RecommendationsPage() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [dailyCalories, setDailyCalories] = useState(0)
  const [macros, setMacros] = useState({ protein: 0, carbs: 0, fats: 0 })

  useEffect(() => {
    const data = localStorage.getItem("dietAssessment")
    if (data) {
      const parsed = JSON.parse(data)
      setAssessmentData(parsed)

      // Calculate basic nutritional needs (simplified calculation)
      const weight = Number.parseFloat(parsed.weight) || 70
      const height = Number.parseFloat(parsed.height) || 170
      const age = Number.parseFloat(parsed.age) || 25

      // Basic BMR calculation (Mifflin-St Jeor Equation)
      const bmr =
        parsed.gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161

      // Activity multiplier
      const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        very: 1.725,
      }

      const multiplier = activityMultipliers[parsed.activityLevel as keyof typeof activityMultipliers] || 1.2
      let calories = bmr * multiplier

      // Adjust for goals
      if (parsed.primaryGoal === "lose-weight") {
        calories -= 500 // 500 calorie deficit
      } else if (parsed.primaryGoal === "gain-weight") {
        calories += 500 // 500 calorie surplus
      }

      setDailyCalories(Math.round(calories))

      // Calculate macros (simplified)
      const protein = Math.round((calories * 0.25) / 4) // 25% protein
      const fats = Math.round((calories * 0.3) / 9) // 30% fats
      const carbs = Math.round((calories * 0.45) / 4) // 45% carbs

      setMacros({ protein, carbs, fats })
    }
  }, [])

  const mealPlans = {
    breakfast: [
      {
        name: "Greek Yogurt Parfait",
        calories: 320,
        protein: 20,
        carbs: 35,
        fats: 8,
        ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey"],
        prepTime: "5 min",
      },
      {
        name: "Avocado Toast with Eggs",
        calories: 380,
        protein: 18,
        carbs: 25,
        fats: 22,
        ingredients: ["Whole grain bread", "Avocado", "Eggs", "Cherry tomatoes"],
        prepTime: "10 min",
      },
    ],
    lunch: [
      {
        name: "Quinoa Buddha Bowl",
        calories: 450,
        protein: 15,
        carbs: 55,
        fats: 18,
        ingredients: ["Quinoa", "Roasted vegetables", "Chickpeas", "Tahini dressing"],
        prepTime: "15 min",
      },
      {
        name: "Grilled Chicken Salad",
        calories: 380,
        protein: 35,
        carbs: 15,
        fats: 20,
        ingredients: ["Grilled chicken", "Mixed greens", "Cherry tomatoes", "Olive oil dressing"],
        prepTime: "12 min",
      },
    ],
    dinner: [
      {
        name: "Baked Salmon with Vegetables",
        calories: 420,
        protein: 35,
        carbs: 25,
        fats: 22,
        ingredients: ["Salmon fillet", "Roasted broccoli", "Sweet potato", "Lemon"],
        prepTime: "25 min",
      },
      {
        name: "Turkey and Vegetable Stir-fry",
        calories: 380,
        protein: 30,
        carbs: 35,
        fats: 15,
        ingredients: ["Ground turkey", "Mixed vegetables", "Brown rice", "Soy sauce"],
        prepTime: "20 min",
      },
    ],
  }

  const nutritionTips = [
    "Drink at least 8 glasses of water daily",
    "Include a source of protein in every meal",
    "Eat a variety of colorful fruits and vegetables",
    "Choose whole grains over refined grains",
    "Practice portion control",
    "Eat slowly and mindfully",
  ]

  if (!assessmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Assessment Data Found</CardTitle>
            <CardDescription>
              Please complete the assessment first to get your personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/assessment">
              <Button className="w-full">Take Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/assessment" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assessment
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Diet Plan</h1>
          <p className="text-gray-600">Based on your assessment, here's your customized nutrition plan.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Daily Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dailyCalories}</div>
              <p className="text-xs text-gray-500">kcal per day</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Protein</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{macros.protein}g</div>
              <p className="text-xs text-gray-500">25% of calories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Carbs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{macros.carbs}g</div>
              <p className="text-xs text-gray-500">45% of calories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Fats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{macros.fats}g</div>
              <p className="text-xs text-gray-500">30% of calories</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="meal-plan" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
            <TabsTrigger value="nutrition-tips">Nutrition Tips</TabsTrigger>
            <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="meal-plan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Weekly Meal Plan
                </CardTitle>
                <CardDescription>
                  Personalized meal suggestions based on your {assessmentData.dietType} diet preference and{" "}
                  {assessmentData.primaryGoal} goal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {Object.entries(mealPlans).map(([mealType, meals]) => (
                    <div key={mealType}>
                      <h3 className="text-lg font-semibold mb-4 capitalize">{mealType}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {meals.map((meal, index) => (
                          <Card key={index} className="border-l-4 border-l-green-500">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-base">{meal.name}</CardTitle>
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {meal.prepTime}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>
                                  Calories: <strong>{meal.calories}</strong>
                                </span>
                                <span>
                                  P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                                </span>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-2">Ingredients:</p>
                                <div className="flex flex-wrap gap-1">
                                  {meal.ingredients.map((ingredient, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {ingredient}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition-tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Personalized Nutrition Tips
                </CardTitle>
                <CardDescription>Expert advice tailored to your goals and dietary preferences.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {nutritionTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {assessmentData.allergies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Important Reminders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-800 mb-2">
                      <strong>Allergies to avoid:</strong> {assessmentData.allergies.join(", ")}
                    </p>
                    <p className="text-xs text-orange-600">
                      Always check ingredient labels and inform restaurants about your allergies.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Progress Tracking
                </CardTitle>
                <CardDescription>Monitor your journey towards your {assessmentData.primaryGoal} goal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Weight Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current: {assessmentData.weight}kg</span>
                        <span>Target: {assessmentData.targetWeight}kg</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <p className="text-xs text-gray-500">30% towards your goal</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Weekly Goals</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Follow meal plan</span>
                        <Badge variant="secondary">5/7 days</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stay within calorie range</span>
                        <Badge variant="secondary">4/7 days</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Drink enough water</span>
                        <Badge variant="secondary">6/7 days</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Recommended Actions</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Schedule weekly weigh-ins</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Take progress photos monthly</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Track your meals in a food diary</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download Meal Plan PDF
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
