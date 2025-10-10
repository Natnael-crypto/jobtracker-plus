"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  useGetMyIntroduction,
  useUpdateIntroduction,
} from "@/hooks/useIntroduction";

const AboutMe: React.FC = () => {
  const [aboutMe, setAboutMe] = useState("");
  const { data: intro } = useGetMyIntroduction();
  const { mutate: updateMutation, isPending: updating } =
    useUpdateIntroduction();

  useEffect(() => {
    if (intro) {
      setAboutMe(intro.description);
    }
  }, [intro]);

  const handleSave = () => {
    try {
      updateMutation({ description: aboutMe });
    } catch (err) {
      console.error("Failed to save intro:", err);
    }
  };

  return (
    <section className="bg-white p-6 sm:p-8 rounded border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">About Me</h2>

      <div>
        <Textarea
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="Tell us about yourself..."
        />
      </div>
      <div className="pt-4">
        <Button
          onClick={handleSave}
          disabled={updating}
          className="bg-green-600 hover:bg-green-700 text-white w-[150px] py-2 rounded"
        >
          {updating ? "Saving..." : "Save"}
        </Button>
      </div>
    </section>
  );
};

export default AboutMe;
