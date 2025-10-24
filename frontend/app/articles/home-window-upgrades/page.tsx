// app/home-window-upgrades/page.tsx
import React from "react";

export const metadata = {
  title: "Home Window Upgrades | Energy Efficiency & Style",
  description:
    "Upgrade your windows to improve energy efficiency, reduce carbon footprint, enhance natural light, and boost your home's style and value.",
};

export default function HomeWindowUpgradesPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Windows: The Unsung Heroes of Home Efficiency and Style
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          Improve Comfort, Energy Efficiency, and Aesthetic Appeal
        </p>
      </header>

      {/* Section 1: Intro */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <p>
          Windows often don’t get the attention they deserve, yet they play a
          critical role in insulation, natural lighting, and curb appeal.
          Choosing the right windows can improve comfort, energy efficiency, and
          property value.
        </p>
      </section>

      {/* Section 2: Why Window Upgrades Matter */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Why Window Upgrades Are a Game-Changer
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Energy Efficiency:</strong> Multi-glazed insulating glass
            lowers heating and cooling costs.
          </li>
          <li>
            <strong>Noise Reduction:</strong> Double or triple glazing reduces
            external noise.
          </li>
          <li>
            <strong>Natural Light:</strong> Improves mood and productivity while
            reducing artificial lighting needs.
          </li>
          <li>
            <strong>Aesthetic Appeal:</strong> Modern or classic styles enhance
            home design and curb appeal.
          </li>
        </ul>
      </section>

      {/* Section 3: Energy Efficiency */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          The Energy Efficiency Revolution: How New Windows Save You Money
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Double and Triple Glazing:</strong> Cut heat loss by up to
            50%, superior insulation, especially in cold climates.
          </li>
          <li>
            <strong>Low-Emissivity (Low-E) Glass:</strong> Reflects heat in
            winter and allows sun’s heat in summer, saving £100-£200/year.
          </li>
          <li>
            <strong>Argon Gas Filling:</strong> Reduces heat transfer, keeping
            homes warmer in winter and cooler in summer.
          </li>
        </ul>
      </section>

      {/* Section 4: Environmental Benefits */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Environmental Benefits: Reducing Your Carbon Footprint
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Lower Carbon Emissions:</strong> Less energy needed for
            heating/cooling reduces household carbon footprint.
          </li>
          <li>
            <strong>Sustainable Materials:</strong> Recyclable aluminium or
            eco-friendly uPVC frames are durable and environmentally conscious.
          </li>
        </ul>
      </section>

      {/* Section 5: Styles and Window Types */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Style and Functionality: Choosing the Right Windows
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Casement Windows:</strong> Hinged side windows for fresh air
            and classic style.
          </li>
          <li>
            <strong>Sliding Windows:</strong> Horizontal sliding, sleek modern
            look, great for tight spaces.
          </li>
          <li>
            <strong>Bay or Bow Windows:</strong> Extend space, dramatic effect,
            ideal for traditional homes.
          </li>
          <li>
            <strong>Tilt and Turn Windows:</strong> Tilt for ventilation or
            fully open for easy cleaning.
          </li>
        </ul>
      </section>

      {/* Section 6: Costs */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          How Much Do New Windows Cost?
        </h2>
        <p>
          Costs vary depending on window type, material, size, and installation
          complexity. Average high-quality, energy-efficient replacements:
          £400-£1,000 per window.
        </p>
        <p>
          While upfront costs can seem high, long-term energy savings and
          increased property value make it worthwhile.
        </p>
      </section>

      {/* Section 7: Conclusion */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Get Started with Your Window Upgrade Today
        </h2>
        <p>
          Upgrading windows improves comfort, energy efficiency, and home value.
          With the right windows, you're investing in your home's future.
        </p>
      </section>
    </main>
  );
}
