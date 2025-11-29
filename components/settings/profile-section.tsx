"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit2 } from "lucide-react"

interface UserData {
  name: string
  email: string
  status: string
}

interface ProfileSectionProps {
  userData: UserData
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}

export default function ProfileSection({ userData, isEditing, setIsEditing }: ProfileSectionProps) {
  if (isEditing) return null

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </div>
          <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Name</p>
            <p className="text-lg font-semibold text-foreground">{userData.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-lg font-semibold text-foreground">{userData.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <Badge className="w-fit bg-primary text-primary-foreground">{userData.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
