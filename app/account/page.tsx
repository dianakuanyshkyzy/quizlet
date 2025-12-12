"use client";

import { useEffect, useState } from "react";
import ProfileSection from "@/components/settings/profile-section";
import EditProfileForm from "@/components/settings/edit-profile-form";
import DeleteAccountSection from "@/components/settings/delete-account-section";
import PasswordChangeForm from "@/components/settings/password-change-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useMe, useUpdateMe } from "@/lib/hooks/useUser";
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
  const { data: me, isLoading: meLoading } = useMe();
  const updateMe = useUpdateMe();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    if (me) setUserData(me as any);
  }, [me]);

  const handleUpdate = async (updatedFields: Partial<UserData>) => {
    updateMe.mutate(updatedFields, {
      onSuccess: (user) => {
        setUserData(user as any);
        setIsEditing(false);
      },
    });
  };
  useEffect(() => {
    if (!meLoading && !userData) {
      router.push("/login");
    }
  }, [meLoading, router, userData]);

  if (meLoading) return <p className="p-8">loading…</p>;
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
