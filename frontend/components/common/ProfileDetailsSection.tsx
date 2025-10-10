"use client";

import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useUserProfile,
  useUpdateProfile,
  useUploadProfileImage,
} from "@/hooks/useUserProfile";
import { useState, useEffect } from "react";

export const ProfileDetailsSection: React.FC = () => {
  const { data: profile } = useUserProfile();
  const { mutate: updateProfile, isPending: updating } = useUpdateProfile();
  const { mutate: uploadImage, isPending: uploading } = useUploadProfileImage();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });

  // Populate form after profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(form);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  return (
    <section className="bg-white p-6 sm:p-8 rounded border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Profile Details
      </h2>

      <div className="flex items-start space-x-4 mb-8">
        <img
          src={profile?.image_url || "/default-avatar.png"}
          alt="Profile"
          className="h-20 w-20 rounded-full border border-gray-300 object-cover"
        />
        <div className="flex flex-col pt-1">
          <label className="inline-flex w-[150px] items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 mb-2 transition duration-150 cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-gray-500">
            Max File size: 1MB. Min dimension: 320x320. Supported: JPG, PNG.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* First Name */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="John"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Doe"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </div>

          {/* Email (readonly) */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="email@example.com"
              value={profile?.id || ""}
              disabled
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              name="phone_number"
              placeholder="07544920859"
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
            />
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={updating}
            className="bg-green-600 hover:bg-green-700 text-white w-[150px] py-2 rounded disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
};
