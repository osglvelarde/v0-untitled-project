import Link from "next/link";
import { PdfUaCoreTable } from "@/components/pdf-ua-core-table";
import { PdfUaErrorsTable } from "@/components/pdf-ua-errors-table";

export default function PdfUaAccessibility() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <header>
        <div className="mb-4 flex flex-col gap-2">
          <Link
            href="/"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            &larr; Back to Section 508 Guidelines
          </Link>
          <Link
            href="/readability"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            &larr; Back to Readability Metrics and Text Analysis
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          PDF/UA (ISO 14289) Accessibility Standards
        </h1>
      </header>

      {/* Introduction */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p>
          <strong>PDF/UA</strong> is the international standard that defines how
          PDF files must be authored so they can be reliably read by assistive
          technologies (AT) such as screen readers, refreshable braille
          displays, and text‑to‑speech engines.
        </p>
        <p>
          Where WCAG focuses on web content, PDF/UA brings equivalent rigor to
          the portable‑document format, ensuring:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            A <strong>complete, machine‑readable structure</strong> (tags,
            metadata, logical order).
          </li>
          <li>
            Programmatic determinability of text, images, form fields, and
            annotations.
          </li>
          <li>
            Removal of technical barriers (e.g., security settings, missing
            Unicode mapping) that block AT.
          </li>
        </ul>
        <p>
          Conformance benefits everyone: users with disabilities gain equal
          access, authors reduce legal risk, and organizations improve search,
          re‑flow, and archival quality of their PDFs.
        </p>
        <Link
          href="https://www.iso.org/standard/64599.html"
          className="text-blue-600 hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          ISO 14289‑1 Specification
        </Link>
      </section>

      {/* Core Terminology */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Core Terminology &amp; Concepts
        </h2>
        <p className="max-w-3xl">
          The table below summarizes essential PDF/UA concepts and why they
          matter for accessibility. Use the search box to find a term quickly.
        </p>
        <PdfUaCoreTable />
      </section>

      {/* Compliance Errors */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Common Compliance Test Errors
        </h2>
        <p className="max-w-3xl">
          These errors are modeled after results from tools like PAC&nbsp;3 and
          Aspose.PDF. Filter by category or severity, or search by keyword to
          understand typical remediation tasks.
        </p>
        <PdfUaErrorsTable />
      </section>
    </div>
  );
}
