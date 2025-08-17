"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { User, Activity, Clock, CheckCircle, TrendingUp, Heart, Loader2, Download, Share2 } from "lucide-react"

interface UserProfile {
  age: string
  gender: string
  height: string
  weight: string
  activityLevel: string
  goal: string
  dietaryRestrictions: string[]
  healthConditions: string[]
  preferences: string[]
}

interface DietPlan {
  id: string
  title: string
  description: string
  duration: string
  totalCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  meals: Array<{
    type: string
    time: string
    name: string
    calories: number
    protein: number
    carbs: number
    fats: number
    ingredients: string[]
    instructions: string[]
  }>
  tips: string[]
  benefits: string[]
}

export function SmartDietPlanner() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPlan, setGeneratedPlan] = useState<DietPlan | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    goal: "",
    dietaryRestrictions: [],
    healthConditions: [],
    preferences: [],
  })

  // Additional form data
  const [formData, setFormData] = useState({
    targetWeight: "",
    timeframe: "",
    mealsPerDay: [3],
    cookingTime: "",
    budget: "",
    additionalNotes: "",
  })

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Dairy-Free",
    "Nut-Free",
    "Low-Sodium",
    "Diabetic-Friendly",
    "Heart-Healthy",
  ]

  const healthConditions = [
    "Diabetes",
    "Hypertension",
    "High Cholesterol",
    "PCOD/PCOS",
    "Thyroid Issues",
    "Digestive Issues",
    "Food Allergies",
    "None",
  ]

  const foodPreferences = [
    "North Indian",
    "South Indian",
    "West Indian",
    "East Indian",
    "Continental",
    "Mediterranean",
    "High Protein",
    "Low Carb",
  ]

  const handleInputChange = (field: keyof UserProfile, value: string | string[]) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFormDataChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleArrayOption = (field: keyof UserProfile, option: string) => {
    const currentArray = userProfile[field] as string[]
    const newArray = currentArray.includes(option)
      ? currentArray.filter((item) => item !== option)
      : [...currentArray, option]

    handleInputChange(field, newArray)
  }

  const generateDietPlan = async () => {
    setIsGenerating(true)

    try {
      // Simulate API call to generate diet plan
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock generated diet plan based on user profile
      const mockPlan: DietPlan = {
        id: Date.now().toString(),
        title: `Personalized ${userProfile.goal} Plan`,
        description: `A customized Indian diet plan designed for ${userProfile.goal.toLowerCase()} based on your preferences and health profile.`,
        duration: "7 days",
        totalCalories: calculateTargetCalories(),
        macros: {
          protein: Math.round((calculateTargetCalories() * 0.25) / 4),
          carbs: Math.round((calculateTargetCalories() * 0.45) / 4),
          fat: Math.round((calculateTargetCalories() * 0.3) / 9),
          fiber: 25,
        },
        meals: generateMeals(),
        tips: generateTips(),
        benefits: generateBenefits(),
      }

      setGeneratedPlan(mockPlan)

      // Save to localStorage for dashboard
      const dashboardPlan = {
        date: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        totalCalories: mockPlan.totalCalories,
        meals: mockPlan.meals.map((meal) => ({
          ...meal,
          status: "pending",
        })),
      }

      localStorage.setItem("currentDietPlan", JSON.stringify(dashboardPlan))

      // Dispatch custom event to notify dashboard
      const event = new CustomEvent("dietPlanUpdated", { detail: dashboardPlan })
      window.dispatchEvent(event)

      setCurrentStep(4)
    } catch (error) {
      console.error("Error generating diet plan:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const calculateTargetCalories = () => {
    const age = Number.parseInt(userProfile.age) || 25
    const weight = Number.parseInt(userProfile.weight) || 70
    const height = Number.parseInt(userProfile.height) || 170

    // Basic BMR calculation (Mifflin-St Jeor Equation)
    const bmr =
      userProfile.gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161

    // Activity factor
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      "very-active": 1.9,
    }

    const activityFactor = activityFactors[userProfile.activityLevel as keyof typeof activityFactors] || 1.2
    let targetCalories = bmr * activityFactor

    // Adjust based on goal
    if (userProfile.goal === "Weight Loss") {
      targetCalories -= 500 // 500 calorie deficit
    } else if (userProfile.goal === "Weight Gain") {
      targetCalories += 500 // 500 calorie surplus
    }

    return Math.round(targetCalories)
  }

  const generateMeals = () => {
    const targetCalories = calculateTargetCalories()
    const isVegetarian =
      userProfile.dietaryRestrictions.includes("Vegetarian") || userProfile.dietaryRestrictions.includes("Vegan")
    const mealsPerDay = formData.mealsPerDay[0]

    const mealTemplates = {
      3: [
        { type: "Breakfast", time: "8:00 AM", calorieRatio: 0.25 },
        { type: "Lunch", time: "1:00 PM", calorieRatio: 0.4 },
        { type: "Dinner", time: "7:30 PM", calorieRatio: 0.35 },
      ],
      4: [
        { type: "Breakfast", time: "8:00 AM", calorieRatio: 0.25 },
        { type: "Mid-Morning Snack", time: "10:30 AM", calorieRatio: 0.1 },
        { type: "Lunch", time: "1:00 PM", calorieRatio: 0.35 },
        { type: "Dinner", time: "7:30 PM", calorieRatio: 0.3 },
      ],
      5: [
        { type: "Breakfast", time: "8:00 AM", calorieRatio: 0.2 },
        { type: "Mid-Morning Snack", time: "10:30 AM", calorieRatio: 0.1 },
        { type: "Lunch", time: "1:00 PM", calorieRatio: 0.3 },
        { type: "Evening Snack", time: "4:00 PM", calorieRatio: 0.1 },
        { type: "Dinner", time: "7:30 PM", calorieRatio: 0.3 },
      ],
      6: [
        { type: "Breakfast", time: "8:00 AM", calorieRatio: 0.2 },
        { type: "Mid-Morning Snack", time: "10:30 AM", calorieRatio: 0.1 },
        { type: "Lunch", time: "1:00 PM", calorieRatio: 0.25 },
        { type: "Evening Snack", time: "4:00 PM", calorieRatio: 0.1 },
        { type: "Dinner", time: "7:30 PM", calorieRatio: 0.25 },
        { type: "Before Bed", time: "9:30 PM", calorieRatio: 0.1 },
      ],
    }

    const templates = mealTemplates[mealsPerDay as keyof typeof mealTemplates] || mealTemplates[3]

    const indianMeals = {
      vegetarian: {
        breakfast: [
          {
            name: "Vegetable Poha with Nuts",
            ingredients: ["Poha (flattened rice)", "Mixed vegetables", "Peanuts", "Curry leaves", "Mustard seeds"],
          },
          {
            name: "Oats Upma with Vegetables",
            ingredients: ["Oats", "Mixed vegetables", "Curry leaves", "Mustard seeds"],
          },
          { name: "Idli Sambar", ingredients: ["Idli", "Sambar", "Coconut chutney", "Curry leaves"] },
          { name: "Vegetable Paratha", ingredients: ["Whole wheat flour", "Mixed vegetables", "Yogurt", "Pickle"] },
        ],
        lunch: [
          {
            name: "Dal Khichdi with Vegetables",
            ingredients: ["Moong dal", "Brown rice", "Mixed vegetables", "Turmeric", "Cumin seeds"],
          },
          { name: "Rajma Chawal", ingredients: ["Kidney beans", "Rice", "Onions", "Tomatoes"] },
          { name: "Chole with Roti", ingredients: ["Chickpeas", "Whole wheat roti", "Onions", "Spices"] },
          { name: "Vegetable Biryani", ingredients: ["Basmati rice", "Mixed vegetables", "Yogurt", "Spices"] },
        ],
        dinner: [
          {
            name: "Paneer Tikka with Roti",
            ingredients: ["Paneer", "Whole wheat roti", "Bell peppers", "Yogurt", "Spices"],
          },
          { name: "Dal Tadka with Rice", ingredients: ["Toor dal", "Rice", "Ghee", "Cumin seeds"] },
          { name: "Vegetable Curry with Chapati", ingredients: ["Seasonal vegetables", "Chapati", "Onions", "Spices"] },
          { name: "Palak Paneer with Roti", ingredients: ["Spinach", "Paneer", "Roti", "Garam masala"] },
        ],
        snacks: [
          { name: "Green Tea with Almonds", ingredients: ["Green tea", "Almonds (10-12 pieces)", "Honey (optional)"] },
          {
            name: "Fruit Chaat with Chaat Masala",
            ingredients: ["Seasonal fruits", "Chaat masala", "Lemon juice", "Black salt"],
          },
          { name: "Roasted Chana", ingredients: ["Roasted chickpeas", "Lemon juice", "Black salt"] },
          { name: "Turmeric Milk", ingredients: ["Warm milk", "Turmeric", "Honey"] },
        ],
      },
      nonVegetarian: {
        breakfast: [
          {
            name: "Egg Paratha with Yogurt",
            ingredients: ["Whole wheat flour", "Eggs", "Yogurt", "Onions", "Green chilies"],
          },
          {
            name: "Chicken Sandwich",
            ingredients: ["Grilled chicken", "Whole grain bread", "Vegetables", "Mint chutney"],
          },
          { name: "Masala Omelette", ingredients: ["Eggs", "Onions", "Tomatoes", "Green chilies"] },
          { name: "Fish Curry with Rice", ingredients: ["Fish", "Rice", "Coconut", "Curry leaves"] },
        ],
        lunch: [
          {
            name: "Chicken Curry with Brown Rice",
            ingredients: ["Chicken breast", "Brown rice", "Onions", "Tomatoes", "Indian spices"],
          },
          { name: "Fish Curry with Rice", ingredients: ["Fish", "Rice", "Coconut milk", "Curry leaves"] },
          { name: "Mutton Curry with Roti", ingredients: ["Mutton", "Roti", "Onions", "Spices"] },
          { name: "Egg Curry with Rice", ingredients: ["Eggs", "Rice", "Tomatoes", "Onions"] },
        ],
        dinner: [
          {
            name: "Grilled Fish with Vegetables",
            ingredients: ["Fish fillet", "Mixed vegetables", "Olive oil", "Herbs", "Lemon"],
          },
          { name: "Chicken Tikka with Roti", ingredients: ["Chicken", "Roti", "Yogurt", "Spices"] },
          { name: "Chicken Dal with Rice", ingredients: ["Chicken", "Lentils", "Rice", "Turmeric"] },
          { name: "Fish Tikka with Vegetables", ingredients: ["Fish", "Mixed vegetables", "Yogurt", "Spices"] },
        ],
        snacks: [
          { name: "Boiled Eggs with Tea", ingredients: ["Boiled eggs", "Green tea", "Black pepper"] },
          { name: "Chicken Salad", ingredients: ["Grilled chicken", "Mixed greens", "Lemon dressing"] },
          { name: "Fish Fingers", ingredients: ["Fish", "Breadcrumbs", "Herbs", "Lemon"] },
          { name: "Protein Smoothie", ingredients: ["Protein powder", "Milk", "Banana", "Honey"] },
        ],
      },
    }

    const mealType = isVegetarian ? "vegetarian" : "nonVegetarian"

    return templates.map((template) => {
      const calories = Math.round(targetCalories * template.calorieRatio)
      let mealOptions

      if (template.type.includes("Snack") || template.type === "Before Bed") {
        mealOptions = indianMeals[mealType].snacks
      } else if (template.type === "Breakfast") {
        mealOptions = indianMeals[mealType].breakfast
      } else if (template.type === "Lunch") {
        mealOptions = indianMeals[mealType].lunch
      } else {
        mealOptions = indianMeals[mealType].dinner
      }

      const selectedMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)]

      return {
        type: template.type,
        time: template.time,
        name: selectedMeal.name,
        calories,
        protein: Math.round((calories * 0.25) / 4),
        carbs: Math.round((calories * 0.45) / 4),
        fats: Math.round((calories * 0.3) / 9),
        ingredients: selectedMeal.ingredients,
        instructions: [
          "Cook ingredients with spices and seasonings",
          "Follow traditional Indian cooking methods",
          "Serve hot with accompaniments",
          "Garnish with fresh herbs if desired",
        ],
      }
    })
  }

  const generateTips = () => {
    const tips = [
      "Drink at least 8-10 glasses of water daily",
      "Include a variety of colorful vegetables in your meals",
      "Eat slowly and chew your food thoroughly",
      "Avoid processed and packaged foods",
      "Include physical activity for at least 30 minutes daily",
    ]

    if (userProfile.goal === "Weight Loss") {
      tips.push("Control portion sizes and avoid late-night eating")
      tips.push("Include more fiber-rich foods to feel full longer")
    }

    if (userProfile.healthConditions.includes("Diabetes")) {
      tips.push("Monitor blood sugar levels regularly")
      tips.push("Choose complex carbohydrates over simple sugars")
    }

    return tips
  }

  const generateBenefits = () => {
    const benefits = [
      "Improved energy levels throughout the day",
      "Better digestion and gut health",
      "Enhanced immune system function",
      "Balanced nutrition with Indian flavors",
    ]

    if (userProfile.goal === "Weight Loss") {
      benefits.push("Sustainable weight loss without compromising nutrition")
      benefits.push("Reduced risk of lifestyle diseases")
    } else if (userProfile.goal === "Weight Gain") {
      benefits.push("Healthy weight gain with muscle building")
      benefits.push("Improved strength and stamina")
    }

    return benefits
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else if (currentStep === 3) {
      generateDietPlan()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return userProfile.age && userProfile.gender && userProfile.height && userProfile.weight
      case 2:
        return userProfile.activityLevel && userProfile.goal
      case 3:
        return true // Optional fields
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Personal Information</h3>
              <p className="text-gray-600 dark:text-gray-300">Tell us about yourself to create a personalized plan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 25"
                  value={userProfile.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={userProfile.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="height">Height (cm) *</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 170"
                  value={userProfile.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70"
                  value={userProfile.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Activity className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Lifestyle & Goals</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Help us understand your activity level and health goals
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="activity">Activity Level *</Label>
                <Select
                  value={userProfile.activityLevel}
                  onValueChange={(value) => handleInputChange("activityLevel", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                    <SelectItem value="light">Light (Light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (Moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (Hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very-active">Very Active (Very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goal">Primary Goal *</Label>
                <Select value={userProfile.goal} onValueChange={(value) => handleInputChange("goal", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Weight Gain">Weight Gain</SelectItem>
                    <SelectItem value="Muscle Building">Muscle Building</SelectItem>
                    <SelectItem value="Maintenance">Maintain Current Weight</SelectItem>
                    <SelectItem value="General Health">General Health & Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="e.g., 65"
                  value={formData.targetWeight}
                  onChange={(e) => handleFormDataChange("targetWeight", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="mealsPerDay">Meals per Day</Label>
                <div className="mt-2">
                  <Slider
                    value={formData.mealsPerDay}
                    onValueChange={(value) => handleFormDataChange("mealsPerDay", value)}
                    max={6}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>3 meals</span>
                    <span className="font-medium">{formData.mealsPerDay[0]} meals</span>
                    <span>6 meals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Health & Preferences</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Customize your plan based on dietary restrictions and preferences
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Dietary Restrictions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {dietaryOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={userProfile.dietaryRestrictions.includes(option)}
                        onCheckedChange={(checked) => toggleArrayOption("dietaryRestrictions", option)}
                      />
                      <Label htmlFor={option} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Health Conditions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {healthConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={userProfile.healthConditions.includes(condition)}
                        onCheckedChange={(checked) => toggleArrayOption("healthConditions", condition)}
                      />
                      <Label htmlFor={condition} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Food Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {foodPreferences.map((preference) => (
                    <div key={preference} className="flex items-center space-x-2">
                      <Checkbox
                        id={preference}
                        checked={userProfile.preferences.includes(preference)}
                        onCheckedChange={(checked) => toggleArrayOption("preferences", preference)}
                      />
                      <Label htmlFor={preference} className="text-sm">
                        {preference}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="cookingTime">Available Cooking Time</Label>
                <Select
                  value={formData.cookingTime}
                  onValueChange={(value) => handleFormDataChange("cookingTime", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select cooking time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-min">Less than 15 minutes</SelectItem>
                    <SelectItem value="30-min">15-30 minutes</SelectItem>
                    <SelectItem value="45-min">30-45 minutes</SelectItem>
                    <SelectItem value="60-min">45-60 minutes</SelectItem>
                    <SelectItem value="60-plus">More than 60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any specific requirements, allergies, or preferences..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleFormDataChange("additionalNotes", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return generatedPlan ? (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Your Personalized Diet Plan</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Here's your customized plan based on your profile and preferences
              </p>
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{generatedPlan.title}</span>
                  <Badge variant="outline">{generatedPlan.duration}</Badge>
                </CardTitle>
                <CardDescription>{generatedPlan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-bold text-lg text-pink-600">{generatedPlan.totalCalories}</div>
                    <div className="text-sm text-gray-500">Daily Calories</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-bold text-lg text-blue-600">{generatedPlan.macros.protein}g</div>
                    <div className="text-sm text-gray-500">Protein</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-bold text-lg text-green-600">{generatedPlan.macros.carbs}g</div>
                    <div className="text-sm text-gray-500">Carbs</div>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-bold text-lg text-orange-600">{generatedPlan.macros.fat}g</div>
                    <div className="text-sm text-gray-500">Fat</div>
                  </div>
                </div>

                <Tabs defaultValue="meals" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="meals">Daily Meals</TabsTrigger>
                    <TabsTrigger value="tips">Tips</TabsTrigger>
                    <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  </TabsList>

                  <TabsContent value="meals" className="space-y-4">
                    {generatedPlan.meals.map((meal, index) => (
                      <Card key={index} className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{meal.name}</CardTitle>
                              <CardDescription className="flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {meal.time}
                                </span>
                                <span className="font-medium text-purple-600">{meal.type}</span>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="font-bold text-pink-600">{meal.calories}</div>
                              <div className="text-gray-500">Calories</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="font-bold text-blue-600">{meal.protein}g</div>
                              <div className="text-gray-500">Protein</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="font-bold text-green-600">{meal.carbs}g</div>
                              <div className="text-gray-500">Carbs</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="font-bold text-orange-600">{meal.fats}g</div>
                              <div className="text-gray-500">Fats</div>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">Ingredients:</p>
                            <div className="flex flex-wrap gap-2">
                              {meal.ingredients.map((ingredient, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {ingredient}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">Instructions:</p>
                            <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                              {meal.instructions.map((instruction, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="font-medium">{i + 1}.</span>
                                  <span>{instruction}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="tips" className="space-y-3">
                    {generatedPlan.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="benefits" className="space-y-3">
                    {generatedPlan.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <div className="flex gap-4 mt-6">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download Plan
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Smart Diet Planner
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Get a personalized Indian diet plan tailored to your health goals, preferences, and lifestyle
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                step <= currentStep
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
            </div>
            {step < 4 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step < currentStep ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-8">
          {isGenerating ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-pink-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Generating Your Personalized Diet Plan</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI is analyzing your profile and creating the perfect plan for you...
              </p>
            </div>
          ) : (
            renderStep()
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {!isGenerating && currentStep < 4 && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="px-8 bg-transparent">
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={!isStepValid()}
            className="px-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            {currentStep === 3 ? "Generate Plan" : "Next"}
          </Button>
        </div>
      )}

      {/* Reset Button */}
      {currentStep === 4 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentStep(1)
              setGeneratedPlan(null)
              setUserProfile({
                age: "",
                gender: "",
                height: "",
                weight: "",
                activityLevel: "",
                goal: "",
                dietaryRestrictions: [],
                healthConditions: [],
                preferences: [],
              })
              setFormData({
                targetWeight: "",
                timeframe: "",
                mealsPerDay: [3],
                cookingTime: "",
                budget: "",
                additionalNotes: "",
              })
            }}
            className="px-8"
          >
            Create Another Plan
          </Button>
        </div>
      )}
    </div>
  )
}
