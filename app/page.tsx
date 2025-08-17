"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Target, Users, Zap, Sun, Moon, Apple, Coffee, Utensils } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    age: "",
    weight: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login data:", loginData)
    setShowLogin(false)
    // Redirect to dashboard after successful login
    router.push("/dashboard")
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    console.log("Signup data:", signupData)
    setShowSignup(false)
    setSignupSuccess(true)
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Forgot password email:", forgotPasswordEmail)
    alert("Password reset link sent to your email!")
    setShowForgotPassword(false)
    setForgotPasswordEmail("")
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

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen relative dark:bg-gray-900 transition-colors duration-300">
      <AnimatedBackground />

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Zaikabalance
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
            >
              Features
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="border-purple-300 dark:border-purple-600"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLogin(true)}
              className="border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-pink-600 dark:text-pink-400 dark:hover:bg-pink-900/20"
            >
              Login
            </Button>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              onClick={() => setShowSignup(true)}
            >
              Sign Up
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Smart Diet Planning for Indian Cuisine
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Combine machine learning with traditional Indian food wisdom to create personalized diet plans, track
            nutrition, and achieve your health goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 shadow-lg"
              onClick={() => setShowSignup(true)}
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/20 bg-transparent"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Everything You Need for Healthy Living
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
            Our comprehensive suite of tools helps you make informed decisions about your diet and nutrition
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border-pink-200 dark:border-pink-800">
              <CardHeader>
                <Target className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                <CardTitle className="text-lg text-pink-700 dark:text-pink-300">Smart Diet Planner</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  AI-powered meal planning tailored to Indian cuisine and your health goals
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <Zap className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <CardTitle className="text-lg text-purple-700 dark:text-purple-300">Know Your Food</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  Detailed nutritional information for traditional and modern Indian dishes
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <Users className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300">BMI Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  Track your body mass index and get personalized health recommendations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-yellow-50 dark:from-green-900/20 dark:to-yellow-900/20 border-green-200 dark:border-green-800">
              <CardHeader>
                <Target className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <CardTitle className="text-lg text-green-700 dark:text-green-300">Nutrient Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  Monitor your daily intake of vitamins, minerals, and macronutrients
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <Zap className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300">Recipe Book</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  Curated collection of healthy Indian recipes with step-by-step instructions
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <Users className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <CardTitle className="text-lg text-orange-700 dark:text-orange-300">Food Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  Smart notifications to help you maintain consistent eating habits
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800">
              <CardHeader>
                <Target className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <CardTitle className="text-lg text-red-700 dark:text-red-300">Barcode Scanner</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  Instantly get nutritional information by scanning packaged food items
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white relative z-10">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Join Over 10,000+ Happy Users</h2>
          <p className="text-xl mb-8 text-pink-100">
            Start your personalized nutrition journey today and see results in just 7 days. No more guessing what to
            eat!
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="px-8 py-3 bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
            onClick={() => setShowSignup(true)}
          >
            Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 px-4 relative z-10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Zaikabalance
            </span>
          </div>
          <p className="text-gray-400">© 2024 Zaikabalance. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
              Sign in to your Zaikabalance account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="login-email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="login-password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                onClick={() => {
                  setShowLogin(false)
                  setShowForgotPassword(true)
                }}
              >
                Forgot Password?
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Sign In
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                onClick={() => {
                  setShowLogin(false)
                  setShowSignup(true)
                }}
              >
                Don't have an account? Sign up
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
              Enter your email address and we'll send you a link to reset your password
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="forgot-email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Send Reset Link
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                onClick={() => {
                  setShowForgotPassword(false)
                  setShowLogin(true)
                }}
              >
                Back to Login
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={showSignup} onOpenChange={setShowSignup}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Create Account
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-300">
              Join Zaikabalance and start your health journey
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="signup-fullname" className="text-gray-700 dark:text-gray-300">
                Full Name
              </Label>
              <Input
                id="signup-fullname"
                type="text"
                placeholder="Enter your full name"
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                required
                className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="signup-email" className="text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
                className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="signup-age" className="text-gray-700 dark:text-gray-300">
                  Age
                </Label>
                <Input
                  id="signup-age"
                  type="number"
                  placeholder="Age"
                  value={signupData.age}
                  onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
                  required
                  className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
                />
              </div>
              <div>
                <Label htmlFor="signup-weight" className="text-gray-700 dark:text-gray-300">
                  Weight (kg)
                </Label>
                <Input
                  id="signup-weight"
                  type="number"
                  placeholder="Weight"
                  value={signupData.weight}
                  onChange={(e) => setSignupData({ ...signupData, weight: e.target.value })}
                  required
                  className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="signup-password" className="text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                  className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="signup-confirm-password" className="text-gray-700 dark:text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  required
                  className="border-pink-200 dark:border-pink-800 focus:border-pink-500 dark:bg-gray-700"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              Create Account
            </Button>
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
                onClick={() => {
                  setShowSignup(false)
                  setShowLogin(true)
                }}
              >
                Already have an account? Sign in
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={signupSuccess} onOpenChange={setSignupSuccess}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Account Created Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-pink-600 dark:text-pink-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Welcome to Zaikabalance! Your account has been successfully created. You can now start your personalized
              nutrition journey.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              onClick={() => {
                setSignupSuccess(false)
                setShowLogin(true)
              }}
            >
              Sign In to Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
