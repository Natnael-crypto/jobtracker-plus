"use client";

import React from "react";
import Image from "next/image";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";

type Position = "left" | "right";
type Step = {
  id: number;
  title: string;
  text: string;
  icon: string;
  position: Position;
};

const timelineSteps: Step[] = [
  {
    id: 1,
    title: "Tell us about your job",
    text: "Use our simple form to tell us about your job. Describe the work, your location, and when you need it done. Clear details help tradespeople give accurate estimates and fair prices. It’s free and only takes a minute!",
    icon: "",
    position: "left",
  },
  {
    id: 2,
    title: "Local trades get in touch",
    text: "Once posted, we’ll forward your job to local trades. Interested tradespeople send you quotes and messages directly. You’ll only receive responses from trusted, verified professionals.",
    icon: "/communication.svg",
    position: "right",
  },
  {
    id: 3,
    title: "Choose your tradesperson",
    text: "Compare quotes, read reviews, and check profiles. You can message tradespeople to clarify details before making your decision. You’re under no obligation to hire anyone.",
    icon: "/team.svg",
    position: "left",
  },
  {
    id: 4,
    title: "Leave feedback",
    text: "Once your job is completed, leave honest feedback. This helps trades build their reputation and gives homeowners confidence when choosing the right professional.",
    icon: "/feedback.svg",
    position: "right",
  },
];

const TimelineStep: React.FC<{ step: Step; align: Position }> = ({
  step,
  align,
}) => {
  const isLeft = align === "left";

  return (
    <article
      aria-labelledby={`step-title-${step.id}`}
      className={`relative py-8 md:py-6 ${
        isLeft ? "md:text-left md:pr-8" : "md:text-left md:pl-8"
      }`}
    >
      <div className="flex items-center space-x-4 md:hidden mb-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-black text-xs font-semibold">
          {step.id}
        </span>
        <div>
          {step.icon && (
            <Image src={step.icon} alt={step.title} width={40} height={40} />
          )}
        </div>
      </div>

      <div className={`flex flex-col space-y-2`}>
        <div
          className={`hidden md:flex flex-col space-y-4 ${
            isLeft ? "md:items-end" : "md:items-start"
          }`}
        >
          <div>
            {step.icon && (
              <Image
                src={step.icon}
                alt={step.title}
                width={80}
                height={80}
                className="mx-auto"
              />
            )}
          </div>
          <h3 id={`step-title-${step.id}`} className="text-xl font-semibold">
            {step.title}
          </h3>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{step.text}</p>

        <h3 className="text-xl font-semibold md:hidden">{step.title}</h3>
      </div>
    </article>
  );
};

const TimelineSection: React.FC = () => {
  return (
    <section
      className="container mx-auto max-w-4xl px-4 py-16 md:py-24"
      aria-label="How it works timeline"
    >
      <div className="relative md:hidden">
        <div className="absolute top-0 left-6 w-[2px] h-full bg-gray-200" />
        {timelineSteps.map((step) => (
          <div key={step.id} className="ml-12 relative">
            <div className="absolute -left-6 top-4 w-8 h-8 rounded-full bg-white border-2 border-black flex items-center justify-center text-xs font-semibold">
              {step.id}
            </div>
            <TimelineStep step={step} align="left" />
          </div>
        ))}
      </div>

      <div className="hidden md:grid grid-cols-[1fr_72px_1fr] gap-x-8 relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-200" />

        {timelineSteps.map((step) => (
          <React.Fragment key={step.id}>
            <div className="col-span-1 flex items-start">
              {step.position === "left" ? (
                <TimelineStep step={step} align="left" />
              ) : null}
            </div>

            <div className="col-span-1 flex justify-center items-start relative z-10">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center text-sm font-semibold -mt-2">
                {step.id}
              </div>
            </div>

            <div className="col-span-1 flex items-start">
              {step.position === "right" ? (
                <TimelineStep step={step} align="right" />
              ) : null}
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

const HeaderSection: React.FC = () => {
  return (
    <header className="container mx-auto px-4 pt-16 pb-12 md:pb-24 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-4">
        How it works
      </h1>
      <p className="text-gray-600 text-base md:text-lg text-center mx-auto max-w-lg mb-12">
        Find a tradesperson with confidence and ease. We connect you with
        verified local tradespeople and manage the whole connection service.
      </p>

      <div className="relative rounded-lg overflow-hidden shadow-xl bg-gray-100">
        <Image
          src="/lady.svg"
          alt="A woman looking at her mobile phone."
          width={1200}
          height={550}
          className="w-full h-auto object-cover object-center"
        />

        <div className="absolute top-1/2 left-4 md:left-10 lg:left-20 -translate-y-1/2 w-11/12 max-w-xs bg-white p-6 md:p-8 rounded-lg shadow-2xl space-y-6">
          <h2 className="text-xl font-bold">How it works</h2>
          <div className="space-y-4">
            {[
              "Post your job for free",
              "Trusted tradespeople respond",
              "Check quotes in one place",
            ].map((text, i) => (
              <div key={i} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-black text-white text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-base leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

const CTASection: React.FC = () => (
  <section className="container mx-auto px-4 max-w-4xl py-20 md:py-28">
    <div className="border border-gray-300 rounded-lg p-10 md:p-12 flex flex-col items-center space-y-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-center text-gray-800">
        Ready to find a tradesperson near you?
      </h2>
      <button
        type="button"
        className="px-8 py-4 bg-black text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition duration-200"
      >
        Get started
      </button>
    </div>
  </section>
);

const HowClientPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-white font-sans antialiased">
      <TopNav />
      <br />
      <HeaderSection />
      <TimelineSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default HowClientPage;
