"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Guideline {
  id: string
  principle: string
  guideline: string
  level: "A" | "AA" | "AAA"
  summary: string
  w3cLink: string
}

export function GuidelinesTable() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [filteredGuidelines, setFilteredGuidelines] = useState<Guideline[]>([])

  // WCAG 2.2 guidelines data
  const guidelines: Guideline[] = [
    {
      id: "1.1.1",
      principle: "Perceivable",
      guideline: "Non-text Content",
      level: "A",
      summary: "Provide text alternatives for non-text content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
    },
    {
      id: "1.2.1",
      principle: "Perceivable",
      guideline: "Audio-only and Video-only (Prerecorded)",
      level: "A",
      summary: "Provide alternatives for time-based media",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html",
    },
    {
      id: "1.3.1",
      principle: "Perceivable",
      guideline: "Info and Relationships",
      level: "A",
      summary: "Information, structure, and relationships can be programmatically determined",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
    },
    {
      id: "2.1.1",
      principle: "Operable",
      guideline: "Keyboard",
      level: "A",
      summary: "All functionality is available from a keyboard",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
    },
    {
      id: "2.4.1",
      principle: "Operable",
      guideline: "Bypass Blocks",
      level: "A",
      summary: "Provide a way to bypass blocks of content that are repeated on multiple pages",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
    },
    {
      id: "2.5.8",
      principle: "Operable",
      guideline: "Target Size (Minimum)",
      level: "AA",
      summary: "Interactive targets are at least 24 by 24 CSS pixels",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
    },
    {
      id: "3.1.1",
      principle: "Understandable",
      guideline: "Language of Page",
      level: "A",
      summary: "The default human language of the page can be programmatically determined",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
    },
    {
      id: "3.2.1",
      principle: "Understandable",
      guideline: "On Focus",
      level: "A",
      summary: "When a component receives focus, it does not initiate a change of context",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html",
    },
    {
      id: "4.1.1",
      principle: "Robust",
      guideline: "Parsing",
      level: "A",
      summary: "Content is well-formed with complete start and end tags",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/parsing.html",
    },
    {
      id: "4.1.2",
      principle: "Robust",
      guideline: "Name, Role, Value",
      level: "A",
      summary: "For all UI components, the name, role, and value can be programmatically determined",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
    },
  ]

  useEffect(() => {
    if (query) {
      const filtered = guidelines.filter(
        (guideline) =>
          guideline.id.toLowerCase().includes(query.toLowerCase()) ||
          guideline.principle.toLowerCase().includes(query.toLowerCase()) ||
          guideline.guideline.toLowerCase().includes(query.toLowerCase()) ||
          guideline.summary.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredGuidelines(filtered)
    } else {
      setFilteredGuidelines(guidelines)
    }
  }, [query])

  const getLevelColor = (level: "A" | "AA" | "AAA") => {
    switch (level) {
      case "A":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "AA":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "AAA":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return ""
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>WCAG 2.2 Accessibility Guidelines</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Criterion</TableHead>
            <TableHead>Principle</TableHead>
            <TableHead>Guideline</TableHead>
            <TableHead className="w-[80px]">Level</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead className="w-[100px]">Reference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGuidelines.length > 0 ? (
            filteredGuidelines.map((guideline) => (
              <TableRow key={guideline.id}>
                <TableCell className="font-medium">{guideline.id}</TableCell>
                <TableCell>{guideline.principle}</TableCell>
                <TableCell>{guideline.guideline}</TableCell>
                <TableCell>
                  <Badge className={getLevelColor(guideline.level)}>{guideline.level}</Badge>
                </TableCell>
                <TableCell>{guideline.summary}</TableCell>
                <TableCell>
                  <a
                    href={guideline.w3cLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    aria-label={`W3C reference for ${guideline.guideline}`}
                  >
                    W3C Link
                  </a>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No guidelines found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
