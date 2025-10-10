import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { useState } from "react";
import { useChangePassword } from "@/hooks/useChangePassword";

export const ChangePasswordSection: React.FC = () => {
  const [form, setForm] = useState({
    new_password: "",
    confirm_password: "",
    old_password: "",
  });
  const { mutate: changePassword } = useChangePassword();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      return alert("Passwords do not match");
    }
    changePassword({
      old_password: form.old_password,
      new_password: form.new_password,
    });
  };

  return (
    <section className="p-6 sm:p-8 rounded border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Change Password
      </h2>

      <form className="space-y-6 max-w-md">
        <div>
          <Label htmlFor="old_password">Old Password</Label>
          <Input
            placeholder="********"
            name="old_password"
            type="password"
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="new_password">New Password</Label>
          <Input
            placeholder="********"
            name="new_password"
            type="password"
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <Input
            placeholder="********"
            name="confirm_password"
            type="password"
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white w-[150px] py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
};
