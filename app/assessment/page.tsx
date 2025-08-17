"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AssessmentPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",

    // Health Goals
    primaryGoal: "",
    targetWeight: "",
    timeframe: "",

    // Dietary Preferences
    dietType: "",
    allergies: [],
    dislikes: "",
    mealsPerDay: "",

    // Health Conditions
    healthConditions: [],
    medications: "",
    additionalInfo: "",
  })

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Store data and redirect to recommendations
      localStorage.setItem("dietAssessment", JSON.stringify(formData))
      router.push("/recommendations")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateArrayField = (field: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diet Assessment</h1>
          <p className="text-gray-600">Help us understand your needs to create the perfect diet plan for you.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Health Goals"}
              {currentStep === 3 && "Dietary Preferences"}
              {currentStep === 4 && "Health & Medical"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your basic information"}
              {currentStep === 2 && "What are your health and fitness goals?"}
              {currentStep === 3 && "What are your food preferences and restrictions?"}
              {currentStep === 4 && "Any health conditions we should know about?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => updateFormData("age", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => updateFormData("height", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Current Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => updateFormData("weight", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Activity Level</Label>
                  <RadioGroup
                    value={formData.activityLevel}
                    onValueChange={(value) => updateFormData("activityLevel", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sedentary" id="sedentary" />
                      <Label htmlFor="sedentary">Sedentary (little to no exercise)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light">Lightly active (light exercise 1-3 days/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate">Moderately active (moderate exercise 3-5 days/week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very" id="very" />
                      <Label htmlFor="very">Very active (hard exercise 6-7 days/week)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Step 2: Health Goals */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label>Primary Goal</Label>
                  <RadioGroup
                    value={formData.primaryGoal}
                    onValueChange={(value) => updateFormData("primaryGoal", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lose-weight" id="lose-weight" />
                      <Label htmlFor="lose-weight">Lose Weight</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gain-weight" id="gain-weight" />
                      <Label htmlFor="gain-weight">Gain Weight</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maintain" id="maintain" />
                      <Label htmlFor="maintain">Maintain Current Weight</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="muscle" id="muscle" />
                      <Label htmlFor="muscle">Build Muscle</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="health" id="health" />
                      <Label htmlFor="health">Improve Overall Health</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-weight">Target Weight (kg)</Label>
                    <Input
                      id="target-weight"
                      type="number"
                      placeholder="65"
                      value={formData.targetWeight}
                      onChange={(e) => updateFormData("targetWeight", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Timeframe</Label>
                    <Select value={formData.timeframe} onValueChange={(value) => updateFormData("timeframe", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="3-months">3 Months</SelectItem>
                        <SelectItem value="6-months">6 Months</SelectItem>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="long-term">Long-term</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Dietary Preferences */}
            {currentStep === 3 && (
              <>
                <div>
                  <Label>Diet Type</Label>
                  <RadioGroup value={formData.dietType} onValueChange={(value) => updateFormData("dietType", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="omnivore" id="omnivore" />
                      <Label htmlFor="omnivore">Omnivore (no restrictions)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetarian" id="vegetarian" />
                      <Label htmlFor="vegetarian">Vegetarian</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegan" id="vegan" />
                      <Label htmlFor="vegan">Vegan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="keto" id="keto" />
                      <Label htmlFor="keto">Ketogenic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paleo" id="paleo" />
                      <Label htmlFor="paleo">Paleo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mediterranean" id="mediterranean" />
                      <Label htmlFor="mediterranean">Mediterranean</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Food Allergies & Intolerances</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["Nuts", "Dairy", "Gluten", "Eggs", "Soy", "Shellfish", "Fish", "Sesame"].map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={allergy}
                          checked={formData.allergies.includes(allergy)}
                          onCheckedChange={(checked) => updateArrayField("allergies", allergy, checked as boolean)}
                        />
                        <Label htmlFor={allergy}>{allergy}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="dislikes">Foods you dislike or want to avoid</Label>
                  <Textarea
                    id="dislikes"
                    placeholder="e.g., broccoli, spicy food, etc."
                    value={formData.dislikes}
                    onChange={(e) => updateFormData("dislikes", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Preferred meals per day</Label>
                  <Select value={formData.mealsPerDay} onValueChange={(value) => updateFormData("mealsPerDay", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meals per day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 meals</SelectItem>
                      <SelectItem value="4">4 meals</SelectItem>
                      <SelectItem value="5">5 meals</SelectItem>
                      <SelectItem value="6">6 meals</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 4: Health & Medical */}
            {currentStep === 4 && (
              <>
                <div>
                  <Label>Health Conditions</Label>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {[
                      "Diabetes",
                      "High Blood Pressure",
                      "High Cholesterol",
                      "Heart Disease",
                      "Thyroid Issues",
                      "PCOS",
                      "None",
                    ].map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={formData.healthConditions.includes(condition)}
                          onCheckedChange={(checked) =>
                            updateArrayField("healthConditions", condition, checked as boolean)
                          }
                        />
                        <Label htmlFor={condition}>{condition}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="medications">Current Medications or Supplements</Label>
                  <Textarea
                    id="medications"
                    placeholder="List any medications or supplements you're currently taking"
                    value={formData.medications}
                    onChange={(e) => updateFormData("medications", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="additional-info">Additional Information</Label>
                  <Textarea
                    id="additional-info"
                    placeholder="Anything else you'd like us to know about your health or dietary needs?"
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                  />
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNext} className="bg-green-600 hover:bg-green-700">
                {currentStep === totalSteps ? "Get Recommendations" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
