"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { Plus, Target, TrendingUp, Activity, Zap, Loader2, X } from "lucide-react"

interface NutrientIntake {
  date: string
  calories: number
  protein: number
  carbs: number
  fats: number
  fiber: number
}

interface FoodItem {
  food_name: string
  energy_kcal: number
  protein_g: number
  carb_g: number
  fat_g: number
  freesugar_g: number
  serving_size: number
}

interface NutrientAnalysis {
  status: string
  score: number
  recommendations: string[]
  nutrient_breakdown: {
    calories: { status: string; percentage: number }
    protein: { status: string; percentage: number }
    carbs: { status: string; percentage: number }
    fats: { status: string; percentage: number }
    fiber: { status: string; percentage: number }
  }
}

const DAILY_TARGETS = {
  calories: 2000,
  protein: 150,
  carbs: 250,
  fats: 67,
  fiber: 25,
}

const COLORS = {
  calories: "#ef4444",
  protein: "#3b82f6",
  carbs: "#10b981",
  fats: "#f59e0b",
  fiber: "#8b5cf6",
}

const PIE_COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"]

// Mock Indian food database
const INDIAN_FOODS: FoodItem[] = [
  { food_name: "Chapati/Roti", energy_kcal: 202, protein_g: 6, carb_g: 36, fat_g: 4, freesugar_g: 1, serving_size: 1 },
  { food_name: "Boiled rice", energy_kcal: 117, protein_g: 3, carb_g: 26, fat_g: 0, freesugar_g: 0, serving_size: 1 },
  { food_name: "Dal Tadka", energy_kcal: 166, protein_g: 9, carb_g: 27, fat_g: 3, freesugar_g: 2, serving_size: 1 },
  { food_name: "Paneer Curry", energy_kcal: 177, protein_g: 8, carb_g: 8, fat_g: 12, freesugar_g: 6, serving_size: 1 },
  { food_name: "Chicken Curry", energy_kcal: 129, protein_g: 12, carb_g: 3, fat_g: 8, freesugar_g: 2, serving_size: 1 },
  {
    food_name: "Mixed Vegetable",
    energy_kcal: 84,
    protein_g: 3,
    carb_g: 12,
    fat_g: 3,
    freesugar_g: 4,
    serving_size: 1,
  },
  { food_name: "Curd Rice", energy_kcal: 196, protein_g: 6, carb_g: 33, fat_g: 4, freesugar_g: 4, serving_size: 1 },
  { food_name: "Samosa", energy_kcal: 577, protein_g: 2, carb_g: 9, fat_g: 59, freesugar_g: 0, serving_size: 1 },
  { food_name: "Idli", energy_kcal: 138, protein_g: 5, carb_g: 28, fat_g: 0, freesugar_g: 0, serving_size: 2 },
  { food_name: "Dosa", energy_kcal: 165, protein_g: 3, carb_g: 20, fat_g: 8, freesugar_g: 1, serving_size: 1 },
  { food_name: "Upma", energy_kcal: 158, protein_g: 4, carb_g: 24, fat_g: 5, freesugar_g: 2, serving_size: 1 },
]

export function NutrientTracker() {
  const [todayIntake, setTodayIntake] = useState<NutrientIntake>({
    date: new Date().toISOString().split("T")[0],
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    fiber: 0,
  })

  const [weeklyData, setWeeklyData] = useState<NutrientIntake[]>([])
  const [selectedFood, setSelectedFood] = useState<string>("")
  const [servingSize, setServingSize] = useState<number>(1)
  const [consumedFoods, setConsumedFoods] = useState<Array<FoodItem & { servings: number }>>([])
  const [analysis, setAnalysis] = useState<NutrientAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Manual input states
  const [manualCalories, setManualCalories] = useState<string>("")
  const [manualProtein, setManualProtein] = useState<string>("")
  const [manualCarbs, setManualCarbs] = useState<string>("")
  const [manualFats, setManualFats] = useState<string>("")
  const [manualFiber, setManualFiber] = useState<string>("")

  useEffect(() => {
    loadTodayData()
    generateWeeklyData()
  }, [])

  useEffect(() => {
    if (todayIntake.calories > 0 || todayIntake.protein > 0) {
      analyzeNutrients()
    }
  }, [todayIntake])

  const loadTodayData = () => {
    const today = new Date().toISOString().split("T")[0]
    const savedData = localStorage.getItem(`nutrient_intake_${today}`)
    const savedFoods = localStorage.getItem(`consumed_foods_${today}`)

    if (savedData) {
      setTodayIntake(JSON.parse(savedData))
    }
    if (savedFoods) {
      setConsumedFoods(JSON.parse(savedFoods))
    }
  }

  const saveTodayData = (intake: NutrientIntake, foods: Array<FoodItem & { servings: number }>) => {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem(`nutrient_intake_${today}`, JSON.stringify(intake))
    localStorage.setItem(`consumed_foods_${today}`, JSON.stringify(foods))
  }

  const generateWeeklyData = () => {
    const data: NutrientIntake[] = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const savedData = localStorage.getItem(`nutrient_intake_${dateStr}`)
      if (savedData) {
        data.push(JSON.parse(savedData))
      } else {
        // Generate mock data for demonstration
        data.push({
          date: dateStr,
          calories: Math.floor(Math.random() * 800) + 1200,
          protein: Math.floor(Math.random() * 50) + 80,
          carbs: Math.floor(Math.random() * 100) + 150,
          fats: Math.floor(Math.random() * 30) + 40,
          fiber: Math.floor(Math.random() * 15) + 15,
        })
      }
    }
    setWeeklyData(data)
  }

  const addManualIntake = () => {
    const newIntake = {
      ...todayIntake,
      calories: todayIntake.calories + (Number.parseFloat(manualCalories) || 0),
      protein: todayIntake.protein + (Number.parseFloat(manualProtein) || 0),
      carbs: todayIntake.carbs + (Number.parseFloat(manualCarbs) || 0),
      fats: todayIntake.fats + (Number.parseFloat(manualFats) || 0),
      fiber: todayIntake.fiber + (Number.parseFloat(manualFiber) || 0),
    }

    setTodayIntake(newIntake)
    saveTodayData(newIntake, consumedFoods)

    // Clear inputs
    setManualCalories("")
    setManualProtein("")
    setManualCarbs("")
    setManualFats("")
    setManualFiber("")
  }

  const addFoodItem = () => {
    const food = INDIAN_FOODS.find((f) => f.food_name === selectedFood)
    if (!food || servingSize <= 0) return

    const foodWithServings = {
      ...food,
      servings: servingSize,
    }

    const newConsumedFoods = [...consumedFoods, foodWithServings]
    setConsumedFoods(newConsumedFoods)

    const newIntake = {
      ...todayIntake,
      calories: todayIntake.calories + food.energy_kcal * servingSize,
      protein: todayIntake.protein + food.protein_g * servingSize,
      carbs: todayIntake.carbs + food.carb_g * servingSize,
      fats: todayIntake.fats + food.fat_g * servingSize,
      fiber: todayIntake.fiber + food.freesugar_g * 0.3 * servingSize, // Estimate fiber
    }

    setTodayIntake(newIntake)
    saveTodayData(newIntake, newConsumedFoods)

    setSelectedFood("")
    setServingSize(1)
  }

  const removeFoodItem = (index: number) => {
    const foodToRemove = consumedFoods[index]
    const newConsumedFoods = consumedFoods.filter((_, i) => i !== index)
    setConsumedFoods(newConsumedFoods)

    const newIntake = {
      ...todayIntake,
      calories: Math.max(0, todayIntake.calories - foodToRemove.energy_kcal * foodToRemove.servings),
      protein: Math.max(0, todayIntake.protein - foodToRemove.protein_g * foodToRemove.servings),
      carbs: Math.max(0, todayIntake.carbs - foodToRemove.carb_g * foodToRemove.servings),
      fats: Math.max(0, todayIntake.fats - foodToRemove.fat_g * foodToRemove.servings),
      fiber: Math.max(0, todayIntake.fiber - foodToRemove.freesugar_g * 0.3 * foodToRemove.servings),
    }

    setTodayIntake(newIntake)
    saveTodayData(newIntake, newConsumedFoods)
  }

  const analyzeNutrients = async () => {
    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/nutrient-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calories: todayIntake.calories,
          protein: todayIntake.protein,
          carbs: todayIntake.carbs,
          fats: todayIntake.fats,
          fiber: todayIntake.fiber,
          targets: DAILY_TARGETS,
        }),
      })

      if (response.ok) {
        const analysisResult = await response.json()
        setAnalysis(analysisResult)
      }
    } catch (error) {
      console.error("Error analyzing nutrients:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage < 70) return "bg-red-500"
    if (percentage < 90) return "bg-yellow-500"
    if (percentage <= 110) return "bg-green-500"
    return "bg-orange-500"
  }

  const getWeeklyAverage = (nutrient: keyof Omit<NutrientIntake, "date">) => {
    const total = weeklyData.reduce((sum, day) => sum + day[nutrient], 0)
    return Math.round(total / weeklyData.length)
  }

  const getTodayMacroData = () => [
    { name: "Protein", value: todayIntake.protein, color: COLORS.protein },
    { name: "Carbs", value: todayIntake.carbs, color: COLORS.carbs },
    { name: "Fats", value: todayIntake.fats, color: COLORS.fats },
    { name: "Fiber", value: todayIntake.fiber, color: COLORS.fiber },
  ]

  const getWeeklyMacroData = () => {
    return weeklyData.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
      protein: day.protein,
      carbs: day.carbs,
      fats: day.fats,
      fiber: day.fiber,
    }))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="intake" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="intake">Today's Intake</TabsTrigger>
          <TabsTrigger value="summary">Today's Summary</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Stats</TabsTrigger>
          <TabsTrigger value="trends">Calorie Trends</TabsTrigger>
          <TabsTrigger value="macros">Macro Breakdown</TabsTrigger>
        </TabsList>

        {/* Section 1: Today's Intake */}
        <TabsContent value="intake" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Manual Input */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  Manual Input
                </CardTitle>
                <CardDescription>Enter your nutrient intake manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="0"
                      value={manualCalories}
                      onChange={(e) => setManualCalories(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      placeholder="0"
                      value={manualProtein}
                      onChange={(e) => setManualProtein(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="0"
                      value={manualCarbs}
                      onChange={(e) => setManualCarbs(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fats">Fats (g)</Label>
                    <Input
                      id="fats"
                      type="number"
                      placeholder="0"
                      value={manualFats}
                      onChange={(e) => setManualFats(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="fiber">Fiber (g)</Label>
                    <Input
                      id="fiber"
                      type="number"
                      placeholder="0"
                      value={manualFiber}
                      onChange={(e) => setManualFiber(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={addManualIntake} className="w-full bg-green-600 hover:bg-green-700">
                  Add to Today's Intake
                </Button>
              </CardContent>
            </Card>

            {/* Food Database */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Add Food Item
                </CardTitle>
                <CardDescription>Select from Indian food database</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="food-select">Food Item</Label>
                  <Select value={selectedFood} onValueChange={setSelectedFood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a food item" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_FOODS.map((food) => (
                        <SelectItem key={food.food_name} value={food.food_name}>
                          {food.food_name} ({food.energy_kcal} kcal)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="serving-size">Serving Size</Label>
                  <Input
                    id="serving-size"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={servingSize}
                    onChange={(e) => setServingSize(Number.parseFloat(e.target.value) || 1)}
                  />
                </div>
                <Button
                  onClick={addFoodItem}
                  disabled={!selectedFood}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Add Food Item
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Consumed Foods List */}
          {consumedFoods.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Today's Food Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consumedFoods.map((food, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{food.food_name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {food.servings} serving(s) • {Math.round(food.energy_kcal * food.servings)} kcal
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFoodItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Section 2: Today's Summary */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(DAILY_TARGETS).map(([nutrient, target]) => {
              const current = todayIntake[nutrient as keyof typeof todayIntake] as number
              const percentage = Math.round((current / target) * 100)

              return (
                <Card key={nutrient} className="bg-white dark:bg-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize flex items-center gap-2">
                      <Target className="w-5 h-5" style={{ color: COLORS[nutrient as keyof typeof COLORS] }} />
                      {nutrient}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-bold" style={{ color: COLORS[nutrient as keyof typeof COLORS] }}>
                          {Math.round(current)}
                        </span>
                        <span className="text-sm text-gray-500">/ {target}</span>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className="h-2"
                        style={{
                          backgroundColor: `${COLORS[nutrient as keyof typeof COLORS]}20`,
                        }}
                      />
                      <Badge
                        variant={percentage >= 90 && percentage <= 110 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {percentage}% of target
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* AI Analysis */}
          {analysis && (
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Nutrient Analysis
                  {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-blue-600">{analysis.score}/100</div>
                  <Badge variant={analysis.status === "Ideal" ? "default" : "secondary"} className="text-sm">
                    {analysis.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Recommendations:</h4>
                  <ul className="space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Section 3: Weekly Stats */}
        <TabsContent value="weekly" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(DAILY_TARGETS).map(([nutrient, target]) => {
              const average = getWeeklyAverage(nutrient as keyof Omit<NutrientIntake, "date">)
              const percentage = Math.round((average / target) * 100)

              return (
                <Card key={nutrient}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize">{nutrient}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold" style={{ color: COLORS[nutrient as keyof typeof COLORS] }}>
                        {average}
                      </div>
                      <div className="text-sm text-gray-500">Weekly Average</div>
                      <Badge
                        variant={percentage >= 90 && percentage <= 110 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {percentage}% of target
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>7-Day Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="font-medium">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-red-600">{day.calories}</div>
                      <div className="text-xs text-gray-500">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{day.protein}g</div>
                      <div className="text-xs text-gray-500">protein</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">{day.carbs}g</div>
                      <div className="text-xs text-gray-500">carbs</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-yellow-600">{day.fats}g</div>
                      <div className="text-xs text-gray-500">fats</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{day.fiber}g</div>
                      <div className="text-xs text-gray-500">fiber</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 4: Calorie Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Calorie Trend (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(date) =>
                        new Date(date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })
                      }
                      formatter={(value) => [`${value} kcal`, "Calories"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="calories"
                      stroke={COLORS.calories}
                      strokeWidth={3}
                      dot={{ fill: COLORS.calories, strokeWidth: 2, r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey={() => DAILY_TARGETS.calories}
                      stroke="#94a3b8"
                      strokeDasharray="5 5"
                      dot={false}
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section 5: Macro Breakdown */}
        <TabsContent value="macros" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Macro Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Macronutrient Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getTodayMacroData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}g`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getTodayMacroData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}g`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Macro Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Macronutrient Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getWeeklyMacroData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="protein" fill={COLORS.protein} name="Protein (g)" />
                      <Bar dataKey="carbs" fill={COLORS.carbs} name="Carbs (g)" />
                      <Bar dataKey="fats" fill={COLORS.fats} name="Fats (g)" />
                      <Bar dataKey="fiber" fill={COLORS.fiber} name="Fiber (g)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
