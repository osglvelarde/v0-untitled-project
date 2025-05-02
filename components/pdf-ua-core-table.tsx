"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// ---- Data -------------------------------------------------------------
interface CoreTerm {
  term: string;
  description: string;
  importance: string;
}

const coreTerminology: CoreTerm[] = [
  {
    term: "PDF/UA (ISO 14289)",
    description:
      "The ISO standard for universally accessible PDF files; builds on ISO 32000 (PDF 2.0).",
    importance:
      "Establishes the baseline rules authors must meet to guarantee compatibility with AT.",
  },
  {
    term: "Tagged PDF",
    description:
      "A PDF that contains a complete logical structure tree (/StructTreeRoot) with element tags (e.g., <P>, <H1>).",
    importance:
      "Tags expose document semantics, enabling screen readers to navigate headings, paragraphs, tables, etc.",
  },
  {
    term: "Semantic Structure",
    description: "The set of meaningful tags that describe each content element’s role.",
    importance:
      "Provides context to AT, allowing correct pronunciation, navigation, and re‑flow on small screens.",
  },
  {
    term: "Logical Reading Order",
    description: "The sequence in which tags appear in the structure tree.",
    importance:
      "Ensures content is read in the intended order, independent of visual layout or columns.",
  },
  {
    term: "Alternative Text (Alt Text)",
    description: "Textual descriptions for non‑text content (e.g., images, figures).",
    importance: "Conveys essential information to users who cannot see images.",
  },
  {
    term: "Artifacts",
    description: "Visual objects (page numbers, decorative lines) marked so AT ignores them.",
    importance: "Prevents distraction and preserves meaningful reading order.",
  },
  {
    term: "Metadata (Title & Language)",
    description: "XMP metadata declaring document title (dc:title) and primary language (dc:language).",
    importance: "Allows AT to announce the title correctly and use the right pronunciation rules.",
  },
  {
    term: "Font Embedding",
    description: "Inclusion of complete font programs within the PDF.",
    importance: "Guarantees text renders and maps to Unicode consistently on every device.",
  },
  {
    term: "Unicode Mapping",
    description: "Association of every glyph to a valid Unicode code point.",
    importance: "Enables accurate text extraction, search, and speech output.",
  },
  {
    term: "Color Contrast (WCAG 2.x)",
    description: "Adequate luminance contrast between text and background.",
    importance:
      "Essential for low‑vision users; PDF/UA refers to WCAG contrast ratios (4.5 : 1 or 3 : 1 for large text).",
  },
];

// ---- Component --------------------------------------------------------
export function PdfUaCoreTable() {
  const [query, setQuery] = useState<string>("");
  const [rows, setRows] = useState<CoreTerm[]>(coreTerminology);

  useEffect(() => {
    if (!query) return setRows(coreTerminology);

    const lower = query.toLowerCase();
    setRows(
      coreTerminology.filter((t) =>
        (t.term + t.description + t.importance).toLowerCase().includes(lower)
      )
    );
  }, [query]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search terminology…"
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search PDF/UA terminology"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Term / Guideline</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Importance for Accessibility</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.term} className="hover:bg-gray-50/50">
                <TableCell className="font-medium whitespace-nowrap">
                  {row.term}
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.importance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-gray-500">
        Showing {rows.length} of {coreTerminology.length} terminology entries
      </p>
    </div>
  );
}
