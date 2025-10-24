// app/home-value/page.tsx
import Image from "next/image";
import React from "react";

export const metadata = {
  title: "Maximizing Your Home’s Potential | Building Works & Home Value",
  description:
    "Discover how building works like conservatories, loft conversions, and extensions can increase your home's value and improve living spaces.",
};

export default function HomeValuePage() {
  return (
    <main className="max-w-6xl mx-auto p-6 md:p-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Maximizing Your Home’s Potential
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          The Power of Building Works in Adding Value
        </p>
      </header>

      {/* Section 1: Intro */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <p>
          When it comes to increasing the value of your home, a little
          investment can go a long way—especially when it involves building
          works. Whether you're looking to boost your home’s resale price or
          simply enhance your living space, smart renovations can transform your
          property.
        </p>
        <p>
          From conservatories to loft conversions and garden rooms, the right
          building projects can turn your property into a more functional,
          beautiful, and valuable space.
        </p>
      </section>

      {/* Section 2: Conservatories */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Conservatories: A Space That Sells Itself
        </h2>
        <p className="mb-4">
          A conservatory provides an extra living area and creates a seamless
          connection between indoors and outdoors. Whether used as a dining
          area, office, or reading nook, conservatories bring in natural light,
          making your home feel more expansive.
        </p>
        <p className="mb-4 font-medium">
          According to property experts, adding a conservatory can increase the
          value of your home by as much as <strong>5-10%</strong>.
        </p>
        <p>
          Modern conservatories also use energy-efficient glass and materials
          that trap warmth during winter while staying cool in summer, adding
          practical and eco-friendly value.
        </p>
      </section>

      {/* Section 3: Other Building Works */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Other Building Works That Add Instant Appeal
        </h2>
        <ul className="list-disc ml-6 space-y-4">
          <li>
            <strong>Loft Conversions:</strong> Transform underutilized attics
            into bedrooms, offices, or bathrooms. Can increase home value up to
            20%.
          </li>
          <li>
            <strong>Extensions:</strong> Add rooms like kitchens, dining spaces,
            or bedrooms. More space means more buyers and higher resale value.
          </li>
          <li>
            <strong>Garden Rooms:</strong> Ideal for home offices, gyms, or
            relaxation spaces. Affordable and adds unique appeal without major
            groundwork.
          </li>
        </ul>
      </section>

      {/* Section 4: Benefits */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Benefits Beyond Property Value
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Enhanced Living Space:</strong> More room to relax,
            entertain, and work.
          </li>
          <li>
            <strong>Improved Quality of Life:</strong> Brighter, airier rooms
            and functional spaces improve comfort.
          </li>
          <li>
            <strong>Long-Term Investment:</strong> Renovations pay off over
            time, keeping your property competitive.
          </li>
          <li>
            <strong>Personalization:</strong> Customize your home to your
            lifestyle.
          </li>
        </ul>
      </section>

      {/* Section 5: Expert Tips */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Key Tips for Maximizing ROI
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Choose the Right Contractor:</strong> Research, read
            reviews, and pick experienced professionals.
          </li>
          <li>
            <strong>Stay Within Budget:</strong> Balance quality materials with
            potential ROI.
          </li>
          <li>
            <strong>Consider Your Local Market:</strong> Some improvements yield
            higher value depending on location.
          </li>
          <li>
            <strong>Get Permissions:</strong> Ensure plans meet building
            regulations and obtain necessary permits.
          </li>
        </ul>
      </section>

      {/* Section 6: Conclusion */}
      <section className="mb-12 prose prose-lg max-w-full mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          Unlock Your Home’s Full Potential
        </h2>
        <p>
          Building works are an excellent way to increase your home’s value and
          functionality. With the right planning and execution, you’ll enjoy a
          more comfortable, beautiful home and see a great return on investment.
        </p>
        <p>
          Ready to transform your home? Start planning your next building
          project today!
        </p>
      </section>
    </main>
  );
}
