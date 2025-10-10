import React, { FC } from "react";

interface Trade {
  name: string;
  icon: string;
}

const PRIMARY_COLOR = "#1A1B4B";
const CARD_BG = "#F8F8FA";

const IconMap: { [key: string]: string } = {
  Drill: "/Drill.svg",
  Shovel: "/Shovel.svg",
  Roller: "/Roller.svg",
  Tap: "/Tap.svg",
  Truck: "/Truck.svg",
  Axe: "/Axe.svg",
};

const TradeCard: FC<{ trade: Trade }> = ({ trade }) => {
  const IconComponent = IconMap[trade.icon];

  return (
    <div
      className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl transition-all cursor-pointer hover:shadow-lg h-36 w-full"
      style={{ backgroundColor: CARD_BG, cursor: "pointer" }}
    >
      <div className="mb-3">
        <img src={IconComponent} alt="" />
      </div>
      <p className="text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
        {trade.name}
      </p>
    </div>
  );
};

const popularTradesData: Trade[] = [
  { name: "Handyman", icon: "Drill" },
  { name: "Gardening", icon: "Shovel" },
  { name: "Decorating", icon: "Roller" },
  { name: "Plumbing", icon: "Tap" },
  { name: "Mover", icon: "Truck" },
  { name: "Joinery", icon: "Axe" },
];

export default function PopularTrades() {
  return (
    <div className=" bg-white">
      <style>{`
        /* Custom font import for better fidelity if needed, using Inter as standard */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex justify-between items-center mb-10">
            <h2
              className="text-4xl font-extrabold"
              style={{ color: PRIMARY_COLOR, lineHeight: "1.2" }}
            >
              Popular Trades
            </h2>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 group transition-colors hover:text-gray-800"
            >
              Show All Trades
              <img src="/arrow.svg" className="ml-2" alt="" />
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {popularTradesData.map((trade, index) => (
              <TradeCard key={index} trade={trade} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
