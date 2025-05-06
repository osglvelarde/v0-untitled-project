import Link from "next/link";
import { GuidelinesTable } from "@/components/guidelines-table";

export default function AccessibilityGuidelines() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Section 508 & WCAG Accessibility Guidelines
        </h1>
      </header>

      <main>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Understanding Section 508
          </h2>
          <p className="mb-4">
            Section 508 is an amendment to the United States Workforce
            Rehabilitation Act of 1973, requiring federal agencies to develop,
            procure, maintain, and use information and communications technology
            (ICT) that is accessible to people with disabilities.
          </p>
          <p className="mb-4">
            Section 508 standards are now aligned with WCAG 2.0 Level AA success
            criteria, making WCAG compliance essential for Section 508
            compliance.
          </p>
          <Link
            href="https://www.section508.gov/"
            className="text-blue-600 hover:underline font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Official Section 508 Website
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Web Content Accessibility Guidelines (WCAG)
          </h2>
          <p className="mb-4">
            The Web Content Accessibility Guidelines (WCAG) are developed
            through the W3C process in cooperation with individuals and
            organizations around the world, with a goal of providing a single
            shared standard for web content accessibility.
          </p>
          <p className="mb-4">
            WCAG is organized around four principles, often referred to as POUR:
          </p>
          <ul className="list-disc pl-8 mb-4">
            <li className="mb-2">
              <strong>Perceivable</strong> - Information and user interface
              components must be presentable to users in ways they can perceive.
            </li>
            <li className="mb-2">
              <strong>Operable</strong> - User interface components and
              navigation must be operable.
            </li>
            <li className="mb-2">
              <strong>Understandable</strong> - Information and the operation of
              user interface must be understandable.
            </li>
            <li className="mb-2">
              <strong>Robust</strong> - Content must be robust enough that it
              can be interpreted by a wide variety of user agents, including
              assistive technologies.
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="https://www.w3.org/WAI/standards-guidelines/wcag/"
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              W3C WCAG Overview
            </Link>
            <Link
              href="https://www.w3.org/TR/WCAG22/"
              className="text-blue-600 hover:underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              WCAG 2.2 Specifications
            </Link>
            <Link
             href="https://iaccessible.com/readability-guidelines/"
  
  rel="noopener noreferrer"
              target="_blank"
  className="text-blue-600 hover:underline font-medium"
>
  Readability Metrics
            </Link>
            <Link
              href="https://iaccessible.com/pdf-guidelines/"
              target="_blank"
  
  rel="noopener noreferrer"
  className="text-blue-600 hover:underline font-medium"
>
              PDF Accessibility Guidelines
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">WCAG 2.2 Guidelines</h2>
          <p className="mb-6">
            Below is a comprehensive table of WCAG 2.2 guidelines with links to
            the official W3C documentation. Use the filters to narrow down
            guidelines by level, principle, or search by keyword.
          </p>
          <GuidelinesTable />
        </section>
      </main>

      <footer className="mt-16 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          This resource is designed to help developers and content creators
          understand and implement accessibility guidelines. For the most
          up-to-date and authoritative information, always refer to the official
          W3C documentation.
        </p>
      </footer>
    </div>
  );
}
