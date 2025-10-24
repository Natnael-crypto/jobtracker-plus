export default function FAQHomeowners() {
  return (
    <div
      className="space-y-6 text-gray-700 leading-relaxed"
      id="faq-homeowners"
    >
      <header className="border-b pb-4">
        <p className="text-sm text-gray-500">
          Reviewed by JobTrackPlus | Last Updated: 19/10/2025
        </p>
      </header>

      {/* Hiring Checklist */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Hiring Checklist</h2>
        <p>
          Hiring a tradesperson for work in your home can feel daunting. Use
          this checklist to guide you before, during, and after the job to stay
          on budget and achieve high standards.
        </p>

        <h3 className="font-semibold">Before Hiring</h3>
        <p>Keep these points in mind:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Tradespeople listed meet our standards and are verified.</li>
          <li>
            View trade profiles for key information: business info, experience,
            qualifications, trades offered, reviews, and insurance status.
          </li>
          <li>
            Additional questions to ask: references, third-party reviews,
            company registration (Ltd), contract details.
          </li>
        </ul>

        <h3 className="font-semibold">During the Job</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Ensure quotes/estimates clearly state what's included.</li>
          <li>Agree on timescales and payment terms.</li>
          <li>Confirm deposits and guarantees/warranties.</li>
          <li>Maintain open communication to avoid misunderstandings.</li>
        </ul>

        <h3 className="font-semibold">Paying for the Work</h3>
        <p>
          Deposits are common, with the remainder due on completion or in agreed
          stages. Balance payment for protection.
        </p>

        <h3 className="font-semibold"> After the Job</h3>
        <p>
          Leave feedback on the tradesperson’s profile to help others and
          strengthen the community.
        </p>
      </section>

      {/* Account and Promotions */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Closing Your JobTrackPlus Account
        </h2>

        <h3 className="font-semibold">Opting Out of Promotions</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Go to My Details and un-tick “Promotional offers”</li>
          <li>
            Contact support to update preferences (usually within 24 hours)
          </li>
        </ul>

        <h3 className="font-semibold">Deleting Your Account</h3>
        <p>
          Contact support to close your account entirely. You can also disable
          alerts/contact but keep the account active via My Details.
        </p>
      </section>

      {/* Complaints */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Complaints Against Tradespeople
        </h2>
        <h3 className="font-semibold">What You Should Do First</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Speak directly with the tradesperson if possible.</li>
          <li>Gather evidence: photos, messages, invoices.</li>
        </ul>

        <h3 className="font-semibold">What We Can Do</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Review complaints and contact the tradesperson for their response.
          </li>
          <li>Remain neutral and aim for fair resolution.</li>
          <li>
            Decisions depend on evidence; serious issues may involve temporary
            suspension or external bodies.
          </li>
        </ul>

        <h3 className="font-semibold">Our Process</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Contact tradespeople within 5 working days.</li>
          <li>Collect evidence and review both sides.</li>
          <li>
            Aim to conclude investigations within 5 working days depending on
            complexity.
          </li>
        </ul>
        <p>
          Contact support with all relevant details if you’ve experienced
          problems.
        </p>
      </section>

      {/* Reviews */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Leaving a Review</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Log in → Jobs page → select tradesperson → submit review & star
            rating.
          </li>
          <li>Keep reviews factual, helpful, and respectful.</li>
          <li>
            Reviews help other homeowners, hold tradespeople accountable, and
            strengthen the community.
          </li>
        </ul>
      </section>

      {/* Contacting a Tradesperson */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Contacting a Tradesperson
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Lost contact details? Check your Jobs page.</li>
          <li>
            JobTrackPlus emails/SMS notify you when a tradesperson shows
            interest.
          </li>
          <li>
            Verify calls by checking your My Jobs page; we only share info with
            trades who accepted your job.
          </li>
        </ul>
      </section>

      {/* Public Liability Insurance */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Public Liability Insurance
        </h2>
        <p>
          Protects against third-party injury or property damage. Check that the
          tradesperson’s insurance is uploaded and verified, or ask to see the
          certificate.
        </p>
      </section>

      {/* Closing Jobs */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Closing Your Job Request</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Close via account → Jobs section → Close Job button</li>
          <li>Close via email/SMS alerts after 48 hours</li>
          <li>
            Automatic closure after 3 tradespeople show interest or inactivity;
            option to extend job posting
          </li>
        </ul>
      </section>

      {/* Account Verification */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Account Verification for Homeowners
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Verify Email: follow verification link.</li>
          <li>Verify Phone: enter 4-digit code via SMS/call.</li>
        </ul>
        <p>
          Verification ensures compliance and smooth communication with
          tradespeople. Contact support if needed.
        </p>
      </section>

      {/* Privacy */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Your Privacy</h2>
        <p>Read our full Privacy Policy online. Key points:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Share details with up to 3 tradespeople per job.</li>
          <li>Receive emails/SMS/phone updates; you can opt out anytime.</li>
          <li>
            Opting out: un-tick promotional offers in My Details or contact
            support.
          </li>
        </ul>
      </section>

      {/* Gas & Electrical Safety */}
      <section>
        <h2 className="text-xl font-semibold mb-2">
          Gas & Electrical Safety: Quick Guide
        </h2>

        <h3 className="font-semibold">Gas Work</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Hire Gas Safe registered tradespeople (UK legal requirement).</li>
          <li>Verify online, via text, or by calling Gas Safe Register.</li>
          <li>
            Ask to see Gas Safe ID card with photo, license number, and work
            types.
          </li>
        </ul>

        <h3 className="font-semibold"> Electrical Work</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Hire electricians registered under a Competent Person Scheme.</li>
          <li>
            Verify registration online or through scheme operators (NICEIC,
            NAPIT, Elecsa).
          </li>
          <li>
            Ensure proper certification or notifications for certain works.
          </li>
        </ul>
        <p>
          Hiring unqualified tradespeople for gas/electrical work can be
          dangerous. Always verify credentials.
        </p>
      </section>

      {/* Posting a Job */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Posting a Job</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Visit Post a Job page → select category → provide details → enter
            contact info.
          </li>
          <li>
            Receive quotes → review profiles → select tradesperson → leave
            feedback after completion.
          </li>
          <li>
            Tips: choose correct category, be detailed, verify contact info,
            stay available, provide extra info if needed.
          </li>
        </ul>

        <h3 className="font-semibold">JobTrackPlus Partner Message</h3>
        <p>
          "Job sent to partner" means your request was forwarded to a trusted
          partner. We share details with one partner per job. Manage, close, and
          review jobs via your account. Contact support if issues arise.
        </p>

        <h3 className="font-semibold">Multiple Jobs</h3>
        <p>
          Submit each job separately by trade. Avoid duplicates. Complex
          projects have specialized categories. Contact support if needed.
        </p>
      </section>
    </div>
  );
}
