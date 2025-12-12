"use client";

import { useEffect, useState } from "react";
import ProfileSection from "@/components/settings/profile-section";
import EditProfileForm from "@/components/settings/edit-profile-form";
import DeleteAccountSection from "@/components/settings/delete-account-section";
import PasswordChangeForm from "@/components/settings/password-change-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type UserData = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export default function AccountPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://imba-server.up.railway.app/users/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setUserData(data.data);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("error loading user", err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleUpdate = async (updatedFields: Partial<UserData>) => {
    try {
      const res = await fetch("https://imba-server.up.railway.app/users/me", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await res.json();
      setUserData(updatedUser.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };
  useEffect(() => {
    if (!loading && !userData) {
      router.push("/login");
    }
  }, [loading, router, userData]);

  if (loading) return <p className="p-8">loading…</p>;
  if (!userData) return null;

  return (
    <>
      <main className="min-h-screen bg-linear-to-br from-background to-secondary/20 py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#4255ff]">
                Account Settings
              </h1>
              <p className="mt-2 text-muted-foreground">
                Manage your account information and preferences
              </p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          <div className="space-y-6">
            {!isEditing
              ? userData && (
                  <ProfileSection
                    userData={userData}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                  />
                )
              : userData && (
                  <EditProfileForm
                    userData={userData}
                    onSubmit={handleUpdate}
                    onCancel={() => setIsEditing(false)}
                  />
                )}
            <PasswordChangeForm />
            <DeleteAccountSection />
          </div>
        </div>
      </main>
    </>
  );
}
