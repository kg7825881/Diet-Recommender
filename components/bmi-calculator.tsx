"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, User, Ruler, Weight, Calendar, TrendingUp, AlertCircle, CheckCircle, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BMIResult {
  bmi: number
  category: string
  healthRisk: string
  recommendations: string[]
  idealWeightRange: {
    min: number
    max: number
  }
}

export function BMICalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [result, setResult] = useState<BMIResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const calculateBMI = async () => {
    if (!height || !weight || !age || !gender) {
      setError("Please fill in all fields")
      return
    }

    if (Number(height) <= 0 || Number(weight) <= 0 || Number(age) <= 0) {
      setError("Please enter valid positive numbers")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Calculate BMI using the same logic as the Python file
      const heightInMeters = Number(height) / 100
      const weightInKg = Number(weight)
      const bmi = weightInKg / heightInMeters ** 2
      const roundedBMI = Math.round(bmi * 100) / 100

      // Determine category
      let category = ""
      let healthRisk = ""
      let recommendations: string[] = []

      if (roundedBMI < 18.5) {
        category = "Underweight"
        healthRisk = "Increased risk of nutritional deficiency, osteoporosis, and decreased immune function"
        recommendations = [
          "Increase caloric intake with nutrient-dense foods",
          "Include healthy fats like nuts, avocados, and olive oil",
          "Consider strength training to build muscle mass",
          "Consult a nutritionist for a personalized meal plan",
          "Monitor for underlying health conditions",
        ]
      } else if (roundedBMI >= 18.5 && roundedBMI < 25) {
        category = "Normal weight"
        healthRisk = "Low risk - maintain current lifestyle"
        recommendations = [
          "Maintain a balanced diet with variety of foods",
          "Continue regular physical activity (150 minutes/week)",
          "Stay hydrated and get adequate sleep",
          "Regular health check-ups for preventive care",
          "Focus on overall wellness and stress management",
        ]
      } else if (roundedBMI >= 25 && roundedBMI < 30) {
        category = "Overweight"
        healthRisk = "Increased risk of heart disease, diabetes, and high blood pressure"
        recommendations = [
          "Create a moderate caloric deficit (300-500 calories/day)",
          "Increase physical activity to 300 minutes/week",
          "Focus on whole foods and reduce processed foods",
          "Practice portion control and mindful eating",
          "Consider consulting a healthcare provider",
        ]
      } else {
        category = "Obese"
        healthRisk =
          "High risk of serious health complications including cardiovascular disease, type 2 diabetes, and sleep apnea"
        recommendations = [
          "Consult healthcare provider for comprehensive weight management plan",
          "Consider medically supervised weight loss program",
          "Start with low-impact exercises like walking or swimming",
          "Focus on sustainable dietary changes rather than crash diets",
          "Address underlying factors like stress, sleep, and medications",
        ]
      }

      // Calculate ideal weight range (BMI 18.5-24.9)
      const idealWeightMin = 18.5 * heightInMeters ** 2
      const idealWeightMax = 24.9 * heightInMeters ** 2

      // Adjust recommendations based on age and gender
      const ageNum = Number(age)
      if (ageNum >= 65) {
        recommendations.push("Consider age-appropriate exercise programs")
        recommendations.push("Ensure adequate protein intake for muscle maintenance")
      }

      if (gender === "female" && ageNum >= 18 && ageNum <= 50) {
        recommendations.push("Ensure adequate iron and calcium intake")
        if (category === "Underweight") {
          recommendations.push("Consider impact on reproductive health")
        }
      }

      setResult({
        bmi: roundedBMI,
        category,
        healthRisk,
        recommendations,
        idealWeightRange: {
          min: Math.round(idealWeightMin * 10) / 10,
          max: Math.round(idealWeightMax * 10) / 10,
        },
      })
    } catch (err) {
      setError("Error calculating BMI. Please check your inputs.")
    } finally {
      setIsLoading(false)
    }
  }

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return "text-blue-600"
    if (bmi < 25) return "text-green-600"
    if (bmi < 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getBMIBgColor = (bmi: number) => {
    if (bmi < 18.5) return "bg-blue-100 dark:bg-blue-900/20"
    if (bmi < 25) return "bg-green-100 dark:bg-green-900/20"
    if (bmi < 30) return "bg-yellow-100 dark:bg-yellow-900/20"
    return "bg-red-100 dark:bg-red-900/20"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Underweight":
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      case "Normal weight":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "Overweight":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "Obese":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          BMI Calculator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Calculate your Body Mass Index and get personalized health recommendations based on your age and gender
        </p>
      </div>

      {/* Calculator Form */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            BMI Calculation
          </CardTitle>
          <CardDescription>
            Enter your details to calculate your Body Mass Index and receive personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="height" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Height (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="age" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Age (years)
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Gender
                </Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={calculateBMI}
            disabled={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            {isLoading ? "Calculating..." : "Calculate BMI"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* BMI Result Card */}
          <Card className={`${getBMIBgColor(result.bmi)} border-2`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {getCategoryIcon(result.category)}
                  Your BMI Result
                </span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {result.bmi}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getBMIColor(result.bmi)}`}>{result.bmi}</div>
                  <div className="text-sm text-gray-500">BMI Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-xl font-semibold ${getBMIColor(result.bmi)}`}>{result.category}</div>
                  <div className="text-sm text-gray-500">Category</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    {result.idealWeightRange.min} - {result.idealWeightRange.max} kg
                  </div>
                  <div className="text-sm text-gray-500">Ideal Weight Range</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BMI Scale Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>BMI Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="font-medium">Underweight</span>
                  <span className="text-blue-600">{"< 18.5"}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="font-medium">Normal weight</span>
                  <span className="text-green-600">18.5 - 24.9</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <span className="font-medium">Overweight</span>
                  <span className="text-yellow-600">25.0 - 29.9</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="font-medium">Obese</span>
                  <span className="text-red-600">{"≥ 30.0"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Health Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">{result.healthRisk}</p>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Note */}
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Important Note:</p>
                  <p>
                    BMI is a screening tool and doesn't directly measure body fat or muscle mass. It may not be accurate
                    for athletes, elderly individuals, or people with certain medical conditions. Always consult with a
                    healthcare professional for personalized medical advice.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
