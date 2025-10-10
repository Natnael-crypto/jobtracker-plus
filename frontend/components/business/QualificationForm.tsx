"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { useCreateQualification } from "@/hooks/useQualification";
import { start } from "repl";

interface FormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "Education" | "Award";
}

const FormModal: React.FC<FormModalProps> = ({ open, onOpenChange, type }) => {
  const { mutate: createMutation } = useCreateQualification();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear + 10 - i);

  const [form, setForm] = useState({
    start_year: "",
    end_year: "",
    title: "",
    institution: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Reset end_year if start_year changes
    if (e.target.name === "start_year") {
      setForm((prev) => ({
        ...prev,
        start_year: e.target.value,
        end_year: "",
      }));
    }
  };

  const handleSave = () => {
    if (!form.start_year || !form.title || !form.institution) return;
    createMutation({
      type: type,
      title: form.title,
      start_year: parseInt(form.start_year),
      end_year: parseInt(form.end_year),
      institute: form.institution,
      description: form.description,
    });
    setForm({
      start_year: "",
      end_year: "",
      title: "",
      institution: "",
      description: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add {type}
          </DialogTitle>
          <DialogDescription>
            Fill out the details for your {type.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Start Year */}
          <div className="space-y-2">
            <Label htmlFor="start_year">Start Year</Label>
            <select
              id="start_year"
              name="start_year"
              className="border rounded-md w-full p-2"
              value={form.start_year}
              onChange={handleSelectChange}
            >
              <option value="">Select start year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* End Year */}
          <div className="space-y-2">
            <Label htmlFor="end_year">End Year</Label>
            <select
              id="end_year"
              name="end_year"
              className="border rounded-md w-full p-2"
              value={form.end_year}
              onChange={handleSelectChange}
              disabled={!form.start_year}

            >
              <option value="">Select end year</option>
              {years
                .filter(
                  (year) => !form.start_year || year >= Number(form.start_year)
                )
                .map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Degree or Award name"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              name="institution"
              placeholder="School / Organization"
              value={form.institution}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Optional details..."
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};



// ======================
// Editor Section Update
// ======================
interface EditorSectionProps {
  title: string;
  buttonText: string;
  type: "Education" | "Award";
  onAdd: (data: {
    yearRange: string;
    title: string;
    institution: string;
    description: string;
  }) => void;
  children: React.ReactNode;
}

const EditorSection: React.FC<EditorSectionProps> = ({
  title,
  buttonText,
  type,
  onAdd,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white p-6 md:p-8 rounded border border-gray-100 w-full max-w-4xl mx-auto mb-10">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center space-x-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>{buttonText}</span>
        </button>
      </div>

      <div className="mt-4 relative">{children}</div>

      <FormModal open={open} onOpenChange={setOpen} type={type} />
    </div>
  );
};

export default EditorSection;
