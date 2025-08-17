"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Zap,
  TrendingUp,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Utensils,
  Activity,
  Target,
  Info,
  Loader2,
} from "lucide-react"

interface FoodItem {
  name: string
  energy_kcal: number
  energy_kj: number
  protein_g: number
  carb_g: number
  fat_g: number
  freesugar_g: number
  fiber_g: number
  sodium_mg: number
  calcium_mg: number
  iron_mg: number
  vitaminc_mg: number
  health_score: number
  nutritional_category: string
}

interface FoodAnalysis {
  food: FoodItem
  recommendations: string[]
  similar_foods: FoodItem[]
  health_insights: string[]
}

export function KnowYourFood() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [calorieRange, setCalorieRange] = useState("all")
  const [proteinRange, setProteinRange] = useState("all")

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("food-search-history")
    if (saved) {
      setSearchHistory(JSON.parse(saved))
    }
  }, [])

  // Save search history to localStorage
  const saveSearchHistory = (term: string) => {
    const updated = [term, ...searchHistory.filter((h) => h !== term)].slice(0, 5)
    setSearchHistory(updated)
    localStorage.setItem("food-search-history", JSON.stringify(updated))
  }

  const analyzeFood = async (foodName: string) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/food-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          food_name: foodName,
          category_filter: categoryFilter,
          calorie_range: calorieRange,
          protein_range: proteinRange,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze food")
      }

      const data = await response.json()

      if (data.success) {
        setSelectedFood(data.food)
        setFoodAnalysis(data)
        saveSearchHistory(foodName)
      } else {
        setError(data.message || "Food not found in database")
        setSelectedFood(null)
        setFoodAnalysis(null)
      }
    } catch (err) {
      setError("Failed to analyze food. Please try again.")
      setSelectedFood(null)
      setFoodAnalysis(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      analyzeFood(searchTerm.trim())
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900/20"
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/20"
    if (score >= 40) return "bg-orange-100 dark:bg-orange-900/20"
    return "bg-red-100 dark:bg-red-900/20"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "High Protein":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "High Fat":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300"
      case "High Carbohydrate":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "Low Calorie":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
      case "High Calorie":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Know Your Food
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover detailed nutritional information and health insights for Indian foods using our AI-powered analysis
        </p>
      </div>

      {/* Search Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Food Analysis
          </CardTitle>
          <CardDescription>Search for any Indian food to get comprehensive nutritional analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="food-search">Food Name</Label>
                <Input
                  id="food-search"
                  placeholder="e.g., Dal, Roti, Biryani, Samosa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={isLoading || !searchTerm.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Category Filter</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="High Protein">High Protein</SelectItem>
                    <SelectItem value="High Fat">High Fat</SelectItem>
                    <SelectItem value="High Carbohydrate">High Carbohydrate</SelectItem>
                    <SelectItem value="Low Calorie">Low Calorie</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Calorie Range</Label>
                <Select value={calorieRange} onValueChange={setCalorieRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="low">Low (0-150 kcal)</SelectItem>
                    <SelectItem value="medium">Medium (150-300 kcal)</SelectItem>
                    <SelectItem value="high">High (300+ kcal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Protein Range</Label>
                <Select value={proteinRange} onValueChange={setProteinRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="low">Low (0-5g)</SelectItem>
                    <SelectItem value="medium">Medium (5-15g)</SelectItem>
                    <SelectItem value="high">High (15+ g)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm text-gray-600 dark:text-gray-300">Recent Searches:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {searchHistory.map((term, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm(term)
                      analyzeFood(term)
                    }}
                    className="text-xs"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Food Analysis Results */}
      {selectedFood && foodAnalysis && (
        <div className="space-y-6">
          {/* Food Overview */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-blue-700 dark:text-blue-300">{selectedFood.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className={getCategoryColor(selectedFood.nutritional_category)}>
                      {selectedFood.nutritional_category}
                    </Badge>
                    <div className={`px-3 py-1 rounded-full ${getHealthScoreBg(selectedFood.health_score)}`}>
                      <span className={`font-bold ${getHealthScoreColor(selectedFood.health_score)}`}>
                        Health Score: {selectedFood.health_score}/100
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{selectedFood.energy_kcal.toFixed(0)}</div>
                  <div className="text-sm text-gray-500">kcal per 100g</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="nutrition" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nutrition">Nutritional Facts</TabsTrigger>
              <TabsTrigger value="health">Health Analysis</TabsTrigger>
              <TabsTrigger value="similar">Similar Foods</TabsTrigger>
            </TabsList>

            <TabsContent value="nutrition" className="space-y-6">
              {/* Macronutrients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Macronutrients (per 100g)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-pink-600">{selectedFood.energy_kcal.toFixed(0)}</div>
                      <div className="text-sm text-gray-500">Calories</div>
                      <div className="text-xs text-gray-400">{selectedFood.energy_kj.toFixed(0)} kJ</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedFood.protein_g.toFixed(1)}g</div>
                      <div className="text-sm text-gray-500">Protein</div>
                      <div className="text-xs text-gray-400">
                        {(((selectedFood.protein_g * 4) / selectedFood.energy_kcal) * 100).toFixed(0)}% of calories
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedFood.carb_g.toFixed(1)}g</div>
                      <div className="text-sm text-gray-500">Carbohydrates</div>
                      <div className="text-xs text-gray-400">
                        {(((selectedFood.carb_g * 4) / selectedFood.energy_kcal) * 100).toFixed(0)}% of calories
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{selectedFood.fat_g.toFixed(1)}g</div>
                      <div className="text-sm text-gray-500">Fat</div>
                      <div className="text-xs text-gray-400">
                        {(((selectedFood.fat_g * 9) / selectedFood.energy_kcal) * 100).toFixed(0)}% of calories
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Micronutrients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Micronutrients & Other Components (per 100g)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedFood.freesugar_g.toFixed(1)}g</div>
                      <div className="text-sm text-gray-500">Free Sugars</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{selectedFood.fiber_g.toFixed(1)}g</div>
                      <div className="text-sm text-gray-500">Fiber</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{selectedFood.sodium_mg.toFixed(0)}mg</div>
                      <div className="text-sm text-gray-500">Sodium</div>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">{selectedFood.calcium_mg.toFixed(0)}mg</div>
                      <div className="text-sm text-gray-500">Calcium</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{selectedFood.iron_mg.toFixed(1)}mg</div>
                      <div className="text-sm text-gray-500">Iron</div>
                    </div>
                    <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600">{selectedFood.vitaminc_mg.toFixed(1)}mg</div>
                      <div className="text-sm text-gray-500">Vitamin C</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              {/* Health Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Health Score Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">Overall Health Score</span>
                      <div className={`text-2xl font-bold ${getHealthScoreColor(selectedFood.health_score)}`}>
                        {selectedFood.health_score}/100
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          selectedFood.health_score >= 80
                            ? "bg-green-500"
                            : selectedFood.health_score >= 60
                              ? "bg-yellow-500"
                              : selectedFood.health_score >= 40
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${selectedFood.health_score}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {foodAnalysis.health_insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {foodAnalysis.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="similar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Similar Foods
                  </CardTitle>
                  <CardDescription>Foods with similar nutritional profiles to {selectedFood.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {foodAnalysis.similar_foods.map((food, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{food.name}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                            <span>{food.energy_kcal.toFixed(0)} kcal</span>
                            <span>{food.protein_g.toFixed(1)}g protein</span>
                            <Badge className={getCategoryColor(food.nutritional_category)} variant="outline">
                              {food.nutritional_category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getHealthScoreColor(food.health_score)}`}>
                            {food.health_score}/100
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchTerm(food.name)
                              analyzeFood(food.name)
                            }}
                            className="mt-2"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Analyze
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Search Tips:</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>• Try common Indian foods like "Dal", "Roti", "Rice"</li>
                <li>• Use specific names like "Masala Dosa" or "Butter Chicken"</li>
                <li>• Search for ingredients like "Paneer" or "Chicken"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Health Score Guide:</h4>
              <ul className="space-y-1 text-gray-600 dark:text-gray-300">
                <li>
                  • <span className="text-green-600">80-100:</span> Excellent nutritional value
                </li>
                <li>
                  • <span className="text-yellow-600">60-79:</span> Good with minor concerns
                </li>
                <li>
                  • <span className="text-orange-600">40-59:</span> Moderate, consume mindfully
                </li>
                <li>
                  • <span className="text-red-600">0-39:</span> High calorie/fat, limit intake
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
