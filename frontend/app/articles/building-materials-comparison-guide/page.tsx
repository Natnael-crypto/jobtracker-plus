// app/building-materials-comparison-guide/page.tsx
import React from "react";

export const metadata = {
  title: "Building Material Comparisons | Home Construction & Renovation",
  description:
    "Explore the pros and cons of popular building materials for your home renovation projects. Timber vs. steel, brick vs. block, asphalt vs. gravel, and more.",
};

export default function BuildingMaterialsGuidePage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Building Material Comparisons: Choosing the Right Options for Your
          Project
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          A practical guide to timber, steel, brick, block, and more
        </p>
      </header>

      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <p>
          When building or renovating, selecting the right materials is
          critical. Each option offers unique advantages and trade-offs that
          affect durability, aesthetics, energy efficiency, and long-term
          maintenance. This guide helps you weigh your choices carefully.
        </p>
      </section>

      {/* Timber vs Steel */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          1. Timber vs. Steel for Structural Frameworks
        </h2>

        <h3 className="font-semibold">Timber Framework</h3>
        <ul>
          <li>
            Pros: Natural warmth, easy to work with, environmentally friendly,
            great insulation.
          </li>
          <li>
            Cons: Prone to rot, pests, moisture issues, requires regular
            maintenance.
          </li>
        </ul>

        <h3 className="font-semibold">Steel Framework</h3>
        <ul>
          <li>
            Pros: Durable, pest/fire-resistant, minimal maintenance, ideal for
            modern designs.
          </li>
          <li>
            Cons: Higher upfront cost, requires specialist skills, poor
            insulation if not treated.
          </li>
        </ul>
      </section>

      {/* Brick vs Block */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          2. Brick vs. Block for Exterior Walls
        </h2>

        <h3 className="font-semibold">Brick Walls</h3>
        <ul>
          <li>Pros: Classic aesthetics, durable, sound/weather insulation.</li>
          <li>Cons: Expensive, labor-intensive, harder to modify or extend.</li>
        </ul>

        <h3 className="font-semibold">Block Walls</h3>
        <ul>
          <li>Pros: Affordable, quicker to build, superior insulation.</li>
          <li>
            Cons: Less visually appealing, may require finishing or cladding.
          </li>
        </ul>
      </section>

      {/* Asphalt vs Gravel */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          3. Asphalt vs. Gravel for Driveways
        </h2>

        <h3 className="font-semibold">Asphalt Driveway</h3>
        <ul>
          <li>Pros: Durable, smooth, low maintenance, polished look.</li>
          <li>
            Cons: Higher initial cost, can crack over time, limited color/design
            options.
          </li>
        </ul>

        <h3 className="font-semibold">Gravel Driveway</h3>
        <ul>
          <li>Pros: Affordable, rustic look, easy to install.</li>
          <li>Cons: Requires maintenance, noisy, may shift over time.</li>
        </ul>
      </section>

      {/* Vinyl vs Wood */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          4. Vinyl vs. Wood for Flooring
        </h2>

        <h3 className="font-semibold">Wood Flooring</h3>
        <ul>
          <li>Pros: Timeless, adds warmth, long-lasting, refinishable.</li>
          <li>
            Cons: Expensive, susceptible to water damage, requires ongoing
            maintenance.
          </li>
        </ul>

        <h3 className="font-semibold">Vinyl Flooring</h3>
        <ul>
          <li>Pros: Affordable, water-resistant, low maintenance.</li>
          <li>Cons: Less elegant, prone to damage, can fade over time.</li>
        </ul>
      </section>

      {/* Concrete vs Decking */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          5. Concrete vs. Decking for Outdoor Spaces
        </h2>

        <h3 className="font-semibold">Concrete Patio</h3>
        <ul>
          <li>Pros: Durable, low maintenance, customizable patterns/colors.</li>
          <li>Cons: Can crack, high installation cost, lacks warmth.</li>
        </ul>

        <h3 className="font-semibold">Decking</h3>
        <ul>
          <li>Pros: Warm, natural look, relaxing space, design flexibility.</li>
          <li>
            Cons: Requires upkeep, susceptible to weather, can be slippery.
          </li>
        </ul>
      </section>

      {/* Conclusion */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Conclusion: Choosing the Right Material
        </h2>
        <p>
          Every building decision matters. Consider budget, style, long-term
          needs, and maintenance when selecting materials. Engage with
          contractors or suppliers to ensure your choices offer durability,
          functionality, and aesthetic appeal for years to come.
        </p>
      </section>
    </main>
  );
}
