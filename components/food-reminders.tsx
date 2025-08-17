"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Bell, Plus, Edit, Trash2, Clock, Volume2, VolumeX } from "lucide-react"

interface FoodReminder {
  id: string
  title: string
  message: string
  time: string
  frequency: "daily" | "weekly" | "weekdays" | "weekends"
  isActive: boolean
  soundEnabled: boolean
  createdAt: Date
  lastTriggered?: Date
}

export function FoodReminders() {
  const [reminders, setReminders] = useState<FoodReminder[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingReminder, setEditingReminder] = useState<FoodReminder | null>(null)
  const [newReminder, setNewReminder] = useState({
    title: "",
    message: "",
    time: "",
    frequency: "daily" as const,
    soundEnabled: true,
  })

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem("foodReminders")
    if (savedReminders) {
      try {
        const parsed = JSON.parse(savedReminders)
        setReminders(
          parsed.map((r: any) => ({
            ...r,
            createdAt: new Date(r.createdAt),
            lastTriggered: r.lastTriggered ? new Date(r.lastTriggered) : undefined,
          })),
        )
      } catch (error) {
        console.error("Error loading reminders:", error)
      }
    }
  }, [])

  // Save reminders to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem("foodReminders", JSON.stringify(reminders))
  }, [reminders])

  // Request notification permission on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Check for due reminders every 30 seconds
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
      const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.

      console.log("Checking reminders at:", currentTime, "Day:", currentDay)

      reminders.forEach((reminder) => {
        if (!reminder.isActive) {
          return
        }

        if (reminder.time !== currentTime) {
          return
        }

        const shouldTrigger = (() => {
          switch (reminder.frequency) {
            case "daily":
              return true
            case "weekdays":
              return currentDay >= 1 && currentDay <= 5 // Monday to Friday
            case "weekends":
              return currentDay === 0 || currentDay === 6 // Saturday and Sunday
            case "weekly":
              // Trigger once per week (on the same day it was created)
              const createdDay = reminder.createdAt.getDay()
              return currentDay === createdDay
            default:
              return false
          }
        })()

        if (shouldTrigger) {
          // Check if already triggered in the last minute to avoid spam
          const lastTriggered = reminder.lastTriggered
          const oneMinuteAgo = new Date(now.getTime() - 60000)

          if (!lastTriggered || lastTriggered < oneMinuteAgo) {
            console.log(`Triggering reminder: ${reminder.title}`)
            triggerReminder(reminder)
          }
        }
      })
    }

    // Check immediately and then every 30 seconds
    checkReminders()
    const interval = setInterval(checkReminders, 30000)
    return () => clearInterval(interval)
  }, [reminders])

  const triggerReminder = (reminder: FoodReminder) => {
    console.log("Triggering reminder:", reminder.title)

    // Update last triggered time
    setReminders((prev) => prev.map((r) => (r.id === reminder.id ? { ...r, lastTriggered: new Date() } : r)))

    // Play alarm sound if enabled
    if (reminder.soundEnabled) {
      console.log("Playing alarm sound")
      playAlarmSound()
    }

    // Show browser notification if permission granted
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      console.log("Showing browser notification")
      new Notification(reminder.title, {
        body: reminder.message,
        icon: "/favicon.ico",
        tag: reminder.id,
      })
    }

    // Show in-app alert notification
    setTimeout(() => {
      alert(`🔔 ${reminder.title}\n\n${reminder.message}`)
    }, 100)
  }

  // Function to play alarm sound
  const playAlarmSound = () => {
    try {
      console.log("Creating alarm sound...")

      // Create audio context for generating alarm sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create a 5-second alarm sound
      const duration = 5 // 5 seconds
      const sampleRate = audioContext.sampleRate
      const numSamples = duration * sampleRate
      const buffer = audioContext.createBuffer(1, numSamples, sampleRate)
      const channelData = buffer.getChannelData(0)

      // Generate alarm sound pattern (beep-beep-pause)
      for (let i = 0; i < numSamples; i++) {
        const time = i / sampleRate
        const beepCycle = time % 1.5 // 1.5 second cycle (beep-beep-pause)

        if (beepCycle < 0.3 || (beepCycle >= 0.5 && beepCycle < 0.8)) {
          // Generate beep sound (sine wave at 800Hz)
          channelData[i] = Math.sin(2 * Math.PI * 800 * time) * 0.3
        } else {
          // Silence between beeps
          channelData[i] = 0
        }
      }

      // Play the generated sound
      const source = audioContext.createBufferSource()
      source.buffer = buffer
      source.connect(audioContext.destination)
      source.start()

      console.log("Alarm sound started")

      // Clean up after duration
      setTimeout(() => {
        try {
          source.stop()
          audioContext.close()
          console.log("Alarm sound stopped")
        } catch (error) {
          console.log("Audio cleanup completed")
        }
      }, duration * 1000)
    } catch (error) {
      console.error("Error playing alarm sound:", error)
    }
  }

  const addReminder = () => {
    if (!newReminder.title || !newReminder.time) return

    const reminder: FoodReminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      message: newReminder.message,
      time: newReminder.time,
      frequency: newReminder.frequency,
      isActive: true,
      soundEnabled: newReminder.soundEnabled,
      createdAt: new Date(),
    }

    setReminders((prev) => [...prev, reminder])
    setNewReminder({
      title: "",
      message: "",
      time: "",
      frequency: "daily",
      soundEnabled: true,
    })
    setShowAddModal(false)
  }

  const updateReminder = () => {
    if (!editingReminder || !newReminder.title || !newReminder.time) return

    setReminders((prev) =>
      prev.map((r) =>
        r.id === editingReminder.id
          ? {
              ...r,
              title: newReminder.title,
              message: newReminder.message,
              time: newReminder.time,
              frequency: newReminder.frequency,
              soundEnabled: newReminder.soundEnabled,
            }
          : r,
      ),
    )
    setEditingReminder(null)
    setNewReminder({
      title: "",
      message: "",
      time: "",
      frequency: "daily",
      soundEnabled: true,
    })
  }

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  const toggleReminder = (id: string) => {
    setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)))
  }

  const startEdit = (reminder: FoodReminder) => {
    setEditingReminder(reminder)
    setNewReminder({
      title: reminder.title,
      message: reminder.message,
      time: reminder.time,
      frequency: reminder.frequency,
      soundEnabled: reminder.soundEnabled,
    })
  }

  const getFrequencyBadge = (frequency: string) => {
    const colors = {
      daily: "bg-green-100 text-green-800",
      weekly: "bg-blue-100 text-blue-800",
      weekdays: "bg-purple-100 text-purple-800",
      weekends: "bg-orange-100 text-orange-800",
    }
    return colors[frequency as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Food Reminders</h2>
          <p className="text-gray-600">Set up reminders for meals, water intake, and supplements</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
              <DialogDescription>
                Create a new food reminder to help you stay on track with your diet.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  placeholder="e.g., Drink Water, Take Vitamins"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newReminder.message}
                  onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                  placeholder="Reminder message..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={newReminder.frequency}
                  onValueChange={(value: any) => setNewReminder({ ...newReminder, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sound"
                  checked={newReminder.soundEnabled}
                  onCheckedChange={(checked) => setNewReminder({ ...newReminder, soundEnabled: checked })}
                />
                <Label htmlFor="sound">Enable sound</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addReminder}>Add Reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingReminder} onOpenChange={() => setEditingReminder(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
            <DialogDescription>Update your food reminder details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                placeholder="e.g., Drink Water, Take Vitamins"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-message">Message</Label>
              <Textarea
                id="edit-message"
                value={newReminder.message}
                onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                placeholder="Reminder message..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-frequency">Frequency</Label>
              <Select
                value={newReminder.frequency}
                onValueChange={(value: any) => setNewReminder({ ...newReminder, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-sound"
                checked={newReminder.soundEnabled}
                onCheckedChange={(checked) => setNewReminder({ ...newReminder, soundEnabled: checked })}
              />
              <Label htmlFor="edit-sound">Enable sound</Label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={updateReminder}>Update Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminders List */}
      <div className="grid gap-4">
        {reminders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders yet</h3>
              <p className="text-gray-500 text-center mb-4">
                Create your first food reminder to help you stay on track with your diet goals.
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Reminder
              </Button>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder.id} className={`${reminder.isActive ? "" : "opacity-60"}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${reminder.isActive ? "bg-green-100" : "bg-gray-100"}`}>
                      <Bell className={`h-4 w-4 ${reminder.isActive ? "text-green-600" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{reminder.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{reminder.time}</span>
                        <Badge className={getFrequencyBadge(reminder.frequency)}>{reminder.frequency}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {reminder.soundEnabled ? (
                      <Volume2 className="h-4 w-4 text-gray-400" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-gray-400" />
                    )}
                    <Switch checked={reminder.isActive} onCheckedChange={() => toggleReminder(reminder.id)} />
                  </div>
                </div>
              </CardHeader>
              {reminder.message && (
                <CardContent className="pt-0 pb-3">
                  <p className="text-gray-600">{reminder.message}</p>
                </CardContent>
              )}
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {reminder.lastTriggered
                      ? `Last triggered: ${reminder.lastTriggered.toLocaleString()}`
                      : "Never triggered"}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(reminder)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteReminder(reminder.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
