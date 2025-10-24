"use client";

import { JSX, useState } from "react";

interface FAQItem {
  question: string;
  answer: string | JSX.Element;
}

const faqItems: FAQItem[] = [
  {
    question: "Getting Started with JobTrackPlus",
    answer: (
      <>
        <p>
          Welcome to JobTrackPlus! We’re thrilled to have you join our community
          of skilled tradespeople. This guide helps you get started quickly and
          get the most from your account.
        </p>
        <h3 className="font-semibold mt-2">1. Getting Set Up</h3>
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li>
            Register your details: Sign up for a free account and tell us about
            your trade.
          </li>
          <li>
            Verify your account: Complete verification to build trust with
            customers.
          </li>
          <li>
            Add a payment method: Securely add a credit or debit card to
            purchase job leads.
          </li>
          <li>
            Update your profile: Upload a photo, business description, and
            showcase your skills.
          </li>
          <li>
            Add public liability insurance: Increase credibility and customer
            confidence.
          </li>
          <li>
            Purchase leads: Browse and select suitable jobs for your trade and
            location.
          </li>
          <li>Win work: Contact homeowners promptly and professionally.</li>
          <li>Get reviewed: Ask satisfied customers to leave feedback.</li>
        </ul>
      </>
    ),
  },
  {
    question: "Tips for Getting the Most Out of JobTrackPlus",
    answer: (
      <>
        <h3 className="font-semibold mt-2">Build Feedback Early</h3>
        <p>
          After every job, ask customers to leave feedback. Start with smaller
          jobs to quickly build trust.
        </p>

        <h3 className="font-semibold mt-2">Perfect Your Profile</h3>
        <p>
          Add a professional photo, service description, experience, and
          qualifications. Optionally email us your business description and
          we’ll upload it for you.
        </p>

        <h3 className="font-semibold mt-2">Be Professional</h3>
        <p>
          Contact customers promptly, plan your calls, be polite, and provide
          written quotes to avoid misunderstandings.
        </p>

        <h3 className="font-semibold mt-2">Refine Your Account Settings</h3>
        <p>
          Adjust categories, work radius, company name, and subcontractor skills
          for better opportunities.
        </p>

        <h3 className="font-semibold mt-2">Promote Yourself</h3>
        <p>
          Use JobTrackPlus logos, business cards, referral incentives, social
          media, and before/after photos to market your work effectively.
        </p>
      </>
    ),
  },
  {
    question: "Disputing a Job Lead",
    answer: (
      <>
        <p>
          If you purchase a lead and encounter issues, you can submit a dispute
          directly via your account.
        </p>
        <h3 className="font-semibold mt-2">How to Dispute a Job Lead</h3>
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li>Log in to your account.</li>
          <li>
            Go to “My Jobs” and click “View Job” on the lead you want to
            dispute.
          </li>
          <li>Submit your dispute with as much detail as possible.</li>
        </ul>
        <p>
          We investigate disputes and may issue refunds, free leads, or explain
          why a dispute is declined.
        </p>
      </>
    ),
  },
  {
    question: "Accepting & Rejecting Jobs",
    answer: (
      <>
        <p>
          Job leads are sent via email, SMS, and your account. Contact details
          appear after purchasing.
        </p>
        <h3 className="font-semibold mt-2">Accepting Jobs</h3>
        <p>
          Click "Accept" to review the price, agree to terms, and purchase the
          lead.
        </p>
        <h3 className="font-semibold mt-2">Rejecting Jobs</h3>
        <p>
          Click "Reject" if the job isn’t suitable, and select a reason. Honest
          feedback improves future job matches.
        </p>
      </>
    ),
  },
  {
    question: "Managing Your Profile & Reviews",
    answer: (
      <>
        <h3 className="font-semibold mt-2">Profile Sections</h3>
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li>Profile Picture: Upload a professional photo or logo.</li>
          <li>
            Business Description: Highlight services, experience,
            qualifications, and guarantees.
          </li>
          <li>Opening Hours: State working hours or emergency availability.</li>
          <li>
            Business Information: Include establishment date, employees, and
            business type.
          </li>
          <li>Qualifications: Upload verified certifications.</li>
          <li>Trades Offered: Add or remove trades to match your skills.</li>
        </ul>
        <h3 className="font-semibold mt-2">Reviews</h3>
        <p>
          Ask customers for feedback, monitor reviews, respond professionally,
          and report inaccurate ones.
        </p>
      </>
    ),
  },
  {
    question: "Payments, Credits & Promotions",
    answer: (
      <>
        <h3 className="font-semibold mt-2">Payments</h3>
        <p>
          Payments are only accepted online via credit/debit card using secure
          SSL connection. We partner with Stripe.
        </p>
        <h3 className="font-semibold mt-2">Credits</h3>
        <p>
          Credits are used to purchase leads. They expire after 6 months.
          Monitor your usage in your account.
        </p>
        <h3 className="font-semibold mt-2">Free Leads & Promotions</h3>
        <p>
          New users get a free lead after verification. Promotions may be issued
          at JobTrackPlus discretion.
        </p>
      </>
    ),
  },
  {
    question: "Account Verification & Security",
    answer: (
      <>
        <ul className="list-disc pl-6 mt-1 space-y-1">
          <li>Email Verification</li>
          <li>Phone Verification</li>
          <li>Proof of Address</li>
          <li>Public Liability Insurance</li>
        </ul>
        <p>
          Upload documents via your account or email them to support for
          verification.
        </p>
      </>
    ),
  },
];

export default function FAQTradespeople() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="border rounded-lg">
            <button
              className="w-full text-left p-4 font-medium flex justify-between items-center hover:bg-gray-100"
              onClick={() => toggle(index)}
            >
              {item.question}
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 border-t bg-gray-50">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
