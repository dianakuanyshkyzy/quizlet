"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Check } from "lucide-react"

interface PasswordData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default function PasswordChangeForm() {
  const [formData, setFormData] = useState<PasswordData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState<Partial<PasswordData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<PasswordData> = {}

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required"
    }
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSuccess(true)
    setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })
    setIsLoading(false)

    // Reset success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000)
  }

  const togglePasswordVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-4">
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Current Password</label>
            <div className="relative mt-2">
              <Input
                type={showPasswords.old ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) => {
                  setFormData({ ...formData, oldPassword: e.target.value })
                  if (errors.oldPassword) setErrors({ ...errors, oldPassword: "" })
                }}
                placeholder="Enter your current password"
                className={`pr-10 border-border focus:border-primary ${errors.oldPassword ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("old")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.old ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.oldPassword && <p className="mt-1 text-sm text-destructive">{errors.oldPassword}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">New Password</label>
            <div className="relative mt-2">
              <Input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => {
                  setFormData({ ...formData, newPassword: e.target.value })
                  if (errors.newPassword) setErrors({ ...errors, newPassword: "" })
                }}
                placeholder="Enter your new password"
                className={`pr-10 border-border focus:border-primary ${errors.newPassword ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-sm text-destructive">{errors.newPassword}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Confirm Password</label>
            <div className="relative mt-2">
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value })
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" })
                }}
                placeholder="Confirm your new password"
                className={`pr-10 border-border focus:border-primary ${errors.confirmPassword ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">Password changed successfully!</span>
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading || success}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
