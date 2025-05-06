"use client";

import Link from "next/link";
import { ReadabilityTable } from "@/components/readability-table";

export default function ReadabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="mb-4 flex gap-4">
          <Link
            href="https://iaccessible.com/wcag-guidelines/"
  
  rel="noopener noreferrer"
            target="_blank"
  className="text-blue-600 hover:underline flex items-center gap-1"
          >
            &larr; Back to Section 508 Guidelines
          </Link>
          <Link
            href="https://iaccessible.com/wcag-guidelines/"
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            PDF Accessibility &rarr;
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Readability Metrics & Text Analysis
        </h1>
        <p className="text-lg text-gray-700 mb-2">
          Understanding readability is crucial for creating accessible content.
          This page provides a comprehensive reference of readability metrics
          and text analysis features that can help evaluate and improve content
          accessibility.
        </p>
      </header>

      <main>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            Why Readability Matters for Accessibility
          </h2>
          <p className="mb-4">
            Readability directly impacts how accessible your content is to users
            with cognitive disabilities, learning disabilities, and those who
            are not native speakers of your content's language. Section 508
            compliance includes ensuring that content is understandable to the
            broadest possible audience.
          </p>
          <p className="mb-4">
            The Web Content Accessibility Guidelines (WCAG) 2.2 includes
            specific success criteria related to readability:
          </p>
          <ul className="list-disc pl-8 mb-4">
            <li className="mb-2">
              <strong>3.1.5 Reading Level</strong>{" "}
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full ml-1">
                AAA
              </span>
              : When text requires reading ability more advanced than the lower
              secondary education level, supplemental content or a version that
              doesn't require reading ability more advanced than the lower
              secondary education level is available.
            </li>
            <li className="mb-2">
              <strong>3.1.3 Unusual Words</strong>{" "}
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full ml-1">
                AAA
              </span>
              : A mechanism is available for identifying specific definitions of
              words or phrases used in an unusual or restricted way.
            </li>
            <li className="mb-2">
              <strong>3.1.4 Abbreviations</strong>{" "}
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full ml-1">
                AAA
              </span>
              : A mechanism for identifying the expanded form or meaning of
              abbreviations is available.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Readability Metrics Reference
          </h2>
          <p className="mb-6">
            The table below provides a comprehensive reference of readability
            metrics and text analysis features that can help evaluate and
            improve content accessibility. Use these metrics to assess and
            enhance the readability of your content.
          </p>
          <ReadabilityTable />
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
