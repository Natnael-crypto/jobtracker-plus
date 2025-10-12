import { getYear } from "date-fns";
import React from "react";

type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

type Column = {
  title: string;
  links: LinkItem[];
};

const footerData: Column[] = [
  {
    title: "Homeowner",
    links: [
      { label: "Trade directory", href: "/trade" },
      { label: "Post a job", href: "/post-job" },
      { label: "How it works", href: "/how-client" },
      { label: "Cost Advice", href: "/cost-advice" },
      { label: "FAQ and Support desk", href: "#faq-support-homeowner" },
    ],
  },
  {
    title: "Tradesperson",
    links: [
      { label: "Sign up", href: "/signup/trade" },
      { label: "How it works", href: "/how-trade" },
      { label: "Getting started", href: "#getting-started" },
      { label: "FAQ and Support desk", href: "#faq-support-tradesperson" },
      { label: "Advice Centre", href: "/questions" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy-policy" },
      { label: "Terms of service", href: "#terms-of-service" },
      { label: "Terms of use", href: "#terms-of-use" },
    ],
  },
  {
    title: "Find us on social",
    links: [
      { label: "Facebook", href: "#facebook", external: true },
      { label: "Twitter", href: "#twitter", external: true },
      { label: "Linkedin", href: "#linkedin", external: true },
      { label: "Instagram", href: "#instagram", external: true },
    ],
  },
];

const FooterLink: React.FC<LinkItem> = ({ label, href, external }) => (
  <a
    href={href}
    className="block text-gray-800 text-sm py-1.5 hover:text-black transition duration-150"
    target={external ? "_blank" : "_self"}
    rel={external ? "noopener noreferrer" : undefined}
  >
    {external && <span className="mr-0.5 text-xs inline-block">↗</span>}
    {label}
  </a>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f7f7f7] w-full pt-16 pb-4 sm:pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-12 md:mb-0 md:min-w-[200px] flex items-start">
            <a
              href="#get-the-app"
              className="flex items-center justify-center space-x-2 p-3  hover:shadow-md transition duration-200"
              style={{ minWidth: "160px" }}
            >
              <span className="text-gray-900 text-lg font-medium whitespace-nowrap">
                JOBTRACKER <span className="text-green-500">+</span>
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-12 sm:gap-x-16 lg:gap-x-24 gap-y-10 md:grid-cols-4 md:gap-y-0 flex-grow max-w-4xl">
            {footerData.map((column, colIndex) => (
              <div key={colIndex}>
                <h3 className="text-sm font-semibold text-gray-900 tracking-tight mb-4 whitespace-nowrap">
                  {column.title}
                </h3>

                <ul role="list" className="space-y-1">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-800 text-md font-semibold text-center mt-8">
        Copyright {getYear(new Date())} JobTracker{" "}
        <span className="text-green-500">+</span>. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
