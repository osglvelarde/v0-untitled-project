"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Guideline {
  id: string;
  principle: string;
  guideline: string;
  level: "A" | "AA" | "AAA";
  summary: string;
  w3cLink: string;
  version: string;
  tags: string[];
  impacts: string[];
}

export function GuidelinesTable() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const levelFilter = searchParams.get("level") || "";
  const principleFilter = searchParams.get("principle") || "";
  const versionFilter = searchParams.get("version") || "";
  const tagFilter = searchParams.get("tag") || "";
  const impactFilter = searchParams.get("impact") || "";
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 10;

  const [query, setQuery] = useState<string>(searchParams.get("q") || "");
  const [filteredGuidelines, setFilteredGuidelines] = useState<Guideline[]>([]);
  const [paginatedGuidelines, setPaginatedGuidelines] = useState<Guideline[]>(
    []
  );
  const [totalPages, setTotalPages] = useState(1);

  const guidelines: Guideline[] = [
    {
      id: "1.1.1",
      principle: "Perceivable",
      guideline: "Non-text Content",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Provide meaningful text alternatives for all non-text content, including images, icons, and custom controls, so they can be perceived and understood by users relying on screen readers or alternative formats. This supports users who cannot see or interpret visual elements. Decorative images should be hidden from assistive technologies to reduce distractions.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html",
      tags: ["images", "alt text", "icons", "CAPTCHA", "decorative", "media"],
      impacts: [
        "screen reader users",
        "low vision",
        "blind users",
        "cognitive disabilities",
      ],
    },
    // Additional guidelines...
  ];

  const updateFilters = (newFilters: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    if (Object.keys(newFilters).some((key) => key !== "page")) {
      params.set("page", "1");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let filtered = [...guidelines];

    if (query) {
      filtered = filtered.filter((g) =>
        [g.id, g.principle, g.guideline, g.summary].some((field) =>
          field.toLowerCase().includes(query.toLowerCase())
        )
      );
    }

    if (levelFilter && levelFilter !== "all") {
      filtered = filtered.filter((g) => g.level === levelFilter);
    }
    if (principleFilter && principleFilter !== "all") {
      filtered = filtered.filter((g) => g.principle === principleFilter);
    }
    if (versionFilter && versionFilter !== "all") {
      filtered = filtered.filter((g) => g.version === versionFilter);
    }
    if (tagFilter && tagFilter !== "all") {
      filtered = filtered.filter((g) => g.tags.includes(tagFilter));
    }
    if (impactFilter && impactFilter !== "all") {
      filtered = filtered.filter((g) => g.impacts.includes(impactFilter));
    }

    setFilteredGuidelines(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));

    const startIndex = (page - 1) * itemsPerPage;
    setPaginatedGuidelines(
      filtered.slice(startIndex, startIndex + itemsPerPage)
    );
  }, [
    query,
    levelFilter,
    principleFilter,
    versionFilter,
    tagFilter,
    impactFilter,
    page,
    itemsPerPage,
  ]);

  useEffect(() => {
    const qParam = searchParams.get("q") || "";
    if (qParam !== query) {
      setQuery(qParam);
    }
  }, [searchParams]);

  const exportCSV = () => {
    const headers = [
      "ID",
      "Principle",
      "Guideline",
      "Level",
      "Version",
      "Summary",
      "Tags",
      "Impacts",
      "W3C Link",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredGuidelines.map((g) =>
        [
          `"${g.id}"`,
          `"${g.principle}"`,
          `"${g.guideline}"`,
          `"${g.level}"`,
          `"${g.version}"`,
          `"${g.summary.replace(/"/g, '""')}"`,
          `"${g.tags.join(", ")}"`,
          `"${g.impacts.join(", ")}"`,
          `"${g.w3cLink}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "wcag-guidelines.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLevelColor = (level: "A" | "AA" | "AAA") => {
    switch (level) {
      case "A":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "AA":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "AAA":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-md">
        {/* Principle Filter */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="principle-filter">Principle</Label>
          <Select
            value={principleFilter || "all"}
            onValueChange={(value) => updateFilters({ principle: value })}
          >
            <SelectTrigger id="principle-filter">
              <SelectValue placeholder="All Principles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Principles</SelectItem>
              <SelectItem value="Perceivable">Perceivable</SelectItem>
              <SelectItem value="Operable">Operable</SelectItem>
              <SelectItem value="Understandable">Understandable</SelectItem>
              <SelectItem value="Robust">Robust</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Level Filter */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="level-filter">Level</Label>
          <Select
            value={levelFilter || "all"}
            onValueChange={(value) => updateFilters({ level: value })}
          >
            <SelectTrigger id="level-filter">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="A">Level A</SelectItem>
              <SelectItem value="AA">Level AA</SelectItem>
              <SelectItem value="AAA">Level AAA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Version Filter */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="version-filter">Version</Label>
          <Select
            value={versionFilter || "all"}
            onValueChange={(value) => updateFilters({ version: value })}
          >
            <SelectTrigger id="version-filter">
              <SelectValue placeholder="All Versions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Versions</SelectItem>
              <SelectItem value="WCAG 2.0">WCAG 2.0</SelectItem>
              <SelectItem value="WCAG 2.1">WCAG 2.1</SelectItem>
              <SelectItem value="WCAG 2.2">WCAG 2.2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              id="search"
              type="search"
              placeholder="Search guidelines..."
              className="pl-10"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                updateFilters({ q: e.target.value });
              }}
            />
          </div>
        </div>

        {/* Clear Filters and Export Buttons */}
        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              updateFilters({
                principle: "",
                level: "",
                version: "",
                q: "",
              });
              setQuery("");
            }}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Showing {paginatedGuidelines.length} of {filteredGuidelines.length}{" "}
            guidelines
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Success Criterion</TableHead>
              <TableHead>Principle</TableHead>
              <TableHead>Guideline</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Impacts & Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGuidelines.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  {g.id} – {g.guideline}
                </TableCell>
                <TableCell>{g.principle}</TableCell>
                <TableCell>{g.guideline}</TableCell>
                <TableCell>
                  <Badge className={getLevelColor(g.level)}>{g.level}</Badge>
                </TableCell>
                <TableCell>{g.version}</TableCell>
                <TableCell>{g.summary}</TableCell>
                <TableCell>
                  <a
                    href={g.w3cLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    W3C Link
                  </a>
                </TableCell>
                <TableCell className="flex flex-wrap gap-1">
                  {[...g.impacts, ...g.tags].map((item) => (
                    <Badge
                      key={item}
                      variant={g.impacts.includes(item) ? "default" : "outline"}
                      className="text-xs"
                    >
                      {item}
                    </Badge>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateFilters({ page: Math.max(1, page - 1).toString() })
            }
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateFilters({ page: Math.min(totalPages, page + 1).toString() })
            }
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
