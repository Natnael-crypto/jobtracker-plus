export const TextInput: React.FC<{
  label: string;
  placeholder: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, placeholder, name, type = "text", value, onChange }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700
                 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400
                 transition duration-150 ease-in-out"
    />
  </div>
);

export const SelectInput: React.FC<{
  label: string;
  name: string;
  options: string[];
}> = ({ label, name, options }) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-700 appearance-none
                   focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out
                   bg-white pr-10"
        defaultValue="Select"
      >
        <option disabled>Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  </div>
);
