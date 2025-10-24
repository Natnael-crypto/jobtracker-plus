import React from "react";

export const metadata = {
  title: "Sustainable Building Materials | Eco-Friendly Homes",
  description:
    "Learn about sustainable building materials and eco-friendly homes. Improve energy efficiency, reduce environmental impact, and embrace the future of construction.",
};

export default function SustainableMaterialsPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          The Rise of Sustainable Building Materials
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          Why Eco-Friendly Homes Are the Future
        </p>
      </header>

      {/* Section 1: Intro */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <p>
          The construction industry is shifting towards sustainability, with
          homeowners and builders incorporating eco-friendly materials to reduce
          environmental impact. Whether building, renovating, or upgrading,
          these materials make homes greener, healthier, and more efficient.
        </p>
      </section>

      {/* Section 2: Growing Demand */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          The Growing Demand for Green Homes
        </h2>
        <p>
          Demand for eco-friendly homes is skyrocketing. According to the 2023
          UKGBC report, 77% of homebuyers prefer properties with sustainable
          features, and 60% are willing to pay more for energy-efficient systems
          and eco-friendly materials.
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Climate Change:</strong> Reduce carbon emissions and energy
            consumption.
          </li>
          <li>
            <strong>Energy Costs:</strong> Energy-efficient materials lower
            heating/cooling bills.
          </li>
          <li>
            <strong>Health:</strong> Materials reduce exposure to harmful
            chemicals.
          </li>
        </ul>
      </section>

      {/* Section 3: What Makes Materials Sustainable */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          What Makes Building Materials 'Sustainable'?
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Renewable:</strong> Bamboo, cork, hemp.
          </li>
          <li>
            <strong>Locally Sourced:</strong> Reduce transport emissions.
          </li>
          <li>
            <strong>Energy-Efficient:</strong> High-performance insulation,
            triple-glazed windows.
          </li>
          <li>
            <strong>Low Toxicity:</strong> Natural paints, VOC-free finishes.
          </li>
        </ul>
        <p>
          Popular examples include Recycled Steel, Hempcrete, Bamboo Flooring,
          and Recycled Glass.
        </p>
      </section>

      {/* Section 4: Energy Efficiency */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Sustainable Materials and Energy Efficiency
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Passive Design:</strong> Natural insulation reduces energy
            use.
          </li>
          <li>
            <strong>Triple-Glazed Windows:</strong> Reduce heat loss.
          </li>
          <li>
            <strong>Solar Panels & Green Roofs:</strong> Lower reliance on
            fossil fuels.
          </li>
        </ul>
      </section>

      {/* Section 5: Trending Eco-Building Topics */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Hot Topics in Eco-Building
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Green Roofs & Vertical Gardens:</strong> Insulation, air
            quality, and biodiversity benefits.
          </li>
          <li>
            <strong>Eco-Friendly Smart Homes:</strong> Combine smart tech with
            sustainable materials for efficiency.
          </li>
          <li>
            <strong>Timber Construction & CLT:</strong> Carbon-neutral,
            sustainable alternative to concrete and steel.
          </li>
          <li>
            <strong>Biodegradable Insulation:</strong> Sheep wool, cellulose,
            and hemp provide excellent thermal performance.
          </li>
        </ul>
      </section>

      {/* Section 6: How to Start */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          How to Start Incorporating Sustainable Materials
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Start small with low-VOC paints or energy-efficient lighting.</li>
          <li>Consult professionals experienced in sustainable design.</li>
          <li>
            Research and choose locally sourced materials to reduce emissions.
          </li>
        </ul>
      </section>

      {/* Section 7: Conclusion */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Why It’s Time to Build Greener Homes
        </h2>
        <p>
          Sustainable building materials reduce environmental impact, lower
          energy costs, and future-proof homes. Embrace the green
          revolution—whether building, renovating, or upgrading, there’s never
          been a better time to build sustainably.
        </p>
        <p>
          Get in touch with our experts to discuss incorporating eco-friendly
          materials into your next project. Start building a better future,
          today.
        </p>
      </section>
    </main>
  );
}
