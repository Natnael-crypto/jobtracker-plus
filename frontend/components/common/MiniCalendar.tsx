import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MiniCalendar: React.FC<{
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}> = ({ currentDate, setCurrentDate }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = startOfWeek(addDays(monthEnd, 6), { weekStartsOn: 0 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
        >
          <ChevronLeft />
        </button>
        <h3 className="font-semibold text-sm">
          {format(monthStart, "MMMM yyyy")}
        </h3>
        <button
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
        >
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-gray-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mt-2 text-sm">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const selected = isSameDay(day, currentDate);
          return (
            <div
              key={index}
              className={`flex justify-center items-center h-8 w-8 mx-auto cursor-pointer rounded-full transition duration-150 ${
                selected
                  ? "bg-black text-white font-semibold"
                  : isCurrentMonth
                  ? "text-gray-800 hover:bg-gray-100"
                  : "text-gray-400"
              }`}
              onClick={() => setCurrentDate(day)}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </button>
      </div>
    </div>
  );
};
