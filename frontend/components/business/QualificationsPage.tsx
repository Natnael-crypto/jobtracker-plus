import React, { useState } from "react";
import EditorSection from "./QualificationForm";
import {
  useDeleteQualification,
  useGetMyQualifications,
  useUpdateQualification,
} from "@/hooks/useQualification";
import { Qualification } from "@/types/qualification";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
  </svg>
);

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

interface EditFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "Education" | "Award";
  qualification: Qualification;
}

const EditFormModal: React.FC<EditFormModalProps> = ({
  open,
  onOpenChange,
  type,
  qualification,
}) => {
  const { mutate: updateQualification } = useUpdateQualification();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear + 10 - i);

  const [form, setForm] = useState({
    qualification_id: qualification.id,
    start_year: qualification.start_year,
    end_year: qualification.end_year,
    title: qualification.title,
    institution: qualification.institute,
    description: qualification.description,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "start_year") {
      setForm((prev) => ({
        ...prev,
        start_year: parseInt(e.target.value),
        end_year: 0,
      }));
    }

    if (e.target.name === "end_year") {
      setForm((prev) => ({
        ...prev,
        end_year: parseInt(e.target.value),
      }));
    }
  };

  const handleSave = () => {
    if (!form.start_year || !form.title || !form.institution) return;
    updateQualification({
      qualification_id: form.qualification_id,
      title: form.title,
      start_year: form.start_year,
      end_year: form.end_year,
      institute: form.institution,
      description: form.description,
    });
    setForm({
      start_year: 0,
      end_year: 0,
      title: "",
      institution: "",
      description: "",
      qualification_id: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Update {type}
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

interface TimelineItemProps {
  item: Qualification;
}

const TimelineItem: React.FC<TimelineItemProps> = (item) => {
  const actionButtonClass =
    "p-1.5 rounded-lg transition-colors text-gray-400 hover:text-red-500 hover:bg-red-50";

  let markerContent: React.ReactNode;
  const markerType = item.item.institute![0].toUpperCase();
  const [open, setOpen] = useState(false);

  const { mutate: deleteMutation } = useDeleteQualification();

  if (markerType) {
    const bgColor = "#E0F2F1";
    const borderColor = "#80CBC4";
    const textColor = "#009688";

    markerContent = (
      <div
        className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full border border-2 font-semibold text-sm"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          color: textColor,
        }}
      >
        {markerType}
      </div>
    );
  } else {
    markerContent = (
      <div className="absolute left-[14px] top-2.5 w-[7px] h-[7px] rounded-full bg-gray-400" />
    );
  }

  const handleDelete = () => {
    deleteMutation(item.item.id);
  };

  const handleEdit = () => {
    setOpen(true);
  };

  return (
    <div className="relative pl-12 pb-10">
      {markerContent}

      <div className="flex justify-between items-start pt-1">
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-sm font-medium text-gray-500 mb-1">
            {item.item.start_year} - {item.item.end_year}
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-0.5">
            {item.item.title}
          </h3>
          <p className="text-sm font-medium text-green-700 mb-2">
            {item.item.institute}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {item.item.description}
          </p>
        </div>

        <div className="flex space-x-1.5 pt-0.5 flex-shrink-0">
          <button
            onClick={handleEdit}
            className={actionButtonClass}
            aria-label="Edit item"
          >
            <EditIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className={actionButtonClass}
            aria-label="Delete item"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <EditFormModal
        open={open}
        onOpenChange={setOpen}
        type={item.item.type}
        qualification={item.item}
      />
    </div>
  );
};

const QualificationsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { data: qualifications = [], isLoading } = useGetMyQualifications();

  const handleAdd = () => {
    setOpen(false);
  };

  return (
    <div className=" ">
      <div className="space-y-10">
        <EditorSection
          title="Qualifications"
          buttonText="Add Education"
          onAdd={handleAdd}
          type="Education"
        >
          {qualifications.map(
            (item, index) =>
              item.type === "Education" && (
                <TimelineItem key={item.id} item={item} />
              )
          )}
        </EditorSection>

        <EditorSection
          title="Accreditations & Awards"
          buttonText="Add Awards"
          onAdd={handleAdd}
          type="Award"
        >
          {qualifications.map(
            (item, index) =>
              item.type === "Award" && (
                <TimelineItem key={item.id} item={item} />
              )
          )}
        </EditorSection>
      </div>
    </div>
  );
};

export default QualificationsPage;
