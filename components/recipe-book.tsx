"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, Users, ChefHat, Search, Star, Flame, Leaf, MapPin, BookOpen, Heart, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Recipe {
  id: string
  name: string
  category: string
  region: string
  cookTime: number
  servings: number
  difficulty: "Easy" | "Medium" | "Hard"
  isVegetarian: boolean
  calories: number
  rating: number
  image: string
  description: string
  ingredients: string[]
  instructions: string[]
  tips: string[]
  nutritionalInfo: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

const recipes: Recipe[] = [
  // North Indian Recipes
  {
    id: "ni1",
    name: "Butter Chicken",
    category: "Main Course",
    region: "North Indian",
    cookTime: 45,
    servings: 4,
    difficulty: "Medium",
    isVegetarian: false,
    calories: 420,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Butter Chicken")}`,
    description: "Creamy and rich chicken curry with aromatic spices, perfect with naan or rice.",
    ingredients: [
      "500g chicken breast, cubed",
      "1 cup heavy cream",
      "2 tbsp butter",
      "1 large onion, chopped",
      "3 cloves garlic, minced",
      "1 inch ginger, grated",
      "2 tbsp tomato paste",
      "1 tsp garam masala",
      "1 tsp cumin powder",
      "1 tsp coriander powder",
      "1/2 tsp turmeric",
      "1/2 tsp red chili powder",
      "Salt to taste",
      "Fresh cilantro for garnish",
    ],
    instructions: [
      "Marinate chicken with yogurt, ginger-garlic paste, and spices for 30 minutes",
      "Heat butter in a pan and cook marinated chicken until golden brown",
      "Remove chicken and set aside",
      "In the same pan, sauté onions until golden",
      "Add ginger, garlic, and tomato paste. Cook for 2 minutes",
      "Add all dry spices and cook for 1 minute",
      "Add cream and bring to a simmer",
      "Return chicken to the pan and simmer for 10-15 minutes",
      "Garnish with fresh cilantro and serve hot",
    ],
    tips: [
      "Marinating chicken longer enhances flavor",
      "Use cashew paste for extra richness",
      "Adjust spice levels according to preference",
    ],
    nutritionalInfo: {
      protein: 35,
      carbs: 8,
      fat: 28,
      fiber: 2,
    },
  },
  {
    id: "ni2",
    name: "Dal Makhani",
    category: "Main Course",
    region: "North Indian",
    cookTime: 60,
    servings: 6,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 280,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Dal Makhani")}`,
    description: "Rich and creamy black lentil curry slow-cooked with butter and cream.",
    ingredients: [
      "1 cup black urad dal",
      "1/4 cup kidney beans",
      "3 tbsp butter",
      "1/2 cup heavy cream",
      "1 large onion, chopped",
      "3 tomatoes, chopped",
      "1 tbsp ginger-garlic paste",
      "1 tsp cumin seeds",
      "1 tsp garam masala",
      "1/2 tsp red chili powder",
      "Salt to taste",
    ],
    instructions: [
      "Soak dal and kidney beans overnight",
      "Pressure cook with salt until soft and mushy",
      "Heat butter in a pan, add cumin seeds",
      "Add onions and cook until golden",
      "Add ginger-garlic paste and tomatoes",
      "Cook until tomatoes break down completely",
      "Add cooked dal and simmer for 30 minutes",
      "Add cream and garam masala",
      "Simmer for 10 more minutes and serve",
    ],
    tips: [
      "Slow cooking enhances the flavor",
      "Mash some dal for better texture",
      "Add cream gradually to prevent curdling",
    ],
    nutritionalInfo: {
      protein: 18,
      carbs: 35,
      fat: 12,
      fiber: 8,
    },
  },
  {
    id: "ni3",
    name: "Chole Bhature",
    category: "Main Course",
    region: "North Indian",
    cookTime: 90,
    servings: 4,
    difficulty: "Hard",
    isVegetarian: true,
    calories: 450,
    rating: 4.9,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Chole Bhature")}`,
    description: "Spicy chickpea curry served with fluffy deep-fried bread.",
    ingredients: [
      "2 cups chickpeas, soaked overnight",
      "2 cups all-purpose flour",
      "1/4 cup yogurt",
      "1 tsp baking powder",
      "2 large onions, chopped",
      "3 tomatoes, chopped",
      "2 tbsp chole masala",
      "1 tsp cumin seeds",
      "Oil for deep frying",
      "Salt to taste",
    ],
    instructions: [
      "Pressure cook chickpeas with salt and tea bags for color",
      "For bhature, mix flour, yogurt, baking powder, and salt",
      "Knead into soft dough and rest for 2 hours",
      "Heat oil in pan, add cumin seeds and onions",
      "Add tomatoes and cook until soft",
      "Add chickpeas and chole masala",
      "Simmer for 20 minutes",
      "Roll bhature and deep fry until puffed",
      "Serve hot chole with bhature",
    ],
    tips: [
      "Tea bags give authentic color to chole",
      "Rest the dough for fluffy bhature",
      "Serve immediately for best taste",
    ],
    nutritionalInfo: {
      protein: 16,
      carbs: 58,
      fat: 18,
      fiber: 12,
    },
  },
  {
    id: "ni4",
    name: "Rajma Chawal",
    category: "Main Course",
    region: "North Indian",
    cookTime: 50,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 320,
    rating: 4.6,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Rajma Chawal")}`,
    description: "Kidney bean curry served with steamed rice, a comfort food favorite.",
    ingredients: [
      "2 cups kidney beans, soaked overnight",
      "1 cup basmati rice",
      "2 onions, chopped",
      "3 tomatoes, chopped",
      "1 tbsp ginger-garlic paste",
      "2 tsp rajma masala",
      "1 tsp cumin seeds",
      "1/2 tsp turmeric",
      "2 tbsp oil",
      "Salt to taste",
    ],
    instructions: [
      "Pressure cook kidney beans until soft",
      "Cook rice separately and keep warm",
      "Heat oil, add cumin seeds",
      "Add onions and cook until golden",
      "Add ginger-garlic paste and tomatoes",
      "Cook until tomatoes are soft",
      "Add cooked rajma and spices",
      "Simmer for 15-20 minutes",
      "Serve hot with rice",
    ],
    tips: [
      "Soak beans overnight for better cooking",
      "Mash some beans for thick gravy",
      "Garnish with fresh coriander",
    ],
    nutritionalInfo: {
      protein: 14,
      carbs: 52,
      fat: 8,
      fiber: 10,
    },
  },
  {
    id: "ni5",
    name: "Aloo Gobi",
    category: "Main Course",
    region: "North Indian",
    cookTime: 30,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 180,
    rating: 4.4,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Aloo Gobi")}`,
    description: "Dry curry of potatoes and cauliflower with aromatic spices.",
    ingredients: [
      "3 large potatoes, cubed",
      "1 medium cauliflower, cut into florets",
      "2 onions, sliced",
      "2 tsp ginger-garlic paste",
      "2 tomatoes, chopped",
      "1 tsp cumin seeds",
      "1 tsp coriander powder",
      "1/2 tsp turmeric",
      "1 tsp garam masala",
      "3 tbsp oil",
      "Salt to taste",
    ],
    instructions: [
      "Heat oil in a pan, add cumin seeds",
      "Add potatoes and fry until golden",
      "Add cauliflower and cook for 5 minutes",
      "Add onions and ginger-garlic paste",
      "Add tomatoes and all spices",
      "Cover and cook on low heat for 15 minutes",
      "Stir occasionally to prevent sticking",
      "Garnish with coriander and serve",
    ],
    tips: [
      "Don't add water, let vegetables cook in their own moisture",
      "Cut vegetables uniformly for even cooking",
      "Serve with roti or rice",
    ],
    nutritionalInfo: {
      protein: 6,
      carbs: 32,
      fat: 8,
      fiber: 6,
    },
  },
  {
    id: "ni6",
    name: "Paneer Tikka",
    category: "Appetizer",
    region: "North Indian",
    cookTime: 25,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 250,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Paneer Tikka")}`,
    description: "Grilled cottage cheese cubes marinated in spiced yogurt.",
    ingredients: [
      "400g paneer, cubed",
      "1 cup thick yogurt",
      "1 tbsp ginger-garlic paste",
      "1 tsp red chili powder",
      "1/2 tsp turmeric",
      "1 tsp garam masala",
      "1 tbsp lemon juice",
      "2 tbsp oil",
      "1 bell pepper, cubed",
      "1 onion, cubed",
      "Salt to taste",
    ],
    instructions: [
      "Mix yogurt with all spices and salt",
      "Add paneer, bell pepper, and onion to marinade",
      "Marinate for at least 30 minutes",
      "Thread onto skewers alternating paneer and vegetables",
      "Grill in oven or on stovetop until golden",
      "Turn occasionally for even cooking",
      "Brush with oil while grilling",
      "Serve hot with mint chutney",
    ],
    tips: [
      "Use thick yogurt to prevent dripping",
      "Don't over-marinate as paneer may become soft",
      "Soak wooden skewers in water before use",
    ],
    nutritionalInfo: {
      protein: 18,
      carbs: 8,
      fat: 16,
      fiber: 2,
    },
  },
  {
    id: "ni7",
    name: "Naan",
    category: "Bread",
    region: "North Indian",
    cookTime: 40,
    servings: 8,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 220,
    rating: 4.5,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Naan")}`,
    description: "Soft and fluffy leavened bread perfect with curries.",
    ingredients: [
      "2 cups all-purpose flour",
      "1/2 cup yogurt",
      "1 tsp active dry yeast",
      "1 tsp sugar",
      "1/2 tsp salt",
      "2 tbsp oil",
      "1/4 cup warm milk",
      "2 tbsp butter for brushing",
      "Nigella seeds for topping",
    ],
    instructions: [
      "Dissolve yeast and sugar in warm milk",
      "Mix flour, salt, yogurt, and oil",
      "Add yeast mixture and knead into soft dough",
      "Let rise for 2 hours until doubled",
      "Divide into 8 portions",
      "Roll each into oval shape",
      "Cook on hot tawa or skillet",
      "Brush with butter and sprinkle seeds",
    ],
    tips: ["Ensure yeast is active before using", "Don't make dough too stiff", "Cook on high heat for best results"],
    nutritionalInfo: {
      protein: 6,
      carbs: 38,
      fat: 6,
      fiber: 2,
    },
  },
  {
    id: "ni8",
    name: "Lassi",
    category: "Beverage",
    region: "North Indian",
    cookTime: 5,
    servings: 2,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 150,
    rating: 4.6,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Lassi")}`,
    description: "Refreshing yogurt-based drink, perfect for hot weather.",
    ingredients: [
      "1 cup thick yogurt",
      "1/2 cup cold milk",
      "2 tbsp sugar",
      "1/4 tsp cardamom powder",
      "Ice cubes",
      "Chopped pistachios for garnish",
      "Optional: 1 ripe mango for mango lassi",
    ],
    instructions: [
      "Whisk yogurt until smooth",
      "Add milk, sugar, and cardamom",
      "Blend until frothy",
      "Add ice cubes and blend again",
      "For mango lassi, add mango pulp",
      "Pour into glasses",
      "Garnish with pistachios",
      "Serve immediately",
    ],
    tips: [
      "Use chilled ingredients for best taste",
      "Adjust sugar according to preference",
      "Add rose water for floral flavor",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 18,
      fat: 6,
      fiber: 0,
    },
  },
  {
    id: "ni9",
    name: "Samosa",
    category: "Snack",
    region: "North Indian",
    cookTime: 60,
    servings: 12,
    difficulty: "Hard",
    isVegetarian: true,
    calories: 180,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Samosa")}`,
    description: "Crispy triangular pastries filled with spiced potato mixture.",
    ingredients: [
      "2 cups all-purpose flour",
      "4 tbsp oil",
      "4 large potatoes, boiled and cubed",
      "1 cup green peas",
      "2 tsp cumin seeds",
      "1 tsp coriander seeds",
      "2 green chilies, chopped",
      "1 inch ginger, minced",
      "1 tsp garam masala",
      "Oil for deep frying",
      "Salt to taste",
    ],
    instructions: [
      "Make dough with flour, oil, and water. Rest for 30 minutes",
      "Heat oil, add cumin and coriander seeds",
      "Add ginger, green chilies, and peas",
      "Add potatoes and spices, mix well",
      "Cool the filling completely",
      "Roll dough into small circles, cut in half",
      "Form cones and fill with potato mixture",
      "Seal edges with water",
      "Deep fry until golden and crispy",
    ],
    tips: [
      "Ensure filling is completely cool before using",
      "Seal edges properly to prevent opening",
      "Fry on medium heat for even cooking",
    ],
    nutritionalInfo: {
      protein: 4,
      carbs: 22,
      fat: 10,
      fiber: 3,
    },
  },
  {
    id: "ni10",
    name: "Kulfi",
    category: "Dessert",
    region: "North Indian",
    cookTime: 240,
    servings: 6,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 200,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Kulfi")}`,
    description: "Traditional Indian ice cream with rich, creamy texture and cardamom flavor.",
    ingredients: [
      "1 liter full-fat milk",
      "1/2 cup sugar",
      "1/4 cup chopped almonds",
      "1/4 cup chopped pistachios",
      "1/2 tsp cardamom powder",
      "2 tbsp cornstarch",
      "1/4 cup milk for cornstarch",
      "Silver leaf for garnish (optional)",
    ],
    instructions: [
      "Boil milk in heavy-bottomed pan",
      "Reduce to half, stirring continuously",
      "Mix cornstarch with milk and add to boiling milk",
      "Add sugar and cardamom powder",
      "Cook until thick, stirring constantly",
      "Add chopped nuts and mix",
      "Cool completely",
      "Pour into kulfi molds and freeze for 4 hours",
      "Garnish with silver leaf before serving",
    ],
    tips: [
      "Stir continuously to prevent burning",
      "Use full-fat milk for rich texture",
      "Freeze overnight for best results",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 24,
      fat: 10,
      fiber: 1,
    },
  },

  // South Indian Recipes
  {
    id: "si1",
    name: "Masala Dosa",
    category: "Main Course",
    region: "South Indian",
    cookTime: 30,
    servings: 4,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 280,
    rating: 4.9,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Masala Dosa")}`,
    description: "Crispy rice and lentil crepe filled with spiced potato curry.",
    ingredients: [
      "2 cups dosa batter (fermented)",
      "4 large potatoes, boiled",
      "2 onions, sliced",
      "2 tsp mustard seeds",
      "1 tsp cumin seeds",
      "10-12 curry leaves",
      "2 green chilies, slit",
      "1/2 tsp turmeric",
      "1 tsp ginger, minced",
      "3 tbsp oil",
      "Salt to taste",
      "Coriander for garnish",
    ],
    instructions: [
      "Heat oil in pan, add mustard seeds",
      "Add cumin seeds, curry leaves, and green chilies",
      "Add onions and cook until translucent",
      "Add ginger and turmeric",
      "Add mashed potatoes and salt",
      "Cook for 5 minutes, garnish with coriander",
      "Heat dosa pan, spread batter thinly",
      "Cook until golden, add potato filling",
      "Fold and serve with chutney and sambar",
    ],
    tips: [
      "Batter should be fermented for 8-12 hours",
      "Use non-stick pan for best results",
      "Serve immediately while crispy",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 48,
      fat: 8,
      fiber: 4,
    },
  },
  {
    id: "si2",
    name: "Idli Sambar",
    category: "Main Course",
    region: "South Indian",
    cookTime: 45,
    servings: 4,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 220,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Idli Sambar")}`,
    description: "Steamed rice cakes served with lentil curry and coconut chutney.",
    ingredients: [
      "2 cups idli batter (fermented)",
      "1 cup toor dal",
      "2 tbsp sambar powder",
      "1 small brinjal, cubed",
      "1 tomato, chopped",
      "1 onion, chopped",
      "10 curry leaves",
      "2 tsp mustard seeds",
      "1/2 tsp turmeric",
      "2 tbsp oil",
      "Salt to taste",
      "Tamarind paste",
    ],
    instructions: [
      "Steam idli batter in idli maker for 12-15 minutes",
      "Pressure cook toor dal until soft",
      "Heat oil, add mustard seeds and curry leaves",
      "Add onions, cook until soft",
      "Add vegetables and cook for 5 minutes",
      "Add cooked dal, sambar powder, and turmeric",
      "Add tamarind paste and salt",
      "Simmer for 15 minutes",
      "Serve hot idlis with sambar",
    ],
    tips: ["Batter should be well fermented", "Adjust tamarind for desired sourness", "Add vegetables of your choice"],
    nutritionalInfo: {
      protein: 12,
      carbs: 38,
      fat: 6,
      fiber: 6,
    },
  },
  {
    id: "si3",
    name: "Chicken Chettinad",
    category: "Main Course",
    region: "South Indian",
    cookTime: 50,
    servings: 4,
    difficulty: "Hard",
    isVegetarian: false,
    calories: 380,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Chicken Chettinad")}`,
    description: "Spicy chicken curry from Tamil Nadu with aromatic spices.",
    ingredients: [
      "1 kg chicken, cut into pieces",
      "2 onions, sliced",
      "4 tomatoes, chopped",
      "1 tbsp ginger-garlic paste",
      "2 tbsp chettinad masala powder",
      "1 tsp red chili powder",
      "1/2 tsp turmeric",
      "15 curry leaves",
      "4 tbsp coconut oil",
      "1 cup coconut milk",
      "Salt to taste",
    ],
    instructions: [
      "Marinate chicken with turmeric and salt",
      "Heat coconut oil in heavy-bottomed pan",
      "Add curry leaves and onions",
      "Cook until onions are golden brown",
      "Add ginger-garlic paste and tomatoes",
      "Add chettinad masala and chili powder",
      "Add chicken and cook until done",
      "Add coconut milk and simmer",
      "Cook until oil separates",
    ],
    tips: [
      "Use freshly ground chettinad masala",
      "Cook on high heat initially",
      "Coconut oil is essential for authentic taste",
    ],
    nutritionalInfo: {
      protein: 42,
      carbs: 8,
      fat: 22,
      fiber: 2,
    },
  },
  {
    id: "si4",
    name: "Rasam",
    category: "Soup",
    region: "South Indian",
    cookTime: 25,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 80,
    rating: 4.6,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Rasam")}`,
    description: "Tangy and spicy South Indian soup with tamarind and tomatoes.",
    ingredients: [
      "2 tomatoes, chopped",
      "2 tbsp tamarind paste",
      "1 tbsp rasam powder",
      "1/2 tsp turmeric",
      "1 tsp mustard seeds",
      "1 tsp cumin seeds",
      "2 dry red chilies",
      "10 curry leaves",
      "2 tbsp ghee",
      "Salt to taste",
      "Coriander for garnish",
    ],
    instructions: [
      "Heat ghee in pan, add mustard seeds",
      "Add cumin seeds, red chilies, and curry leaves",
      "Add tomatoes and cook until soft",
      "Add tamarind paste and 2 cups water",
      "Add rasam powder, turmeric, and salt",
      "Bring to boil and simmer for 10 minutes",
      "Garnish with coriander",
      "Serve hot with rice",
    ],
    tips: [
      "Don't boil for too long after adding tamarind",
      "Adjust spice levels as per taste",
      "Fresh curry leaves enhance flavor",
    ],
    nutritionalInfo: {
      protein: 2,
      carbs: 12,
      fat: 4,
      fiber: 2,
    },
  },
  {
    id: "si5",
    name: "Coconut Rice",
    category: "Main Course",
    region: "South Indian",
    cookTime: 30,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 320,
    rating: 4.5,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Coconut Rice")}`,
    description: "Fragrant rice cooked with fresh coconut and South Indian spices.",
    ingredients: [
      "2 cups cooked rice",
      "1 cup fresh coconut, grated",
      "2 tsp mustard seeds",
      "1 tsp cumin seeds",
      "2 dry red chilies",
      "10 curry leaves",
      "1/4 cup peanuts",
      "1/4 cup cashews",
      "3 tbsp coconut oil",
      "1/2 tsp turmeric",
      "Salt to taste",
    ],
    instructions: [
      "Heat coconut oil in pan",
      "Add mustard seeds, cumin seeds, and red chilies",
      "Add curry leaves, peanuts, and cashews",
      "Fry until golden brown",
      "Add grated coconut and turmeric",
      "Sauté for 2-3 minutes",
      "Add cooked rice and salt",
      "Mix gently and serve warm",
    ],
    tips: [
      "Use day-old rice for best texture",
      "Fresh coconut gives better flavor",
      "Don't overmix to avoid mushy rice",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 52,
      fat: 12,
      fiber: 4,
    },
  },
  {
    id: "si6",
    name: "Medu Vada",
    category: "Snack",
    region: "South Indian",
    cookTime: 40,
    servings: 8,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 150,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Medu Vada")}`,
    description: "Crispy donut-shaped fritters made from black gram dal.",
    ingredients: [
      "2 cups urad dal (black gram)",
      "1 inch ginger, minced",
      "2 green chilies, chopped",
      "10 curry leaves, chopped",
      "1 tsp cumin seeds",
      "1/4 cup onions, finely chopped",
      "Oil for deep frying",
      "Salt to taste",
      "Water as needed",
    ],
    instructions: [
      "Soak urad dal for 4 hours",
      "Grind to smooth, fluffy batter with minimal water",
      "Add ginger, green chilies, curry leaves",
      "Add cumin seeds, onions, and salt",
      "Mix well in one direction",
      "Heat oil for deep frying",
      "Wet hands, make hole in center of batter portion",
      "Slide into hot oil and fry until golden",
      "Serve hot with chutney",
    ],
    tips: [
      "Batter should be fluffy and light",
      "Don't add too much water while grinding",
      "Fry on medium heat for even cooking",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 16,
      fat: 8,
      fiber: 4,
    },
  },
  {
    id: "si7",
    name: "Filter Coffee",
    category: "Beverage",
    region: "South Indian",
    cookTime: 10,
    servings: 2,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 60,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Filter Coffee")}`,
    description: "Traditional South Indian coffee brewed with chicory and served with milk.",
    ingredients: [
      "2 tbsp coffee powder (with chicory)",
      "1 cup hot water",
      "1 cup milk",
      "2 tbsp sugar",
      "Traditional coffee filter",
    ],
    instructions: [
      "Add coffee powder to filter top compartment",
      "Pour hot water slowly over coffee powder",
      "Let it drip for 10-15 minutes",
      "Boil milk with sugar",
      "Mix coffee decoction with hot milk",
      "Pour from height to create froth",
      "Serve in traditional tumbler and davara",
    ],
    tips: [
      "Use coffee with 20% chicory for authentic taste",
      "Water should be just off the boil",
      "Pour from height for traditional froth",
    ],
    nutritionalInfo: {
      protein: 4,
      carbs: 8,
      fat: 2,
      fiber: 0,
    },
  },
  {
    id: "si8",
    name: "Payasam",
    category: "Dessert",
    region: "South Indian",
    cookTime: 45,
    servings: 6,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 280,
    rating: 4.6,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Payasam")}`,
    description: "Sweet rice pudding cooked in milk with cardamom and nuts.",
    ingredients: [
      "1/2 cup basmati rice",
      "1 liter full-fat milk",
      "1/2 cup jaggery or sugar",
      "1/4 cup cashews",
      "1/4 cup raisins",
      "1/2 tsp cardamom powder",
      "2 tbsp ghee",
      "Pinch of saffron",
    ],
    instructions: [
      "Wash and soak rice for 30 minutes",
      "Boil milk in heavy-bottomed pan",
      "Add rice and cook until soft",
      "Add jaggery and cardamom powder",
      "Cook until thick consistency",
      "Heat ghee, fry cashews and raisins",
      "Add to payasam along with saffron",
      "Serve warm or chilled",
    ],
    tips: [
      "Stir frequently to prevent sticking",
      "Adjust sweetness according to taste",
      "Garnish with silver leaf for special occasions",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 45,
      fat: 10,
      fiber: 1,
    },
  },
  {
    id: "si9",
    name: "Uttapam",
    category: "Main Course",
    region: "South Indian",
    cookTime: 25,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 200,
    rating: 4.5,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Uttapam")}`,
    description: "Thick pancake made from dosa batter topped with vegetables.",
    ingredients: [
      "2 cups dosa batter",
      "1 onion, finely chopped",
      "1 tomato, finely chopped",
      "1 carrot, finely chopped",
      "2 green chilies, chopped",
      "1/4 cup coriander, chopped",
      "Oil for cooking",
      "Salt to taste",
    ],
    instructions: [
      "Heat non-stick pan or tawa",
      "Pour thick layer of batter",
      "Sprinkle chopped vegetables on top",
      "Drizzle oil around edges",
      "Cook until bottom is golden",
      "Flip carefully and cook other side",
      "Serve hot with chutney and sambar",
    ],
    tips: ["Batter should be slightly thick", "Don't flip too early", "Use fresh vegetables for best taste"],
    nutritionalInfo: {
      protein: 6,
      carbs: 32,
      fat: 6,
      fiber: 3,
    },
  },
  {
    id: "si10",
    name: "Lemon Rice",
    category: "Main Course",
    region: "South Indian",
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 250,
    rating: 4.4,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Lemon Rice")}`,
    description: "Tangy rice dish flavored with lemon juice and South Indian spices.",
    ingredients: [
      "2 cups cooked rice",
      "3 tbsp lemon juice",
      "2 tsp mustard seeds",
      "1 tsp cumin seeds",
      "2 dry red chilies",
      "10 curry leaves",
      "1/4 cup peanuts",
      "1/2 tsp turmeric",
      "3 tbsp oil",
      "Salt to taste",
      "Coriander for garnish",
    ],
    instructions: [
      "Heat oil in pan",
      "Add mustard seeds and cumin seeds",
      "Add red chilies and curry leaves",
      "Add peanuts and fry until golden",
      "Add turmeric powder",
      "Add cooked rice and salt",
      "Mix gently without breaking rice",
      "Add lemon juice and mix",
      "Garnish with coriander",
    ],
    tips: ["Use day-old rice for better texture", "Add lemon juice at the end", "Adjust salt and lemon as per taste"],
    nutritionalInfo: {
      protein: 6,
      carbs: 42,
      fat: 8,
      fiber: 2,
    },
  },

  // West Indian Recipes
  {
    id: "wi1",
    name: "Dhokla",
    category: "Snack",
    region: "West Indian",
    cookTime: 35,
    servings: 6,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 180,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Dhokla")}`,
    description: "Steamed savory cake made from gram flour, light and spongy.",
    ingredients: [
      "2 cups gram flour (besan)",
      "1 cup water",
      "1 tbsp ginger-green chili paste",
      "1 tsp turmeric",
      "1 tsp sugar",
      "2 tsp lemon juice",
      "1 tsp eno fruit salt",
      "2 tbsp oil",
      "Salt to taste",
      "For tempering: mustard seeds, curry leaves, green chilies",
    ],
    instructions: [
      "Mix gram flour with water to make smooth batter",
      "Add ginger-chili paste, turmeric, sugar, and salt",
      "Add lemon juice and oil, mix well",
      "Add eno and mix quickly",
      "Pour into greased steamer plate",
      "Steam for 15-20 minutes",
      "Cool and cut into pieces",
      "Prepare tempering and pour over dhokla",
      "Garnish with coriander and coconut",
    ],
    tips: [
      "Batter should be of pouring consistency",
      "Add eno just before steaming",
      "Don't open steamer during cooking",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 28,
      fat: 6,
      fiber: 4,
    },
  },
  {
    id: "wi2",
    name: "Pav Bhaji",
    category: "Main Course",
    region: "West Indian",
    cookTime: 45,
    servings: 4,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 380,
    rating: 4.9,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Pav Bhaji")}`,
    description: "Spicy mixed vegetable curry served with buttered bread rolls.",
    ingredients: [
      "8 pav (bread rolls)",
      "3 potatoes, boiled and mashed",
      "1 cup mixed vegetables (cauliflower, peas, carrots)",
      "2 onions, chopped",
      "3 tomatoes, chopped",
      "1 capsicum, chopped",
      "3 tbsp pav bhaji masala",
      "4 tbsp butter",
      "1 tbsp ginger-garlic paste",
      "Salt to taste",
      "Coriander and onions for garnish",
    ],
    instructions: [
      "Heat butter in pan, add onions",
      "Cook until golden brown",
      "Add ginger-garlic paste and tomatoes",
      "Cook until tomatoes are soft",
      "Add mixed vegetables and capsicum",
      "Add mashed potatoes and pav bhaji masala",
      "Add water and simmer for 15 minutes",
      "Mash vegetables while cooking",
      "Slit and butter pav, toast on tawa",
      "Serve hot bhaji with pav",
    ],
    tips: [
      "Mash vegetables well for smooth texture",
      "Use generous amount of butter",
      "Serve with chopped onions and lemon",
    ],
    nutritionalInfo: {
      protein: 12,
      carbs: 58,
      fat: 16,
      fiber: 8,
    },
  },
  {
    id: "wi3",
    name: "Gujarati Thali",
    category: "Main Course",
    region: "West Indian",
    cookTime: 120,
    servings: 4,
    difficulty: "Hard",
    isVegetarian: true,
    calories: 650,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Gujarati Thali")}`,
    description: "Complete meal with variety of Gujarati dishes including dal, vegetables, and sweets.",
    ingredients: [
      "For Dal: 1 cup toor dal, jaggery, tamarind",
      "For Sabzi: seasonal vegetables, spices",
      "For Roti: wheat flour, oil",
      "For Rice: basmati rice",
      "For Kadhi: gram flour, yogurt, ginger",
      "For Pickle: mango, spices",
      "For Sweet: jaggery, ghee, flour",
    ],
    instructions: [
      "Prepare dal with jaggery and tamarind",
      "Make 2-3 vegetable dishes",
      "Prepare fresh rotis",
      "Cook plain rice",
      "Make gujarati kadhi",
      "Arrange all items on thali",
      "Serve with pickle and papad",
      "End meal with sweet dish",
    ],
    tips: ["Balance sweet, salty, and spicy flavors", "Serve everything fresh and hot", "Include variety of textures"],
    nutritionalInfo: {
      protein: 20,
      carbs: 95,
      fat: 22,
      fiber: 12,
    },
  },
  {
    id: "wi4",
    name: "Vada Pav",
    category: "Snack",
    region: "West Indian",
    cookTime: 40,
    servings: 6,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 320,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Vada Pav")}`,
    description: "Mumbai's famous street food - spiced potato fritter in bread bun.",
    ingredients: [
      "6 pav (bread buns)",
      "4 large potatoes, boiled",
      "1 cup gram flour",
      "1 tsp mustard seeds",
      "10 curry leaves",
      "2 green chilies, chopped",
      "1 tsp ginger paste",
      "1/2 tsp turmeric",
      "Oil for deep frying",
      "Green chutney",
      "Tamarind chutney",
      "Salt to taste",
    ],
    instructions: [
      "Mash boiled potatoes with salt and turmeric",
      "Heat oil, add mustard seeds and curry leaves",
      "Add green chilies and ginger paste",
      "Add mashed potatoes and mix well",
      "Cool the mixture and make small balls",
      "Make batter with gram flour and water",
      "Dip potato balls in batter and deep fry",
      "Slit pav and apply chutneys",
      "Place vada inside and serve hot",
    ],
    tips: [
      "Potato mixture should be well spiced",
      "Batter should coat vada properly",
      "Serve immediately for best taste",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 48,
      fat: 14,
      fiber: 4,
    },
  },
  {
    id: "wi5",
    name: "Khandvi",
    category: "Snack",
    region: "West Indian",
    cookTime: 30,
    servings: 4,
    difficulty: "Hard",
    isVegetarian: true,
    calories: 150,
    rating: 4.6,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Khandvi")}`,
    description: "Delicate rolls made from gram flour and yogurt, seasoned with mustard seeds.",
    ingredients: [
      "1 cup gram flour",
      "1 cup yogurt",
      "2 cups water",
      "1 tsp ginger-green chili paste",
      "1/2 tsp turmeric",
      "1 tsp mustard seeds",
      "10 curry leaves",
      "2 tbsp oil",
      "1 tbsp sesame seeds",
      "Salt to taste",
      "Coriander and coconut for garnish",
    ],
    instructions: [
      "Mix gram flour, yogurt, and water smoothly",
      "Add ginger-chili paste, turmeric, and salt",
      "Cook on medium heat, stirring continuously",
      "Cook until thick and smooth",
      "Spread thinly on greased plates",
      "Cool completely and cut into strips",
      "Roll each strip carefully",
      "Prepare tempering with mustard seeds",
      "Pour over khandvi and garnish",
    ],
    tips: ["Stir continuously to avoid lumps", "Spread while mixture is warm", "Roll gently to avoid breaking"],
    nutritionalInfo: {
      protein: 6,
      carbs: 20,
      fat: 6,
      fiber: 3,
    },
  },
  {
    id: "wi6",
    name: "Undhiyu",
    category: "Main Course",
    region: "West Indian",
    cookTime: 60,
    servings: 6,
    difficulty: "Hard",
    isVegetarian: true,
    calories: 280,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Undhiyu")}`,
    description: "Mixed vegetable curry with stuffed baby eggplants and spices.",
    ingredients: [
      "250g baby eggplants",
      "250g baby potatoes",
      "200g sweet potatoes",
      "100g green beans",
      "100g cluster beans",
      "2 tbsp coconut, grated",
      "2 tbsp peanuts, crushed",
      "2 tsp coriander seeds",
      "1 tsp cumin seeds",
      "4 tbsp oil",
      "Salt and spices to taste",
    ],
    instructions: [
      "Make stuffing with coconut, peanuts, and spices",
      "Stuff baby eggplants with this mixture",
      "Heat oil in heavy-bottomed pot",
      "Add stuffed eggplants and potatoes",
      "Add other vegetables layer by layer",
      "Cover and cook on low heat for 45 minutes",
      "Stir occasionally without breaking vegetables",
      "Serve hot with puris",
    ],
    tips: [
      "Use earthen pot for authentic taste",
      "Don't add water, vegetables cook in own moisture",
      "Layer vegetables according to cooking time",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 38,
      fat: 12,
      fiber: 8,
    },
  },
  {
    id: "wi7",
    name: "Fafda Jalebi",
    category: "Snack",
    region: "West Indian",
    cookTime: 50,
    servings: 6,
    difficulty: "Hard",
    isVegetarian: true,
    calories: 420,
    rating: 4.5,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Fafda Jalebi")}`,
    description: "Crispy gram flour strips served with sweet spiral-shaped jalebi.",
    ingredients: [
      "For Fafda: 2 cups gram flour, carom seeds, oil",
      "For Jalebi: 1 cup all-purpose flour, yogurt, saffron",
      "Sugar syrup: 2 cups sugar, 1 cup water",
      "Oil for deep frying",
      "Food color (optional)",
    ],
    instructions: [
      "Make stiff dough for fafda with gram flour",
      "Roll into thin strips and deep fry",
      "For jalebi, make fermented batter",
      "Prepare sugar syrup with saffron",
      "Make spiral shapes in hot oil",
      "Fry until golden and crispy",
      "Dip in sugar syrup immediately",
      "Serve fafda with hot jalebi",
    ],
    tips: [
      "Fafda dough should be stiff",
      "Jalebi batter needs fermentation",
      "Sugar syrup should be of right consistency",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 65,
      fat: 18,
      fiber: 4,
    },
  },
  {
    id: "wi8",
    name: "Gujarati Kadhi",
    category: "Main Course",
    region: "West Indian",
    cookTime: 30,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 180,
    rating: 4.4,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Gujarati Kadhi")}`,
    description: "Sweet and tangy yogurt curry with gram flour dumplings.",
    ingredients: [
      "1 cup yogurt",
      "2 tbsp gram flour",
      "1 inch ginger, grated",
      "2 green chilies, slit",
      "1 tsp mustard seeds",
      "10 curry leaves",
      "1/2 tsp turmeric",
      "1 tbsp jaggery",
      "2 tbsp oil",
      "Salt to taste",
      "Coriander for garnish",
    ],
    instructions: [
      "Whisk yogurt with gram flour smoothly",
      "Add ginger, green chilies, and turmeric",
      "Heat oil, add mustard seeds and curry leaves",
      "Add yogurt mixture and bring to boil",
      "Add jaggery and salt",
      "Simmer for 15 minutes",
      "Garnish with coriander",
      "Serve with rice or khichdi",
    ],
    tips: [
      "Whisk yogurt well to avoid curdling",
      "Add jaggery for authentic sweet taste",
      "Don't boil vigorously after adding yogurt",
    ],
    nutritionalInfo: {
      protein: 6,
      carbs: 18,
      fat: 8,
      fiber: 2,
    },
  },
  {
    id: "wi9",
    name: "Handvo",
    category: "Main Course",
    region: "West Indian",
    cookTime: 60,
    servings: 8,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 250,
    rating: 4.6,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Handvo")}`,
    description: "Savory cake made from mixed lentils and rice with vegetables.",
    ingredients: [
      "1 cup mixed dal and rice (soaked)",
      "1/2 cup bottle gourd, grated",
      "1/4 cup yogurt",
      "1 tsp ginger-green chili paste",
      "1 tsp mustard seeds",
      "1 tsp sesame seeds",
      "10 curry leaves",
      "1/2 tsp turmeric",
      "4 tbsp oil",
      "Salt to taste",
    ],
    instructions: [
      "Grind soaked dal-rice to coarse paste",
      "Add grated bottle gourd and yogurt",
      "Add ginger-chili paste, turmeric, and salt",
      "Heat oil, add mustard seeds and curry leaves",
      "Add half tempering to batter",
      "Pour in greased pan, top with remaining tempering",
      "Bake at 180°C for 45 minutes",
      "Cool and cut into pieces",
    ],
    tips: ["Batter should be thick but pourable", "Grate vegetables finely", "Check doneness with toothpick"],
    nutritionalInfo: {
      protein: 10,
      carbs: 32,
      fat: 10,
      fiber: 6,
    },
  },
  {
    id: "wi10",
    name: "Mohanthal",
    category: "Dessert",
    region: "West Indian",
    cookTime: 45,
    servings: 12,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 320,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Mohanthal")}`,
    description: "Rich gram flour fudge with ghee, milk, and nuts.",
    ingredients: [
      "2 cups gram flour",
      "1 cup ghee",
      "1 cup milk",
      "1.5 cups sugar",
      "1/4 cup almonds, chopped",
      "1/4 cup pistachios, chopped",
      "1/2 tsp cardamom powder",
      "Silver leaf for garnish",
    ],
    instructions: [
      "Roast gram flour in ghee until aromatic",
      "Add warm milk gradually, stirring continuously",
      "Cook until mixture thickens",
      "Add sugar and cook until it leaves sides",
      "Add cardamom powder and half the nuts",
      "Pour into greased tray",
      "Garnish with remaining nuts and silver leaf",
      "Cool completely and cut into squares",
    ],
    tips: ["Roast gram flour on low heat", "Add milk slowly to avoid lumps", "Cook until mixture becomes glossy"],
    nutritionalInfo: {
      protein: 8,
      carbs: 42,
      fat: 16,
      fiber: 3,
    },
  },

  // East Indian Recipes
  {
    id: "ei1",
    name: "Fish Curry (Bengali)",
    category: "Main Course",
    region: "East Indian",
    cookTime: 35,
    servings: 4,
    difficulty: "Medium",
    isVegetarian: false,
    calories: 320,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Fish Curry (Bengali)")}`,
    description: "Traditional Bengali fish curry with mustard oil and spices.",
    ingredients: [
      "500g fish (rohu or katla), cut in pieces",
      "2 potatoes, quartered",
      "1 tbsp mustard oil",
      "1 tsp mustard seeds",
      "1 tsp cumin seeds",
      "2 bay leaves",
      "1 tsp turmeric",
      "1 tsp red chili powder",
      "1 tsp coriander powder",
      "2 tomatoes, chopped",
      "1 tsp ginger paste",
      "Salt to taste",
    ],
    instructions: [
      "Marinate fish with turmeric and salt",
      "Heat mustard oil until smoking, then cool slightly",
      "Fry fish pieces until golden, set aside",
      "Fry potatoes until golden",
      "Add mustard seeds, cumin seeds, and bay leaves",
      "Add ginger paste and tomatoes",
      "Add all spices and cook for 2 minutes",
      "Add water and bring to boil",
      "Add fish and potatoes, simmer for 10 minutes",
    ],
    tips: ["Use mustard oil for authentic flavor", "Don't overcook fish", "Serve with steamed rice"],
    nutritionalInfo: {
      protein: 28,
      carbs: 18,
      fat: 14,
      fiber: 3,
    },
  },
  {
    id: "ei2",
    name: "Luchi Alur Dom",
    category: "Main Course",
    region: "East Indian",
    cookTime: 50,
    servings: 4,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 380,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Luchi Alur Dom")}`,
    description: "Deep-fried bread served with spicy potato curry.",
    ingredients: [
      "For Luchi: 2 cups all-purpose flour, oil, salt",
      "For Alur Dom: 6 potatoes, 2 bay leaves",
      "1 tsp cumin seeds",
      "1 tsp garam masala",
      "1 tsp red chili powder",
      "1/2 tsp turmeric",
      "2 tomatoes, chopped",
      "1 tbsp ginger paste",
      "Oil for frying",
    ],
    instructions: [
      "Make soft dough for luchi with flour and oil",
      "Rest for 30 minutes",
      "Boil potatoes, peel and cut into pieces",
      "Heat oil, add bay leaves and cumin seeds",
      "Add potatoes and fry until golden",
      "Add ginger paste and tomatoes",
      "Add all spices and cook until oil separates",
      "Roll luchi thin and deep fry until puffed",
      "Serve hot luchi with alur dom",
    ],
    tips: [
      "Luchi dough should be soft",
      "Fry luchi on high heat",
      "Potatoes should be well-fried before adding spices",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 58,
      fat: 16,
      fiber: 4,
    },
  },
  {
    id: "ei3",
    name: "Kosha Mangsho",
    category: "Main Course",
    region: "East Indian",
    cookTime: 90,
    servings: 4,
    difficulty: "Hard",
    isVegetarian: false,
    calories: 450,
    rating: 4.9,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Kosha Mangsho")}`,
    description: "Slow-cooked Bengali mutton curry with rich, thick gravy.",
    ingredients: [
      "1 kg mutton, cut in pieces",
      "2 large onions, sliced",
      "1 tbsp ginger-garlic paste",
      "2 bay leaves",
      "4-5 green cardamom",
      "1 inch cinnamon",
      "1 tsp cumin powder",
      "1 tsp coriander powder",
      "1 tsp red chili powder",
      "1/2 tsp turmeric",
      "1 tsp garam masala",
      "4 tbsp mustard oil",
      "Salt to taste",
    ],
    instructions: [
      "Marinate mutton with turmeric, salt, and ginger-garlic paste",
      "Heat mustard oil, fry onions until deep brown",
      "Remove onions and fry mutton until browned",
      "Add whole spices and fried onions back",
      "Add all powdered spices and cook for 5 minutes",
      "Add hot water and pressure cook for 30 minutes",
      "Cook uncovered until gravy thickens",
      "Add garam masala and serve hot",
    ],
    tips: [
      "Brown onions well for rich color",
      "Cook on high heat initially, then slow cook",
      "Gravy should be thick and coat the meat",
    ],
    nutritionalInfo: {
      protein: 38,
      carbs: 8,
      fat: 28,
      fiber: 2,
    },
  },
  {
    id: "ei4",
    name: "Chingri Malai Curry",
    category: "Main Course",
    region: "East Indian",
    cookTime: 25,
    servings: 4,
    difficulty: "Medium",
    isVegetarian: false,
    calories: 280,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Chingri Malai Curry")}`,
    description: "Prawns cooked in coconut milk with Bengali spices.",
    ingredients: [
      "500g large prawns, cleaned",
      "1 cup coconut milk",
      "2 onions, sliced",
      "1 tbsp ginger paste",
      "1 tsp turmeric",
      "1 tsp red chili powder",
      "1 tsp cumin powder",
      "2 green chilies, slit",
      "1 tbsp mustard oil",
      "1 tsp sugar",
      "Salt to taste",
    ],
    instructions: [
      "Marinate prawns with turmeric and salt",
      "Heat mustard oil, fry prawns lightly",
      "Remove prawns and fry onions until golden",
      "Add ginger paste and green chilies",
      "Add all spices and cook for 2 minutes",
      "Add coconut milk and bring to boil",
      "Add prawns and sugar",
      "Simmer for 5-7 minutes until prawns are cooked",
      "Serve hot with rice",
    ],
    tips: ["Don't overcook prawns", "Use thick coconut milk for rich curry", "Add sugar to balance flavors"],
    nutritionalInfo: {
      protein: 24,
      carbs: 8,
      fat: 16,
      fiber: 2,
    },
  },
  {
    id: "ei5",
    name: "Aloo Posto",
    category: "Main Course",
    region: "East Indian",
    cookTime: 25,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 220,
    rating: 4.5,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Aloo Posto")}`,
    description: "Bengali potato curry cooked with poppy seed paste.",
    ingredients: [
      "4 large potatoes, cubed",
      "3 tbsp poppy seeds, soaked",
      "2 green chilies",
      "1 tsp mustard seeds",
      "1/2 tsp turmeric",
      "1 tsp sugar",
      "3 tbsp mustard oil",
      "Salt to taste",
    ],
    instructions: [
      "Grind soaked poppy seeds with green chilies to paste",
      "Heat mustard oil, add mustard seeds",
      "Add potatoes and fry until golden",
      "Add turmeric and salt",
      "Add poppy seed paste and mix well",
      "Add little water and cook covered",
      "Cook until potatoes are tender",
      "Add sugar and serve hot",
    ],
    tips: [
      "Soak poppy seeds for easier grinding",
      "Don't add too much water",
      "Sugar balances the bitterness of poppy seeds",
    ],
    nutritionalInfo: {
      protein: 6,
      carbs: 32,
      fat: 10,
      fiber: 4,
    },
  },
  {
    id: "ei6",
    name: "Mishti Doi",
    category: "Dessert",
    region: "East Indian",
    cookTime: 240,
    servings: 6,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 180,
    rating: 4.7,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Mishti Doi")}`,
    description: "Sweet yogurt dessert, a Bengali specialty.",
    ingredients: [
      "1 liter full-fat milk",
      "1/2 cup sugar",
      "2 tbsp yogurt (starter)",
      "1/4 cup condensed milk",
      "Pinch of cardamom powder",
    ],
    instructions: [
      "Boil milk and reduce to 3/4 quantity",
      "Add sugar and condensed milk",
      "Cool to lukewarm temperature",
      "Add yogurt starter and cardamom",
      "Mix well and pour into earthen pots",
      "Keep in warm place for 4-6 hours",
      "Refrigerate once set",
      "Serve chilled",
    ],
    tips: [
      "Use earthen pots for authentic taste",
      "Don't disturb while setting",
      "Milk should be lukewarm when adding starter",
    ],
    nutritionalInfo: {
      protein: 8,
      carbs: 24,
      fat: 6,
      fiber: 0,
    },
  },
  {
    id: "ei7",
    name: "Sandesh",
    category: "Dessert",
    region: "East Indian",
    cookTime: 30,
    servings: 8,
    difficulty: "Medium",
    isVegetarian: true,
    calories: 150,
    rating: 4.6,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Sandesh")}`,
    description: "Delicate Bengali sweet made from fresh cottage cheese.",
    ingredients: [
      "1 liter full-fat milk",
      "2 tbsp lemon juice",
      "1/2 cup powdered sugar",
      "1/4 tsp cardamom powder",
      "Pistachios for garnish",
    ],
    instructions: [
      "Boil milk and add lemon juice to curdle",
      "Strain through muslin cloth",
      "Wash chenna under cold water",
      "Squeeze out excess water",
      "Knead chenna until smooth",
      "Add powdered sugar and cardamom",
      "Cook on low heat for 5-7 minutes",
      "Shape into desired forms and garnish",
    ],
    tips: ["Don't over-knead the chenna", "Cook on very low heat", "Shape while mixture is warm"],
    nutritionalInfo: {
      protein: 8,
      carbs: 18,
      fat: 6,
      fiber: 0,
    },
  },
  {
    id: "ei8",
    name: "Panta Bhat",
    category: "Main Course",
    region: "East Indian",
    cookTime: 480,
    servings: 2,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 200,
    rating: 4.3,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Panta Bhat")}`,
    description: "Fermented rice dish, traditionally eaten for breakfast.",
    ingredients: [
      "2 cups cooked rice",
      "Water to cover rice",
      "Salt to taste",
      "Green chilies, chopped",
      "Onions, chopped",
      "Mustard oil",
      "Fried fish (optional)",
    ],
    instructions: [
      "Soak cooked rice in water overnight",
      "Add salt and mix gently",
      "Serve with chopped onions and green chilies",
      "Drizzle mustard oil on top",
      "Can be served with fried fish or pickles",
    ],
    tips: [
      "Use day-old rice for better fermentation",
      "Change water if it smells too sour",
      "Traditionally eaten in summer for cooling effect",
    ],
    nutritionalInfo: {
      protein: 4,
      carbs: 42,
      fat: 2,
      fiber: 1,
    },
  },
  {
    id: "ei9",
    name: "Begun Bhaja",
    category: "Side Dish",
    region: "East Indian",
    cookTime: 20,
    servings: 4,
    difficulty: "Easy",
    isVegetarian: true,
    calories: 120,
    rating: 4.4,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Begun Bhaja")}`,
    description: "Simple fried eggplant slices, a Bengali comfort food.",
    ingredients: [
      "2 large eggplants, sliced",
      "1 tsp turmeric",
      "1 tsp red chili powder",
      "Salt to taste",
      "Mustard oil for frying",
    ],
    instructions: [
      "Slice eggplants into rounds",
      "Sprinkle salt and let sit for 15 minutes",
      "Pat dry and apply turmeric and chili powder",
      "Heat mustard oil in pan",
      "Fry eggplant slices until golden on both sides",
      "Serve hot with rice and dal",
    ],
    tips: ["Salt helps remove bitterness", "Don't overcrowd the pan", "Serve immediately for best taste"],
    nutritionalInfo: {
      protein: 2,
      carbs: 12,
      fat: 8,
      fiber: 6,
    },
  },
  {
    id: "ei10",
    name: "Rasgulla",
    category: "Dessert",
    region: "East Indian",
    cookTime: 45,
    servings: 12,
    difficulty: "Hard",
    isVegetarian: true,
    calories: 120,
    rating: 4.8,
    image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent("Rasgulla")}`,
    description: "Spongy cottage cheese balls in sugar syrup.",
    ingredients: [
      "1 liter full-fat milk",
      "2 tbsp lemon juice",
      "2 cups sugar",
      "4 cups water",
      "1/4 tsp cardamom powder",
    ],
    instructions: [
      "Curdle milk with lemon juice",
      "Strain and wash chenna thoroughly",
      "Knead chenna until smooth and soft",
      "Make small balls from chenna",
      "Boil sugar and water to make syrup",
      "Add chenna balls to boiling syrup",
      "Cover and cook for 15 minutes",
      "Add cardamom powder and cool",
      "Serve chilled",
    ],
    tips: ["Knead chenna until it becomes smooth", "Don't open lid while cooking", "Syrup should be thin, not thick"],
    nutritionalInfo: {
      protein: 4,
      carbs: 24,
      fat: 2,
      fiber: 0,
    },
  },
]

const regions = ["All", "North Indian", "South Indian", "West Indian", "East Indian"]
const categories = ["All", "Main Course", "Appetizer", "Snack", "Dessert", "Beverage", "Bread", "Side Dish", "Soup"]
const difficulties = ["All", "Easy", "Medium", "Hard"]

export function RecipeBook() {
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [showVegOnly, setShowVegOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesRegion = selectedRegion === "All" || recipe.region === selectedRegion
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || recipe.difficulty === selectedDifficulty
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVeg = !showVegOnly || recipe.isVegetarian

    return matchesRegion && matchesCategory && matchesDifficulty && matchesSearch && matchesVeg
  })

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => (prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]))
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Indian Recipe Collection
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover authentic recipes from across India with detailed cooking instructions and nutritional information
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Recipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label>Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="vegOnly"
              checked={showVegOnly}
              onChange={(e) => setShowVegOnly(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="vegOnly" className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              Vegetarian Only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="relative">
              <img
                src={recipe.image || "/placeholder.svg"}
                alt={recipe.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge
                  variant={
                    recipe.difficulty === "Easy"
                      ? "default"
                      : recipe.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {recipe.difficulty}
                </Badge>
                {recipe.isVegetarian && (
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    <Leaf className="w-3 h-3 mr-1" />
                    Veg
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 left-2 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(recipe.id)
                }}
              >
                <Heart
                  className={`w-4 h-4 ${favorites.includes(recipe.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                />
              </Button>
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">{recipe.name}</CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{recipe.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {recipe.region}
                </div>
                <Badge variant="outline">{recipe.category}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{recipe.description}</p>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{recipe.cookTime}m</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>{recipe.calories} cal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No recipes found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <DialogTitle className="text-2xl font-bold mb-2">{selectedRecipe.name}</DialogTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedRecipe.region}
                      </div>
                      <Badge variant="outline">{selectedRecipe.category}</Badge>
                      <Badge
                        variant={
                          selectedRecipe.difficulty === "Easy"
                            ? "default"
                            : selectedRecipe.difficulty === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {selectedRecipe.difficulty}
                      </Badge>
                      {selectedRecipe.isVegetarian && (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          <Leaf className="w-3 h-3 mr-1" />
                          Vegetarian
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{selectedRecipe.rating}</span>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedRecipe.image || "/placeholder.svg"}
                    alt={selectedRecipe.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <Clock className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                      <div className="font-semibold">{selectedRecipe.cookTime} min</div>
                      <div className="text-sm text-gray-600">Cook Time</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <div className="font-semibold">{selectedRecipe.servings}</div>
                      <div className="text-sm text-gray-600">Servings</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <Flame className="w-6 h-6 text-red-500 mx-auto mb-1" />
                      <div className="font-semibold">{selectedRecipe.calories}</div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <ChefHat className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <div className="font-semibold">{selectedRecipe.difficulty}</div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Nutritional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-pink-50 dark:bg-pink-900/20 rounded">
                          <div className="font-bold text-pink-600">{selectedRecipe.nutritionalInfo.protein}g</div>
                          <div className="text-sm text-gray-500">Protein</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <div className="font-bold text-blue-600">{selectedRecipe.nutritionalInfo.carbs}g</div>
                          <div className="text-sm text-gray-500">Carbs</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                          <div className="font-bold text-orange-600">{selectedRecipe.nutritionalInfo.fat}g</div>
                          <div className="text-sm text-gray-500">Fat</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                          <div className="font-bold text-green-600">{selectedRecipe.nutritionalInfo.fiber}g</div>
                          <div className="text-sm text-gray-500">Fiber</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Description</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedRecipe.description}</p>
                  </div>

                  <Tabs defaultValue="ingredients" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                      <TabsTrigger value="instructions">Instructions</TabsTrigger>
                      <TabsTrigger value="tips">Tips</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ingredients" className="space-y-3">
                      <h4 className="font-semibold">Ingredients:</h4>
                      <ul className="space-y-2">
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-sm">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="instructions" className="space-y-3">
                      <h4 className="font-semibold">Cooking Instructions:</h4>
                      <ol className="space-y-3">
                        {selectedRecipe.instructions.map((instruction, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm">{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </TabsContent>

                    <TabsContent value="tips" className="space-y-3">
                      <h4 className="font-semibold">Cooking Tips:</h4>
                      <ul className="space-y-2">
                        {selectedRecipe.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite(selectedRecipe.id)}
                  className="flex items-center gap-2"
                >
                  <Heart
                    className={`w-4 h-4 ${favorites.includes(selectedRecipe.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                  {favorites.includes(selectedRecipe.id) ? "Remove from Favorites" : "Add to Favorites"}
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Save Recipe
                  </Button>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Start Cooking
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
