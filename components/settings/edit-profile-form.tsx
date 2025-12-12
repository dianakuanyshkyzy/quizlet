"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface EditProfileFormProps {
  userData: UserData;
  onSubmit: (data: Partial<UserData>) => void;
  onCancel: () => void;
}

export default function EditProfileForm({
  userData,
  onSubmit,
  onCancel,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    status: userData.status,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    onSubmit(formData);
    setIsLoading(false);
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-linear-to-r from-[#4255ff]/5 to-accent/5 pb-4 -m-6 p-6 mb-0">
        <div className="flex items-center justify-between">
          <div className="ml-6">
            <CardTitle className="text-2xl ">Edit profile</CardTitle>
            <CardDescription>Update your account information</CardDescription>
          </div>
          <button
            onClick={onCancel}
            className="mr-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Your name"
              className="mt-2 border-border focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your@email.com"
              className="mt-2 border-border focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="mt-2 border-border focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Away">Away</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
