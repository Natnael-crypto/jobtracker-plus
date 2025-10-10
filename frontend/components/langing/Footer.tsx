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
      { label: "Trade directory", href: "#directory" },
      { label: "Post a job", href: "#post-job" },
      { label: "How it works", href: "#how-it-works-homeowner" },
      { label: "Cost Advice", href: "#cost-advice" },
      { label: "FAQ and Support desk", href: "#faq-support-homeowner" },
    ],
  },
  {
    title: "Tradesperson",
    links: [
      { label: "Sign up", href: "#signup" },
      { label: "How it works", href: "#how-it-works-tradesperson" },
      { label: "Getting started", href: "#getting-started" },
      { label: "FAQ and Support desk", href: "#faq-support-tradesperson" },
      { label: "Advice Centre", href: "#advice-centre" },
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

const AppleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="currentColor"
    {...props}
  >
    <path d="M11.173 1.833c-.78-.813-1.892-1.332-3.173-1.332-1.282 0-2.395.52-3.175 1.332-.578.604-.972 1.405-1.127 2.316.033.003.07.005.107.005.418 0 .808-.093 1.139-.244.577-.265 1.258-.403 2.056-.379.79.023 1.554.204 2.238.54.218.109.431.233.635.372.46.314.935.617 1.404.975.247.186.505.344.757.48.56.305 1.12.56 1.76.56.49 0 .97-.132 1.393-.418.14-.094.275-.2.404-.316.036-.032.072-.064.108-.097-.003-.092-.007-.184-.012-.276-.038-.76-.23-1.464-.59-2.062-.35-.6-.826-1.16-1.42-1.616-.29-.22-.613-.39-.938-.55zm-1.636 10.607c-.42.667-.936 1.34-1.547 1.34-.61 0-1.127-.674-1.548-1.34-.418-.667-.627-1.493-.627-2.48s.209-1.813.628-2.48c.42-.667.936-1.04 1.547-1.04.61 0 1.127.373 1.548 1.04.418.667.627 1.493.627 2.48s-.209 1.813-.628 2.48zM14.945 8.165c.01-.27.015-.54.015-.81 0-3.673-2.668-5.328-3.088-5.518-1.536-1.175-3.666-1.39-5.127-.333-1.082.78-1.782 1.93-1.92 3.238-.112.983-.024 1.968.125 2.912.188 1.18.528 2.296 1.01 3.292.417.854.912 1.597 1.487 2.228.32.355.67.67 1.04.95.27.206.56.39.86.55.336.18.683.332 1.04.46.37.13.75.234 1.14.31.57.11 1.14.167 1.7.167 1.077 0 2.03-.306 2.87-.9.5-.35 1.008-.85 1.5-1.5.76-1.026 1.08-2.22 1.08-3.415 0-1.55-.42-2.91-1.26-4.04z" />
  </svg>
);

const GooglePlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M2.51 1.35C2.18 1.54 1.96 1.93 1.96 2.4V21.6c0 .47.22.86.55 1.05l10.99-10.99L2.51 1.35zm17.93 10.6L12.78 4.2c-.37-.21-.78-.22-1.15-.01l-1.4 1.4 8.71 8.71 1.51-1.5zm-5.63-1.46l-2.07 2.07-2.07-2.07 4.14-4.14 2.07 2.07-2.07 2.07zm-4.14 4.14l-2.07 2.07-2.07-2.07-4.14-4.14 2.07-2.07 2.07 2.07z" />
  </svg>
);

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
    <footer className="bg-[#f7f7f7] w-full pt-16 pb-20 sm:pt-20 sm:pb-28">
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
    </footer>
  );
};

export default Footer;
