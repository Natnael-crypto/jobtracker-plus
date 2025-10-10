"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import {
  useCreateService,
  useDeleteService,
  useGetMyServices,
} from "@/hooks/useService";
import { AllServices } from "@/data/services";

const ServiceDetailsSection: React.FC = () => {
  const { data: myServices, isLoading } = useGetMyServices();
  const createService = useCreateService();
  const deleteService = useDeleteService();

  const handleSelect = (service: string) => {
    if (!myServices?.some((s) => s.service_name === service)) {
      createService.mutate({ service_name: service });
    }
  };

  const handleRemove = (serviceId: string) => {
    deleteService.mutate(serviceId);
  };

  return (
    <section className="bg-white p-6 sm:p-8 rounded border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Services</h2>

      {/* Selector */}
      <div className="space-y-2">
        <Label>Select Services</Label>
        <Select onValueChange={handleSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent>
            {AllServices.map((service, idx) => (
              <SelectItem key={idx} value={service}>
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-red-500 text-xs">maximum 3 services are allowed</p>
      </div>

      {/* Selected */}
      {myServices && myServices.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {myServices.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {s.service_name}
              <button
                type="button"
                onClick={() => handleRemove(s.id)}
                className="hover:text-red-500 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
};

export default ServiceDetailsSection;
