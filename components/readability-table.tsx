"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
} from "lucide-react";

// Types
interface ReadabilityMetric {
  Category: string;
  Subcategory: string;
  "Metric/Functionality Name": string;
  "API Variable Name (key)": string;
  Description: string;
  "Interpretation Notes / Guidelines": string;
  [key: string]: string; // Allow indexing with string keys
}

// Accessible badge color generator for subcategories
const getSubcategoryColor = (subcategory: string) => {
  switch (subcategory) {
    case "US-based":
      return "bg-blue-100 text-blue-900";
    case "EU-based":
      return "bg-purple-100 text-purple-900";
    case "Structure":
      return "bg-yellow-100 text-yellow-900";
    case "Sentiment & Tone":
      return "bg-pink-100 text-pink-900";
    case "Audience Reach":
      return "bg-indigo-100 text-indigo-900";
    case "Grammar & Style":
      return "bg-rose-100 text-rose-900";
    case "Vocabulary":
      return "bg-teal-100 text-teal-900";
    case "Style":
      return "bg-orange-100 text-orange-900";
    case "Names & Words":
      return "bg-cyan-100 text-cyan-900";
    case "Content Flags":
      return "bg-red-100 text-red-900";
    case "Readability Algorithms":
      return "bg-green-100 text-green-900";
    case "Basic Text Statistics":
      return "bg-gray-100 text-gray-900";
    case "Issue Highlighting":
      return "bg-fuchsia-100 text-fuchsia-900";
    default:
      return "bg-slate-100 text-slate-900";
  }
};

export function ReadabilityTable() {
  const [metrics, setMetrics] = useState<ReadabilityMetric[]>([]);
  const [filteredMetrics, setFilteredMetrics] = useState<ReadabilityMetric[]>(
    []
  );
  const [paginatedMetrics, setPaginatedMetrics] = useState<ReadabilityMetric[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]); // <-- ADD THIS
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Load the readability metrics data
  useEffect(() => {
    const readabilityData: ReadabilityMetric[] = [
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Flesch Reading Ease",
        "API Variable Name (key)": "flesch_reading_ease",
        Description: "Score 1-100 indicating readability ease.",
        "Interpretation Notes / Guidelines":
          "Higher is easier. Target 70-80 for general adult audience.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Flesch-Kincaid Grade Level",
        "API Variable Name (key)": "flesch_kincaid_grade_level",
        Description: "US grade level needed for comprehension.",
        "Interpretation Notes / Guidelines":
          "Target < 8-10 for general audience.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Gunning Fog Score",
        "API Variable Name (key)": "gunning_fog_score",
        Description:
          "US grade level needed, based on sentence length & complex words.",
        "Interpretation Notes / Guidelines":
          "Target < 8-10. Ideal for business literature.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "SMOG Index",
        "API Variable Name (key)": "smog_index",
        Description: "US grade level based on polysyllabic word count.",
        "Interpretation Notes / Guidelines":
          "Target < 8-10. 'Gold standard' for healthcare.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Coleman-Liau Index",
        "API Variable Name (key)": "coleman_liau_index",
        Description: "US grade level based on letter and sentence counts.",
        "Interpretation Notes / Guidelines":
          "Target < 8-10. Used in education, medical, legal sectors.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Automated Readability Index (ARI)",
        "API Variable Name (key)": "automated_readability_index",
        Description:
          "US grade level based on character/word and words/sentence counts.",
        "Interpretation Notes / Guidelines":
          "Target < 8-10. Good for technical writing.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "FORCAST Grade",
        "API Variable Name (key)": "forcast_grade",
        Description:
          "Grade level estimate, suited for non-prose (forms, tests).",
        "Interpretation Notes / Guidelines":
          "Based on monosyllabic word frequency.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Fry Grade",
        "API Variable Name (key)": "fry_grade",
        Description: "Fry Readability Graph grade level estimate.",
        "Interpretation Notes / Guidelines":
          "Based on sentence length and syllable counts.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Raygor Grade",
        "API Variable Name (key)": "raygor_grade",
        Description: "Raygor Estimate Graph grade level estimate.",
        "Interpretation Notes / Guidelines":
          "Based on sentence length and count of words with 6+ letters.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Lensear Write",
        "API Variable Name (key)": "lensear_write",
        Description:
          'Readability score based on sentence length and "hard words".',
        "Interpretation Notes / Guidelines": "Formula definition varies.",
      },
      {
        Category: "Readability Scores",
        Subcategory: "EU-based",
        "Metric/Functionality Name": "CEFR Level",
        "API Variable Name (key)": "cefr_level",
        Description: "Estimated Common European Framework of Reference level.",
        "Interpretation Notes / Guidelines":
          "A1 (Beginner) to C2 (Proficient).",
      },
      {
        Category: "Readability Scores",
        Subcategory: "EU-based",
        "Metric/Functionality Name": "IELTS Level",
        "API Variable Name (key)": "ielts_level",
        Description: "Estimated IELTS band score level.",
        "Interpretation Notes / Guidelines":
          "Corresponds to IELTS bands (1-9).",
      },
      {
        Category: "Readability Scores",
        Subcategory: "EU-based",
        "Metric/Functionality Name": "CEFR Score",
        "API Variable Name (key)": "cefr_score",
        Description: "Numerical score related to CEFR calculation.",
        "Interpretation Notes / Guidelines":
          "Internal score for CEFR level determination.",
      },
      {
        Category: "Basic Text Statistics",
        Subcategory: "Structure",
        "Metric/Functionality Name": "Paragraph Count",
        "API Variable Name (key)": "paragraph_count",
        Description: "Total number of paragraphs.",
        "Interpretation Notes / Guidelines": "Basic structural count.",
      },
      {
        Category: "Basic Text Statistics",
        Subcategory: "Structure",
        "Metric/Functionality Name": "Sentence Count",
        "API Variable Name (key)": "sentence_count",
        Description: "Total number of sentences.",
        "Interpretation Notes / Guidelines": "Basic structural count.",
      },
      {
        Category: "Basic Text Statistics",
        Subcategory: "Structure",
        "Metric/Functionality Name": "Word Count",
        "API Variable Name (key)": "word_count",
        Description: "Total number of words.",
        "Interpretation Notes / Guidelines": "Basic measure of text length.",
      },
      {
        Category: "Basic Text Statistics",
        Subcategory: "Structure",
        "Metric/Functionality Name": "Unique Word Count",
        "API Variable Name (key)": "unique_word_count",
        Description: "Number of distinct words used.",
        "Interpretation Notes / Guidelines": "Indicator of lexical diversity.",
      },
      {
        Category: "Basic Text Statistics",
        Subcategory: "Structure",
        "Metric/Functionality Name": "Syllable Count",
        "API Variable Name (key)": "syllable_count",
        Description: "Total number of syllables.",
        "Interpretation Notes / Guidelines":
          "Used in formulas like Flesch, Gunning Fog, SMOG.",
      },
      {
        Category: "Text Analysis Features",
        Subcategory: "Sentiment & Tone",
        "Metric/Functionality Name": "Sentiment (Categorical)",
        "API Variable Name (key)": "sentiment",
        Description: "Overall sentiment (e.g., Positive, Negative, Neutral).",
        "Interpretation Notes / Guidelines": "Indicates emotional leaning.",
      },
      {
        Category: "Text Analysis Features",
        Subcategory: "Sentiment & Tone",
        "Metric/Functionality Name": "Tone (Categorical)",
        "API Variable Name (key)": "tone",
        Description: "Detected tone (e.g., Formal, Informal).",
        "Interpretation Notes / Guidelines": "Indicates formality level.",
      },
      {
        Category: "Text Analysis Features",
        Subcategory: "Audience Reach",
        "Metric/Functionality Name": "Reach (Addressable Audience)",
        "API Variable Name (key)": "reach",
        Description: "% of addressable audience who can understand.",
        "Interpretation Notes / Guidelines":
          "Definition of 'addressable audience' may vary.",
      },
      {
        Category: "Text Analysis Features",
        Subcategory: "Audience Reach",
        "Metric/Functionality Name": "Reach (General Public)",
        "API Variable Name (key)": "reach_public",
        Description: "% of general public who can understand.",
        "Interpretation Notes / Guidelines": "Broad measure of accessibility.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Grammar & Style",
        "Metric/Functionality Name": "Spelling Error Count",
        "API Variable Name (key)": "spelling_error_count",
        Description: "Number of potential spelling errors.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Grammar & Style",
        "Metric/Functionality Name": "Grammar Error Count",
        "API Variable Name (key)": "grammar_error_count",
        Description: "Number of potential grammar errors.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Grammar & Style",
        "Metric/Functionality Name": "Passive Voice Count",
        "API Variable Name (key)": "passive_voice_count",
        Description: "Number of possible passive voice instances.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Profanity Detection",
        Subcategory: "Content Flags",
        "Metric/Functionality Name": "Profanity Count (Highlight)",
        "API Variable Name (key)": "profanity_count",
        Description: "Number of possible profanities.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting. Related to /profanity/ endpoint.",
      },
      {
        Category: "Readability Algorithms",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Spache Readability Score",
        "API Variable Name (key)": "spache_readability_score",
        Description: "US grade level for primary grades (up to 4th).",
        "Interpretation Notes / Guidelines":
          "Based on sentence length & words not on Spache list. Requires spache_difficult_words.",
      },
      {
        Category: "Readability Algorithms",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Powers-Sumner-Kearl Score",
        "API Variable Name (key)": "powers_sumner_kearl_score",
        Description: "Grade level estimate for children's literature.",
        "Interpretation Notes / Guidelines":
          "Based on sentence length and syllable count.",
      },
      {
        Category: "Readability Algorithms",
        Subcategory: "International",
        "Metric/Functionality Name": "LIX Score",
        "API Variable Name (key)": "lix_score",
        Description: "Läsbarhetsindex score (Swedish formula).",
        "Interpretation Notes / Guidelines":
          "Lower is easier (typical range 20–60). Based on sentence length & long words.",
      },
      {
        Category: "Readability Algorithms",
        Subcategory: "International",
        "Metric/Functionality Name": "RIX Score",
        "API Variable Name (key)": "rix_score",
        Description: "Simplified LIX, often for children's literature.",
        "Interpretation Notes / Guidelines": "Indicates difficulty level.",
      },
      {
        Category: "Readability Algorithms",
        Subcategory: "US-based",
        "Metric/Functionality Name": "Dale-Chall Readability Score",
        "API Variable Name (key)": "dale_chall_readability_score",
        Description:
          "US grade level based on sentence length & words not on Dale-Chall list.",
        "Interpretation Notes / Guidelines":
          "Accurate for text above 4th grade. Requires dale_chall_difficult_words.",
      },
      {
        Category: "Readability Algorithms",
        Subcategory: "Deprecated",
        "Metric/Functionality Name": "Average Grade Level (Deprecated)",
        "API Variable Name (key)": "average_grade_level",
        Description: "Deprecated average of various grade scores.",
        "Interpretation Notes / Guidelines": "Not recommended for new use.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Structure",
        "Metric/Functionality Name": "Very Long Sentence Count",
        "API Variable Name (key)": "very_long_sentence_count",
        Description: "Number of sentences > 30 syllables.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Structure",
        "Metric/Functionality Name": "Long Sentence Count",
        "API Variable Name (key)": "long_sentence_count",
        Description: "Number of sentences > 20 syllables.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Vocabulary",
        "Metric/Functionality Name": "Long Word Count",
        "API Variable Name (key)": "long_word_count",
        Description: "Number of words > 12 letters.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Vocabulary",
        "Metric/Functionality Name": "High Syllable Word Count",
        "API Variable Name (key)": "high_syllable_word_count",
        Description: 'Number of words > 4 syllables ("hard words").',
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Style",
        "Metric/Functionality Name": "Cliché Count",
        "API Variable Name (key)": "cliche_count",
        Description: "Number of potential clichés.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Style",
        "Metric/Functionality Name": "Adverb Count (Highlight)",
        "API Variable Name (key)": "adverb_count",
        Description: "Number of possible adverbs flagged (potential overuse).",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting. Differs from composition_adverb_count.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Style",
        "Metric/Functionality Name": "Hedge Word Count",
        "API Variable Name (key)": "hedge_count",
        Description: "Number of possible hedge words (e.g., 'maybe', 'seems').",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Style",
        "Metric/Functionality Name": "Transition Word Count",
        "API Variable Name (key)": "transition_count",
        Description: "Number of possible transition words.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Style",
        "Metric/Functionality Name": "Buzzwords Count",
        "API Variable Name (key)": "buzzwords_count",
        Description: "Number of possible buzzwords.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Names & Words",
        "Metric/Functionality Name": "Names Count",
        "API Variable Name (key)": "names_count",
        Description: "Number of possible proper names flagged.",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting. Differs from composition_proper_noun_count.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Style",
        "Metric/Functionality Name": "Lazy Word Count",
        "API Variable Name (key)": "lazy_count",
        Description: 'Number of possible "lazy" or weak words.',
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Issue Highlighting",
        Subcategory: "Vocabulary",
        "Metric/Functionality Name": "Stopwords Count",
        "API Variable Name (key)": "stopwords_count",
        Description:
          "Number of possible stop words flagged (context-dependent).",
        "Interpretation Notes / Guidelines":
          "Count of issues identified by highlighting.",
      },
      {
        Category: "Profanity Detection",
        Subcategory: "Content Flags",
        "Metric/Functionality Name": "(Profanity Response)",
        "API Variable Name (key)": "(Not specified)",
        Description: "Response likely includes counts or highlighted text.",
        "Interpretation Notes / Guidelines":
          "Documentation gap; response format needs confirmation. Sensitivity set by level param.",
      },
    ];

    setMetrics(readabilityData);

    // Extract unique categories and subcategories
    const uniqueCategories = Array.from(
      new Set(readabilityData.map((item) => item.Category))
    );
    const uniqueSubcategories = Array.from(
      new Set(readabilityData.map((item) => item.Subcategory))
    );

    setCategories(uniqueCategories);
    setSubcategories(uniqueSubcategories);
  }, []);
  useEffect(() => {
    let filtered = [...metrics];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((metric) =>
        [
          metric["Metric/Functionality Name"],
          metric.Description,
          metric["API Variable Name (key)"],
          metric["Interpretation Notes / Guidelines"],
        ].some((field) => field.toLowerCase().includes(query))
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((m) => m.Category === categoryFilter);
    }
    if (subcategoryFilter !== "all") {
      filtered = filtered.filter((m) => m.Subcategory === subcategoryFilter);
    }

    setFilteredMetrics(filtered);
    setPage(1);
  }, [metrics, searchQuery, categoryFilter, subcategoryFilter]);

  // Pagination logic
  useEffect(() => {
    const start = (page - 1) * itemsPerPage;
    setPaginatedMetrics(filteredMetrics.slice(start, start + itemsPerPage));
  }, [filteredMetrics, page]);

  const totalPages = Math.ceil(filteredMetrics.length / itemsPerPage);

  const exportCSV = () => {
    const headers = [
      "Category",
      "Subcategory",
      "Metric/Functionality Name",
      "API Variable Name (key)",
      "Description",
      "Interpretation Notes / Guidelines",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredMetrics.map((metric) =>
        headers
          .map((header) => {
            const value = metric[header] || "";
            // Escape double quotes by doubling them, and wrap field in quotes
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "readability-metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 p-4 bg-gray-50 rounded-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="category-filter">Category</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger id="category-filter" className="w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="subcategory-filter">Subcategory</Label>
          <Select
            value={subcategoryFilter}
            onValueChange={setSubcategoryFilter}
          >
            <SelectTrigger id="subcategory-filter" className="w-[200px]">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {subcategories.map((subcat) => (
                <SelectItem key={subcat} value={subcat}>
                  {subcat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              id="search"
              type="search"
              placeholder="Search metrics..."
              className="pl-10 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Clear and Export Buttons - Moved inside the filter bar */}
        <div className="flex items-end gap-2 md:ml-auto">
          <Button
            variant="outline"
            onClick={() => {
              setCategoryFilter("all");
              setSubcategoryFilter("all");
              setSearchQuery("");
            }}
            className="flex items-center gap-2 mt-auto"
          >
            <Filter className="h-4 w-4" /> Clear Filters
          </Button>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="flex items-center gap-2 mt-auto"
            disabled={filteredMetrics.length === 0}
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
            Showing {paginatedMetrics.length} of {filteredMetrics.length}{" "}
            metrics
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Metric Name</TableHead>{" "}
              {/* Added min-width */}
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[240px]">Interpretation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMetrics.length > 0 ? (
              paginatedMetrics.map((metric, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium min-w-[200px]">
                    {" "}
                    {/* Added min-width */}
                    {metric["Metric/Functionality Name"]}
                  </TableCell>
                  <TableCell>{metric.Category}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${getSubcategoryColor(
                        metric.Subcategory
                      )} hover:bg-inherit hover:text-inherit transition-none`}
                    >
                      {metric.Subcategory}
                    </Badge>
                  </TableCell>
                  <TableCell>{metric.Description}</TableCell>
                  <TableCell>
                    {metric["Interpretation Notes / Guidelines"]}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No metrics found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === page ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="text-sm text-gray-600">
        Showing {(page - 1) * itemsPerPage + 1} to{" "}
        {Math.min(page * itemsPerPage, filteredMetrics.length)} of{" "}
        {filteredMetrics.length} metrics
      </div>
    </div>
  );
}
