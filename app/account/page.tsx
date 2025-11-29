"use client"

import { useState } from "react"
import ProfileSection from "@/components/settings/profile-section"
import EditProfileForm from "@/components/settings/edit-profile-form"
import PasswordChangeForm from "@/components/settings/password-change-form"
import DeleteAccountSection from "@/components/settings/delete-account-section"

interface UserData {
  name: string
  email: string
  status: string
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john@example.com",
    status: "Active",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleUpdateProfile = (updatedData: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...updatedData }))
    setIsEditing(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary/20 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">Account Settings</h1>
          <p className="mt-2 text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <ProfileSection userData={userData} isEditing={isEditing} setIsEditing={setIsEditing} />

          {/* Edit Profile Form */}
          {isEditing && (
            <EditProfileForm userData={userData} onSubmit={handleUpdateProfile} onCancel={() => setIsEditing(false)} />
          )}

          {/* Password Change Form */}
          <PasswordChangeForm />

          {/* Delete Account Section */}
          <DeleteAccountSection />
        </div>
      </div>
    </main>
  )
}
