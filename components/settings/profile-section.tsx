"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit2 } from "lucide-react"

interface UserData {
    id:string
    name: string
    email: string
    status: string
    role: string
    createdAt: string
    updatedAt: string
  }

interface ProfileSectionProps {
  userData: UserData
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}

export default function ProfileSection({ userData, isEditing, setIsEditing }: ProfileSectionProps) {
  if (isEditing) return null

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#4255ff]/5 to-accent/5 -m-6 p-6 mb-0">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <div className = "ml-6">
              <CardTitle className="text-2xl ">Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2 mr-6">
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
      </div>
      <CardContent className="pt-8 pb-8">
        <div className="grid gap-8 sm:grid-cols-2">
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
            <Badge className="w-fit bg-[#4255ff] text-primary-foreground">{userData.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
