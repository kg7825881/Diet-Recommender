"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Target,
  Users,
  Zap,
  Sun,
  Moon,
  Apple,
  Coffee,
  Utensils,
  Calculator,
  BookOpen,
  Bell,
  Scan,
  MessageSquare,
  Star,
  LogOut,
  User,
  Settings,
  Clock,
  ChevronDown,
  Camera,
  Upload,
  X,
  Loader2,
  Home,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SmartDietPlanner } from "@/components/smart-diet-planner"
import { RecipeBook } from "@/components/recipe-book"
import { NutrientTracker } from "@/components/nutrient-tracker"
import { KnowYourFood } from "@/components/know-your-food"
import { BMICalculator } from "@/components/bmi-calculator"
import { FoodReminders } from "@/components/food-reminders"

interface NutritionInfo {
  Product: string
  Energy: number
  Fat: number
  Sugars: number
  Proteins: number
  Carbohydrates?: number
  Fiber?: number
  Salt?: number
}

const dailyDietPlan = {
  date: new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  totalCalories: 2000,
  consumedCalories: 1650,
  meals: [
    {
      type: "Breakfast",
      time: "8:00 AM",
      name: "Oats Upma with Vegetables",
      calories: 320,
      protein: 12,
      carbs: 45,
      fats: 8,
      ingredients: ["Oats", "Mixed vegetables", "Curry leaves", "Mustard seeds"],
      status: "completed",
    },
    {
      type: "Mid-Morning Snack",
      time: "10:30 AM",
      name: "Green Tea with Almonds",
      calories: 150,
      protein: 6,
      carbs: 5,
      fats: 12,
      ingredients: ["Green tea", "Almonds (10 pieces)"],
      status: "completed",
    },
    {
      type: "Lunch",
      time: "1:00 PM",
      name: "Dal Khichdi with Yogurt",
      calories: 450,
      protein: 18,
      carbs: 65,
      fats: 12,
      ingredients: ["Rice", "Moong dal", "Vegetables", "Yogurt"],
      status: "completed",
    },
    {
      type: "Evening Snack",
      time: "4:00 PM",
      name: "Fruit Chaat",
      calories: 180,
      protein: 3,
      carbs: 42,
      fats: 2,
      ingredients: ["Apple", "Orange", "Pomegranate", "Chaat masala"],
      status: "pending",
    },
    {
      type: "Dinner",
      time: "7:30 PM",
      name: "Grilled Paneer with Roti",
      calories: 420,
      protein: 25,
      carbs: 35,
      fats: 22,
      ingredients: ["Paneer", "Whole wheat roti", "Mixed vegetables", "Mint chutney"],
      status: "pending",
    },
    {
      type: "Before Bed",
      time: "9:30 PM",
      name: "Turmeric Milk",
      calories: 130,
      protein: 8,
      carbs: 12,
      fats: 5,
      ingredients: ["Warm milk", "Turmeric", "Honey"],
      status: "pending",
    },
  ],
}

export default function DashboardPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackDescription, setFeedbackDescription] = useState("")
  const [userDietPlan, setUserDietPlan] = useState(dailyDietPlan)
  const [completedMeals, setCompletedMeals] = useState<string[]>([])

  // Add useEffect to load saved diet plan and completed meals
  useEffect(() => {
    // Load saved diet plan from localStorage
    const savedDietPlan = localStorage.getItem("currentDietPlan")
    if (savedDietPlan) {
      try {
        const parsedPlan = JSON.parse(savedDietPlan)
        // Update the date to today's date
        const updatedPlan = {
          ...parsedPlan,
          date: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }
        setUserDietPlan(updatedPlan)
      } catch (error) {
        console.error("Error loading saved diet plan:", error)
      }
    }

    // Load completed meals for today
    const today = new Date().toDateString()
    const savedCompletedMeals = localStorage.getItem(`completedMeals_${today}`)
    if (savedCompletedMeals) {
      try {
        const parsedCompletedMeals = JSON.parse(savedCompletedMeals)
        setCompletedMeals(parsedCompletedMeals)
      } catch (error) {
        console.error("Error loading completed meals:", error)
      }
    }

    // Listen for diet plan updates from Smart Diet Planner
    const handleDietPlanUpdate = (event: CustomEvent) => {
      const newDietPlan = event.detail
      setUserDietPlan(newDietPlan)
      // Reset completed meals when new plan is loaded
      setCompletedMeals([])
      localStorage.removeItem(`completedMeals_${new Date().toDateString()}`)
    }

    window.addEventListener("dietPlanUpdated", handleDietPlanUpdate as EventListener)

    return () => {
      window.removeEventListener("dietPlanUpdated", handleDietPlanUpdate as EventListener)
    }
  }, [])

  // Add function to handle meal completion
  const handleMealCompletion = (mealIndex: number) => {
    const mealId = `meal_${mealIndex}`
    const today = new Date().toDateString()

    let updatedCompletedMeals
    if (completedMeals.includes(mealId)) {
      // Remove from completed if already completed
      updatedCompletedMeals = completedMeals.filter((id) => id !== mealId)
    } else {
      // Add to completed
      updatedCompletedMeals = [...completedMeals, mealId]
    }

    setCompletedMeals(updatedCompletedMeals)

    // Save to localStorage
    localStorage.setItem(`completedMeals_${today}`, JSON.stringify(updatedCompletedMeals))

    // Update the diet plan with new status
    const updatedDietPlan = {
      ...userDietPlan,
      meals: userDietPlan.meals.map((meal, index) => ({
        ...meal,
        status: updatedCompletedMeals.includes(`meal_${index}`) ? "completed" : "pending",
      })),
    }

    setUserDietPlan(updatedDietPlan)
  }

  // Add function to calculate consumed calories
  const calculateConsumedCalories = () => {
    return userDietPlan.meals
      .filter((_, index) => completedMeals.includes(`meal_${index}`))
      .reduce((total, meal) => total + meal.calories, 0)
  }

  // Barcode scanner states
  const [showBarcodeModal, setShowBarcodeModal] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Fetch nutrition data from OpenFoodFacts API
  const fetchNutrition = async (barcode: string): Promise<NutritionInfo | null> => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
      const data = await response.json()

      if (data.status === 1) {
        const product = data.product
        const nutriments = product.nutriments || {}

        return {
          Product: product.product_name || "Unknown Product",
          Energy: Number.parseFloat(nutriments["energy-kcal_100g"] || "0"),
          Fat: Number.parseFloat(nutriments["fat_100g"] || "0"),
          Sugars: Number.parseFloat(nutriments["sugars_100g"] || "0"),
          Proteins: Number.parseFloat(nutriments["proteins_100g"] || "0"),
          Carbohydrates: Number.parseFloat(nutriments["carbohydrates_100g"] || "0"),
          Fiber: Number.parseFloat(nutriments["fiber_100g"] || "0"),
          Salt: Number.parseFloat(nutriments["salt_100g"] || "0"),
        }
      }
      return null
    } catch (error) {
      console.error("Error fetching nutrition data:", error)
      return null
    }
  }

  // Generate recommendations based on nutrition info
  const generateRecommendations = (nutri: NutritionInfo): string[] => {
    const recs: string[] = []

    if (nutri.Sugars > 15) {
      recs.push("⚠️ High Sugar! Consider low-sugar alternatives.")
    }
    if (nutri.Proteins >= 10) {
      recs.push("💪 Good Protein source.")
    }
    if (nutri.Fat > 20) {
      recs.push("⚠️ High Fat content!")
    }
    if (nutri.Energy > 400) {
      recs.push("🔥 High calorie product - consume in moderation.")
    }
    if (nutri.Fiber && nutri.Fiber >= 5) {
      recs.push("🌾 Good source of fiber.")
    }
    if (nutri.Salt && nutri.Salt > 1.5) {
      recs.push("🧂 High sodium content - limit intake.")
    }

    return recs.length > 0 ? recs : ["✅ Balanced product."]
  }

  // Process barcode from image
  const processBarcodeFromImage = async (imageData: string) => {
    setIsLoading(true)
    setError("")

    try {
      // In a real implementation, you would send the image to a backend service
      // that uses libraries like pyzbar to decode the barcode
      // For now, we'll simulate with a mock barcode

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock barcode for demonstration (you would get this from your backend)
      const mockBarcode = "3017620422003" // Nutella barcode for testing

      const nutrition = await fetchNutrition(mockBarcode)

      if (nutrition) {
        setNutritionInfo(nutrition)
        setRecommendations(generateRecommendations(nutrition))
      } else {
        setError("Product not found in database")
      }
    } catch (err) {
      setError("Failed to process barcode")
    } finally {
      setIsLoading(false)
    }
  }

  // Start camera for barcode scanning
  const startCamera = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        streamRef.current = stream
        setIsScanning(true)
      }
    } catch (err) {
      console.error("Camera error:", err)
      setError("Camera access denied or not available. Please check permissions.")
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageData = canvas.toDataURL("image/jpeg")
        processBarcodeFromImage(imageData)
        stopCamera()
      }
    }
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        processBarcodeFromImage(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  // Close barcode modal
  const closeBarcodeModal = () => {
    setShowBarcodeModal(false)
    stopCamera()
    setNutritionInfo(null)
    setRecommendations([])
    setError("")
    setIsLoading(false)
  }

  // Animated Background Component
  const AnimatedBackground = () => {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20 animate-gradient-x"></div>

        {/* Floating Food Icons */}
        <div className="absolute top-10 left-10 animate-bounce delay-100">
          <Apple className="w-8 h-8 text-pink-400 opacity-60" />
        </div>
        <div className="absolute top-32 right-20 animate-bounce delay-300">
          <Coffee className="w-6 h-6 text-purple-400 opacity-60" />
        </div>
        <div className="absolute bottom-20 left-20 animate-bounce delay-500">
          <Utensils className="w-7 h-7 text-blue-400 opacity-60" />
        </div>
        <div className="absolute top-1/2 right-10 animate-bounce delay-700">
          <Apple className="w-5 h-5 text-green-400 opacity-60" />
        </div>
        <div className="absolute bottom-32 right-32 animate-bounce delay-200">
          <Coffee className="w-8 h-8 text-yellow-400 opacity-60" />
        </div>
        <div className="absolute top-20 left-1/3 animate-bounce delay-600">
          <Utensils className="w-6 h-6 text-indigo-400 opacity-60" />
        </div>
        <div className="absolute top-3/4 left-1/2 animate-bounce delay-400">
          <Apple className="w-7 h-7 text-orange-400 opacity-60" />
        </div>
        <div className="absolute bottom-10 left-1/4 animate-bounce delay-800">
          <Coffee className="w-5 h-5 text-red-400 opacity-60" />
        </div>

        {/* Floating Circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800/30 dark:to-purple-800/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-blue-200 to-green-200 dark:from-blue-800/30 dark:to-green-800/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-yellow-200 to-pink-200 dark:from-yellow-800/30 dark:to-pink-800/30 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-10 right-1/3 w-28 h-28 bg-gradient-to-r from-green-200 to-blue-200 dark:from-green-800/30 dark:to-blue-800/30 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-gradient-to-r from-orange-200 to-red-200 dark:from-orange-800/30 dark:to-red-800/30 rounded-full blur-xl animate-pulse delay-300"></div>
      </div>
    )
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Feedback:", { rating: feedbackRating, description: feedbackDescription })
    alert("Thank you for your feedback!")
    setFeedbackRating(0)
    setFeedbackDescription("")
  }

  const handleLogout = () => {
    router.push("/")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome Back!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">Here's your personalized diet plan for today</p>
            </div>

            {/* Daily Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-pink-700 dark:text-pink-300 text-lg">Today's Calories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-pink-600">{calculateConsumedCalories()}</span>
                    <span className="text-sm text-gray-500">/ {userDietPlan.totalCalories} kcal</span>
                  </div>
                  <div className="w-full bg-pink-200 dark:bg-pink-800 rounded-full h-2 mt-2">
                    <div
                      className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((calculateConsumedCalories() / userDietPlan.totalCalories) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-700 dark:text-purple-300 text-lg">Meals Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-purple-600">{completedMeals.length}</span>
                    <span className="text-sm text-gray-500">/ {userDietPlan.meals.length} meals</span>
                  </div>
                  <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(completedMeals.length / userDietPlan.meals.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-700 dark:text-blue-300 text-lg">Next Meal</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const nextMealIndex = userDietPlan.meals.findIndex(
                      (_, index) => !completedMeals.includes(`meal_${index}`),
                    )
                    const nextMeal = nextMealIndex !== -1 ? userDietPlan.meals[nextMealIndex] : null
                    return nextMeal ? (
                      <>
                        <div className="text-2xl font-bold text-blue-600">{nextMeal.time}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{nextMeal.name}</div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-green-600">All Done!</div>
                    )
                  })()}
                </CardContent>
              </Card>
            </div>

            {/* Daily Diet Plan */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-pink-600" />
                  Today's Diet Plan
                </CardTitle>
                <CardDescription className="text-lg">{userDietPlan.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userDietPlan.meals.map((meal, index) => {
                    const mealId = `meal_${index}`
                    const isCompleted = completedMeals.includes(mealId)

                    return (
                      <Card
                        key={index}
                        className={`border-l-4 ${
                          isCompleted
                            ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
                        }`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg flex items-center gap-2">
                                {meal.name}
                                <Badge variant={isCompleted ? "default" : "secondary"} className="ml-2">
                                  {isCompleted ? "✓ Completed" : "Pending"}
                                </Badge>
                              </CardTitle>
                              <CardDescription className="flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {meal.time}
                                </span>
                                <span className="font-medium text-purple-600 dark:text-purple-400">{meal.type}</span>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                              <div className="font-bold text-lg text-pink-600">{meal.calories}</div>
                              <div className="text-gray-500">Calories</div>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                              <div className="font-bold text-lg text-blue-600">{meal.protein}g</div>
                              <div className="text-gray-500">Protein</div>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                              <div className="font-bold text-lg text-green-600">{meal.carbs}g</div>
                              <div className="text-gray-500">Carbs</div>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                              <div className="font-bold text-lg text-orange-600">{meal.fats}g</div>
                              <div className="text-gray-500">Fats</div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">Ingredients:</p>
                            <div className="flex flex-wrap gap-2">
                              {meal.ingredients.map((ingredient, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleMealCompletion(index)}
                            className={
                              isCompleted
                                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            }
                          >
                            {isCompleted ? "Mark as Pending" : "Mark as Completed"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent text-center">
                Explore Our Features
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800 cursor-pointer"
                  onClick={() => setActiveTab("diet-planner")}
                >
                  <CardHeader>
                    <Target className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                    <CardTitle className="text-lg text-pink-700 dark:text-pink-300">Smart Diet Planner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      AI-powered meal planning tailored to Indian cuisine
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800 cursor-pointer"
                  onClick={() => setActiveTab("know-food")}
                >
                  <CardHeader>
                    <Zap className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                    <CardTitle className="text-lg text-purple-700 dark:text-purple-300">Know Your Food</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      Detailed nutritional information for Indian dishes
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800 cursor-pointer"
                  onClick={() => setActiveTab("bmi-calculator")}
                >
                  <CardHeader>
                    <Calculator className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                    <CardTitle className="text-lg text-blue-700 dark:text-blue-300">BMI Calculator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      Track your body mass index and health metrics
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border-green-200 dark:border-green-800 cursor-pointer"
                  onClick={() => setActiveTab("nutrient-tracker")}
                >
                  <CardHeader>
                    <Users className="w-10 h-10 text-green-500 mx-auto mb-3" />
                    <CardTitle className="text-lg text-green-700 dark:text-green-300">Nutrient Tracker</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      Monitor daily vitamins and minerals intake
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 cursor-pointer"
                  onClick={() => setActiveTab("recipe-book")}
                >
                  <CardHeader>
                    <BookOpen className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                    <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300">Recipe Book</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      Healthy Indian recipes with instructions
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800 cursor-pointer"
                  onClick={() => setActiveTab("food-reminders")}
                >
                  <CardHeader>
                    <Bell className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                    <CardTitle className="text-lg text-orange-700 dark:text-orange-300">Food Reminders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      Smart notifications for eating habits
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card
                  className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800 cursor-pointer"
                  onClick={() => {
                    setActiveTab("barcode-scanner")
                    setShowBarcodeModal(true)
                  }}
                >
                  <CardHeader>
                    <Scan className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <CardTitle className="text-lg text-red-700 dark:text-red-300">Barcode Scanner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      Scan products for nutritional information
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )
      case "diet-planner":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Smart Diet Planner
            </h2>
            <SmartDietPlanner />
          </div>
        )
      case "know-food":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Know Your Food
            </h2>
            <KnowYourFood />
          </div>
        )
      case "nutrient-tracker":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text text-transparent">
              Nutrient Tracker
            </h2>
            <NutrientTracker />
          </div>
        )
      case "recipe-book":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Recipe Book
            </h2>
            <RecipeBook />
          </div>
        )
      case "food-reminders":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Food Reminders
            </h2>
            <FoodReminders />
          </div>
        )
      case "bmi-calculator":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              BMI Calculator
            </h2>
            <BMICalculator />
          </div>
        )
      case "barcode-scanner":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Barcode Scanner
            </h2>
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
              <CardHeader>
                <CardTitle>Scan Products</CardTitle>
                <CardDescription>Instantly get nutritional information by scanning packaged food items</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setShowBarcodeModal(true)}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Start Scanning
                </Button>
              </CardContent>
            </Card>
          </div>
        )
      case "feedback":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Feedback
            </h2>
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
                <CardDescription>Help us improve Zaikabalance with your valuable feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Rate your experience</Label>
                    <div className="flex space-x-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="transition-colors"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= feedbackRating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="feedback-description">Tell us more about your experience</Label>
                    <Textarea
                      id="feedback-description"
                      placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                      value={feedbackDescription}
                      onChange={(e) => setFeedbackDescription(e.target.value)}
                      className="mt-2 min-h-[120px] border-pink-200 dark:border-pink-800 focus:border-pink-500"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    disabled={feedbackRating === 0}
                  >
                    Submit Feedback
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen relative dark:bg-gray-900 transition-colors duration-300">
      <AnimatedBackground />

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Zaikabalance
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("home")}
                className={`border-pink-300 dark:border-pink-600 ${activeTab === "home" ? "bg-pink-50 dark:bg-pink-900/20" : ""}`}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="border-purple-300 dark:border-purple-600"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button
                variant={activeTab === "feedback" ? "default" : "outline"}
                onClick={() => setActiveTab("feedback")}
                className={activeTab === "feedback" ? "bg-gradient-to-r from-pink-500 to-purple-500" : ""}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Feedback
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">{renderContent()}</main>

      {/* Barcode Scanner Modal */}
      <Dialog open={showBarcodeModal} onOpenChange={closeBarcodeModal}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
              <Scan className="w-6 h-6 text-red-600" />
              Barcode Scanner
            </DialogTitle>
            <DialogDescription>Scan or upload a barcode image to get nutritional information</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Scanner Options */}
            {!isScanning && !nutritionInfo && !isLoading && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={startCamera}
                  className="h-24 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex flex-col items-center justify-center"
                >
                  <Camera className="w-8 h-8 mb-2" />
                  Use Camera
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center border-2 border-dashed"
                >
                  <Upload className="w-8 h-8 mb-2" />
                  Upload Image
                </Button>
              </div>
            )}

            {/* Hidden file input */}
            <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

            {/* Camera View */}
            {isScanning && (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 bg-black rounded-lg"
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        videoRef.current.play().catch(console.error)
                      }
                    }}
                  />
                  <div className="absolute inset-0 border-2 border-red-500 rounded-lg pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-32 border-2 border-red-500 rounded-lg"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={captureImage}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-pink-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Processing barcode...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Nutrition Results */}
            {nutritionInfo && (
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-700 dark:text-green-300">
                      {nutritionInfo.Product}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="font-bold text-lg text-pink-600">{nutritionInfo.Energy}</div>
                        <div className="text-sm text-gray-500">kcal/100g</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="font-bold text-lg text-blue-600">{nutritionInfo.Proteins}g</div>
                        <div className="text-sm text-gray-500">Protein</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="font-bold text-lg text-orange-600">{nutritionInfo.Fat}g</div>
                        <div className="text-sm text-gray-500">Fat</div>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                        <div className="font-bold text-lg text-purple-600">{nutritionInfo.Sugars}g</div>
                        <div className="text-sm text-gray-500">Sugars</div>
                      </div>
                    </div>

                    {/* Additional nutrients if available */}
                    {(nutritionInfo.Carbohydrates || nutritionInfo.Fiber || nutritionInfo.Salt) && (
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {nutritionInfo.Carbohydrates && (
                          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                            <div className="font-bold text-lg text-green-600">{nutritionInfo.Carbohydrates}g</div>
                            <div className="text-sm text-gray-500">Carbs</div>
                          </div>
                        )}
                        {nutritionInfo.Fiber && (
                          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                            <div className="font-bold text-lg text-yellow-600">{nutritionInfo.Fiber}g</div>
                            <div className="text-sm text-gray-500">Fiber</div>
                          </div>
                        )}
                        {nutritionInfo.Salt && (
                          <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                            <div className="font-bold text-lg text-red-600">{nutritionInfo.Salt}g</div>
                            <div className="text-sm text-gray-500">Salt</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Recommendations:</h4>
                      <div className="space-y-2">
                        {recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={() => {
                    setNutritionInfo(null)
                    setRecommendations([])
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Scan Another Product
                </Button>
              </div>
            )}
          </div>

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </div>
  )
}
