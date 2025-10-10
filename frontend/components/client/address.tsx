import { Upload } from "lucide-react";
import { TextInput } from "./TextInput";

export const AddressSection: React.FC = () => {
  return (
    <section className="bg-white p-6 sm:p-8 rounded border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Address</h2>

      <div className="flex items-start space-x-4 mb-8">
        <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-gray-200 flex-shrink-0 border border-gray-300"></div>
        <div className="flex flex-col pt-1">
          <button
            type="button"
            className="inline-flex w-[150px] items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 mb-2 transition duration-150"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Images
          </button>
          <p className="text-xs text-gray-500">
            Max File size is 1MB. Minimum dimension: 320x320. And Suitable files
            are (jpg & .png)
          </p>
        </div>
      </div>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <TextInput label="First Name" placeholder="john" name="firstname" />
          <TextInput label="Last Name" placeholder="doe" name="lastname" />
          <TextInput
            label="Email Address"
            placeholder="email@example.com"
            name="email"
            type="email"
          />

          <TextInput
            label="Phone Number"
            placeholder="07544920859"
            name="phone"
            type="tel"
          />
          <TextInput label="Address" placeholder="London ..." name="address" />
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white w-1/5 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </section>
  );
};
