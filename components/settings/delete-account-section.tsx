"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"

export default function DeleteAccountSection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE MY ACCOUNT") return

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, this would redirect to login or home page
    console.log("Account deleted")
    setIsLoading(false)
  }

  return (
    <Card className="border-destructive/50 shadow-lg">
      <CardHeader className="bg-destructive/5 pb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!showDeleteConfirm ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Delete Account</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button onClick={() => setShowDeleteConfirm(true)} variant="destructive" className="whitespace-nowrap">
              Delete Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div>
              <h4 className="font-semibold text-destructive">Are you absolutely sure?</h4>
              <p className="mt-2 text-sm text-foreground">
                This will permanently delete your account and all your data. This action cannot be reversed.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">
                Type <span className="font-bold">DELETE MY ACCOUNT</span> to confirm:
              </label>
              <Input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="mt-2 border-destructive/30 focus:border-destructive"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={confirmText !== "DELETE MY ACCOUNT" || isLoading}
                variant="destructive"
              >
                {isLoading ? "Deleting..." : "Yes, Delete My Account"}
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setConfirmText("")
                }}
                variant="outline"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
