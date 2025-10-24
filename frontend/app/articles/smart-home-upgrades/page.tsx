// app/smart-home-upgrades/page.tsx
import React from "react";

export const metadata = {
  title: "Smart Home Upgrades | Energy Efficiency & Home Automation",
  description:
    "Discover smart home upgrades that increase convenience, security, energy efficiency, and ROI. Make your home smarter, greener, and more valuable.",
};

export default function SmartHomeUpgradesPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Smart Home Upgrades
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          The Future of Home Automation and Energy Efficiency
        </p>
      </header>

      {/* Section 1: Intro */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <p>
          The world is rapidly shifting toward smarter, more efficient homes,
          and it's not just about convenience—it’s about transforming how we
          live. Smart home technology is revolutionizing the way we interact
          with our spaces, making them safer, more connected, and
          energy-efficient.
        </p>
        <p>
          Beyond convenience, smart systems offer significant cost-saving
          benefits. If you're thinking about upgrading your home, let’s explore
          why smart homes are more than just a trend—they’re the future.
        </p>
      </section>

      {/* Section 2: Why Smart Homes */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Why Smart Homes Are Here to Stay
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Energy Efficiency:</strong> Smart thermostats, lighting, and
            appliances reduce energy waste and lower bills.
          </li>
          <li>
            <strong>Convenience:</strong> Control doors, lights, and temperature
            remotely or via voice commands.
          </li>
          <li>
            <strong>Security:</strong> Smart cameras, sensors, and alerts
            provide better protection than traditional alarms.
          </li>
        </ul>
      </section>

      {/* Section 3: Smart Energy-Efficient Features */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Smart Energy-Efficient Features That Will Transform Your Home
        </h2>
        <ul className="list-disc ml-6 space-y-4">
          <li>
            <strong>Smart Thermostats:</strong> Learn temperature preferences,
            control remotely, and save 10-15% annually on heating/cooling.
          </li>
          <li>
            <strong>Smart Lighting:</strong> Control brightness, color, and
            schedules. LED smart bulbs save up to 75% energy and last 25x
            longer.
          </li>
          <li>
            <strong>Smart Appliances:</strong> Monitor energy use, schedule
            off-peak operation, and reduce waste.
          </li>
          <li>
            <strong>Smart Plugs:</strong> Low-cost solution to schedule and
            remotely control appliances, preventing energy waste.
          </li>
        </ul>
      </section>

      {/* Section 4: Sustainability */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Smart Homes and Sustainability: The Green Revolution
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Solar Panel Integration:</strong> Monitor and optimise solar
            power for efficiency.
          </li>
          <li>
            <strong>Water Conservation:</strong> Smart irrigation adjusts
            schedules based on weather, reducing water waste.
          </li>
        </ul>
        <p>
          Eco-friendly smart homes reduce costs and contribute to environmental
          preservation.
        </p>
      </section>

      {/* Section 5: ROI */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          The ROI of Smart Home Upgrades
        </h2>
        <p>
          Smart homes sell for 5-10% more than those without technology, while
          energy savings offset initial costs over time. As smart tech becomes
          more accessible, ROI continues to improve.
        </p>
      </section>

      {/* Section 6: Getting Started */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          How to Get Started with Smart Home Upgrades
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Start with basics: thermostats, lighting, and smart plugs.</li>
          <li>Set a budget and prioritize upgrades for energy savings.</li>
          <li>
            Consult an expert to assess your home and recommend solutions.
          </li>
        </ul>
      </section>

      {/* Section 7: Conclusion */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          The Future Is Smart and Sustainable
        </h2>
        <p>
          Smart homes provide convenience, energy efficiency, and
          sustainability. Embrace the future, and make your home more
          intelligent, connected, and eco-friendly.
        </p>
      </section>
    </main>
  );
}
