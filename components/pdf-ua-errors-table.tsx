"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Download,
} from "lucide-react";
import { Label } from "@/components/ui/label";

// -----------------------------
// Types and Constants
// -----------------------------
interface ErrorRow {
  category: string;
  code: string;
  severity: "Error" | "Warning" | "Need manual";
  message: string;
  guideline?: string;
  fixHint?: string;
  exampleLink?: string;
}
const getCategoryBadgeColor = (category: string) => {
  switch (category) {
    case "General":
      return "bg-slate-100 text-slate-900";
    case "Text":
      return "bg-yellow-100 text-yellow-900";
    case "Fonts":
      return "bg-teal-100 text-teal-900";
    case "Graphics":
      return "bg-indigo-100 text-indigo-900";
    case "Headings":
      return "bg-orange-100 text-orange-900";
    case "Tables":
      return "bg-pink-100 text-pink-900";
    case "Lists":
      return "bg-purple-100 text-purple-900";
    case "Notes and References":
      return "bg-green-100 text-green-900";
    case "Optional Content":
      return "bg-red-100 text-red-900";
    case "Embedded Files":
      return "bg-cyan-100 text-cyan-900";
    case "Digital Signatures":
      return "bg-blue-100 text-blue-900";
    case "Non-interactive Forms":
      return "bg-rose-100 text-rose-900";
    case "XFA":
      return "bg-fuchsia-100 text-fuchsia-900";
    case "Security":
      return "bg-gray-100 text-gray-900";
    case "Navigation":
      return "bg-lime-100 text-lime-900";
    case "Annotations":
      return "bg-amber-100 text-amber-900";
    case "Actions":
      return "bg-violet-100 text-violet-900";
    case "XObjects":
      return "bg-emerald-100 text-emerald-900";
    default:
      return "bg-slate-200 text-slate-900";
  }
};

const rawErrors: ErrorRow[] = [
  {
    category: "General",
    code: "5:1",
    severity: "Error",
    message: "PDF/UA identifier missing",
    guideline: "PDF/UA Part 7.1",
    fixHint: "Include the correct PDF/UA identifier in the document metadata.",
    exampleLink: "https://www.pdfa.org/resource/tagged-pdf-best-practices/",
  },
  {
    category: "General",
    code: "7.1:1.1 (14.8.1)",
    severity: "Error",
    message: "Document is not marked as tagged",
    guideline: "14.8.1",
    fixHint:
      "Ensure the PDF is exported with 'Tagged PDF' enabled from your authoring tool.",
  },
  {
    category: "General",
    code: "7.1:1.1 (14.8)",
    severity: "Error",
    message: "[OBJECT_NAME] object not tagged",
    guideline: "14.8",
    fixHint: "Tag all meaningful objects in the document structure tree.",
  },
  {
    category: "General",
    code: "7.1:6.1",
    severity: "Error",
    message: "XMP metadata missing in document",
    guideline: "14.3",
    fixHint: "Embed metadata using XMP including title, author, and language.",
  },
  {
    category: "Text",
    code: "7.2:2 (14.8.2.4.2)",
    severity: "Error",
    message: "Characters cannot be mapped to Unicode",
    guideline: "14.8.2.4.2",
    fixHint: "Ensure all fonts are embedded and support Unicode mapping.",
  },
  {
    category: "Text",
    code: "7.2:3.1 (14.9.2.2)",
    severity: "Error",
    message: "Natural language of text object undetermined",
    guideline: "14.9.2.2",
    fixHint:
      "Declare the primary language of the content using /Lang attribute.",
  },
  {
    category: "Fonts",
    code: "7.21.3.2",
    severity: "Error",
    message: "CIDToGIDMap not embedded / incomplete for font ‘[FONT_NAME]’",
    guideline: "7.21.3.2",
    fixHint: "Embed the full CIDToGIDMap when using CID fonts.",
  },
  {
    category: "Fonts",
    code: "7.21.4.2",
    severity: "Error",
    message: "CIDSet missing / incomplete for font ‘[FONT_NAME]’",
    guideline: "7.21.4.2",
    fixHint: "Ensure CIDSet is correctly defined to describe used glyphs.",
  },
  {
    category: "General",
    code: "7.1:7.2 (12.2)",
    severity: "Error",
    message: "‘DisplayDocTitle’ entry is not set",
    guideline: "12.2",
    fixHint:
      "In the viewer preferences dictionary, set /DisplayDocTitle to true to show document title in viewer.",
  },
  {
    category: "Text",
    code: "7.2:3.1 (14.9.2.2)",
    severity: "Error",
    message: "Natural language of text object undetermined",
    guideline: "14.9.2.2",
    fixHint:
      "Declare the primary language using the /Lang attribute on the structure element.",
  },
  {
    category: "Text",
    code: "7.2:3.2 (14.9.2.2)",
    severity: "Error",
    message: "Natural language of alternative text undetermined",
    guideline: "14.9.2.2",
    fixHint:
      "Ensure alt text has an associated language declaration or inherits from the document.",
  },
  {
    category: "Text",
    code: "7.2:3.3 (14.9.2.2)",
    severity: "Error",
    message: "Natural language of actual text undetermined",
    guideline: "14.9.2.2",
    fixHint:
      "Use the /Lang attribute to identify the language of ActualText content.",
  },
  {
    category: "Text",
    code: "7.2:3.4 (14.9.2.2)",
    severity: "Error",
    message: "Natural language of expansion text undetermined",
    guideline: "14.9.2.2",
    fixHint:
      "Declare language for any /E entry (expansion text) used in tagged PDF.",
  },
  {
    category: "Text",
    code: "7.2:4 (14.9.4)",
    severity: "Error",
    message: "Stretchable character not tagged using ActualText",
    guideline: "14.9.4",
    fixHint:
      "Tag decorative or stretchable characters using the ActualText attribute.",
  },
  {
    category: "Fonts",
    code: "7.21.4.2",
    severity: "Error",
    message: "CIDSet missing / incomplete for font ‘[FONT_NAME]’",
    guideline: "7.21.4.2",
    fixHint:
      "Define CIDSet correctly to describe all glyphs used from the CIDFont.",
  },
  {
    category: "Fonts",
    code: "7.21.6",
    severity: "Error",
    message: "Non-symbolic TrueType font ‘[FONT_NAME]’ has no cmap entries",
    guideline: "7.21.6",
    fixHint:
      "Ensure TrueType fonts include correct cmap entries for Unicode mapping.",
  },
  {
    category: "Fonts",
    code: "7.21.6",
    severity: "Error",
    message:
      "Encoding entry prohibited for symbolic TrueType font ‘[FONT_NAME]’",
    guideline: "7.21.6",
    fixHint:
      "Remove any Encoding dictionary when using symbolic TrueType fonts.",
  },
  {
    category: "Fonts",
    code: "7.21.6",
    severity: "Error",
    message: "Incorrect encoding used for TrueType font ‘[FONT_NAME]’",
    guideline: "7.21.6",
    fixHint:
      "Use WinAnsiEncoding or appropriate encoding that maps correctly to Unicode.",
  },
  {
    category: "Fonts",
    code: "7.21.6",
    severity: "Error",
    message:
      "Incorrect “Differences” array for non-symbolic TrueType font ‘[FONT_NAME]’",
    guideline: "7.21.6",
    fixHint:
      "Ensure the Differences array does not override standard Unicode mappings.",
  },
  {
    category: "Graphics",
    code: "7.3:1 (14.8.4.5)",
    severity: "Error",
    message: "‘[ELEMENT_NAME]’ element on page with no bounding box",
    guideline: "14.8.4.5",
    fixHint: "Ensure each graphic element has a bounding box defined.",
  },
  {
    category: "Graphics",
    code: "7.3:2",
    severity: "Error",
    message: "Alternative text missing for ‘[ELEMENT_NAME]’",
    guideline: "14.8.4.5",
    fixHint: "Provide alt text for all images and graphical elements.",
  },
  {
    category: "Graphics",
    code: "7.3:3",
    severity: "Error",
    message: "Caption accompanying figure missing",
    guideline: "14.8.4.5",
    fixHint: "Include a caption or descriptive text near the figure.",
  },
  {
    category: "Graphics",
    code: "7.3:4 (14.8.4.5)",
    severity: "Error",
    message: "Graphics object appears between the BT and ET operators",
    guideline: "14.8.4.5",
    fixHint:
      "Ensure content operators like BT/ET encapsulate only text, not graphics.",
  },
  {
    category: "Headings",
    code: "7.4.2:1",
    severity: "Error",
    message: "The first heading is not on the first level",
    guideline: "7.4.2",
    fixHint:
      "Start the document with a level-1 heading for semantic structure.",
  },
  {
    category: "Headings",
    code: "7.4.2:2",
    severity: "Error",
    message: "Numbered heading skips one or more heading levels",
    guideline: "7.4.2",
    fixHint:
      "Do not skip heading levels (e.g., go from H1 to H3); maintain logical hierarchy.",
  },
  {
    category: "Headings",
    code: "7.4.4:1",
    severity: "Error",
    message: "‘H’ and ‘Hn’ structure elements found",
    guideline: "7.4.4",
    fixHint:
      "Use consistent heading tags (either <H> or <H1> to <H6>, but not mixed).",
  },
  {
    category: "Headings",
    code: "7.4.4:2",
    severity: "Error",
    message:
      "More than one ‘H’ structure element inside the parent structure element",
    guideline: "7.4.4",
    fixHint: "Avoid placing multiple headings in the same structural parent.",
  },
  {
    category: "Tables",
    code: "7.5:1",
    severity: "Warning",
    message: "Irregular table row",
    guideline: "7.5",
    fixHint: "Ensure table rows have consistent column counts and structure.",
  },
  {
    category: "Tables",
    code: "7.5:2",
    severity: "Error",
    message: "Table header cell has no associated subcells",
    guideline: "7.5",
    fixHint:
      "Define relationships between table headers and cells using Scope or ID/Headers.",
  },
  {
    category: "Tables",
    code: "7.5:3.1",
    severity: "Warning",
    message: "Table headers missing",
    guideline: "7.5",
    fixHint: "Include <TH> or header tags to mark table headers appropriately.",
  },
  {
    category: "Tables",
    code: "7.5:3.2",
    severity: "Warning",
    message: "Table summary missing",
    guideline: "7.5",
    fixHint:
      "Provide a summary or description for complex tables to support screen readers.",
  },
  {
    category: "Lists",
    code: "7.6:1",
    severity: "Error",
    message: "‘LI’ structure element must be a child of ‘L’ element",
    guideline: "7.6",
    fixHint: "Ensure list items are nested inside a List structure.",
  },
  {
    category: "Lists",
    code: "7.6:2",
    severity: "Error",
    message:
      "‘Lbl’ and ‘LBody’ structure element must be children of ‘LI’ element",
    guideline: "7.6",
    fixHint:
      "Group label and body of list items properly within an LI container.",
  },
  {
    category: "Notes and References",
    code: "7.9:2.1",
    severity: "Error",
    message: "ID missing in ‘Note’ structure element",
    guideline: "7.9",
    fixHint: "Add a unique ID to each Note structure element.",
  },
  {
    category: "Notes and References",
    code: "7.9:2.2",
    severity: "Error",
    message: "ID entry in ‘Note’ structure element is not unique",
    guideline: "7.9",
    fixHint: "Ensure all Note IDs are distinct across the document.",
  },
  {
    category: "Optional Content",
    code: "7.10:1",
    severity: "Error",
    message: "‘Name’ missing in optional content configuration dictionary",
    guideline: "7.10",
    fixHint:
      "Set the /Name entry in the optional content configuration dictionary.",
  },
  {
    category: "Optional Content",
    code: "7.10:2",
    severity: "Error",
    message: "Optional content configuration dictionary contains ‘AS’ key",
    guideline: "7.10",
    fixHint:
      "Avoid using the /AS (Application Settings) entry for PDF/UA conformance.",
  },
  {
    category: "Embedded Files",
    code: "7.11:1",
    severity: "Error",
    message: "‘F’ or ‘UF’ key missing in file specification",
    guideline: "7.11",
    fixHint: "Specify file name using /F (ASCII) or /UF (Unicode) key.",
  },
  {
    category: "Embedded Files",
    code: "7.11:2",
    severity: "Warning",
    message: "‘Desc’ key missing in file specification",
    guideline: "7.11",
    fixHint: "Add a /Desc entry to describe the embedded file.",
  },
  {
    category: "Digital Signatures",
    code: "7.13:1",
    severity: "Error",
    message:
      "Signature form field ‘[FIELD_NAME]’ does not conform to the specification",
    guideline: "7.13",
    fixHint:
      "Ensure signature fields comply with ISO 32000 and are properly tagged and structured.",
  },
  {
    category: "Digital Signatures",
    code: "7.13:2.1",
    severity: "Error",
    message:
      "Natural language of an alternate name of a form field ‘[FIELD_NAME]’ cannot be determined",
    guideline: "7.13",
    fixHint:
      "Add the /Lang attribute for alternate names of form fields to identify language.",
  },
  {
    category: "Digital Signatures",
    code: "7.13:2.2",
    severity: "Error",
    message: "Alternate field name entry missing in form field ‘[FIELD_NAME]’",
    guideline: "7.13",
    fixHint:
      "Include an /TU entry (alternate field name) in the form field dictionary.",
  },
  {
    category: "Non-interactive Forms",
    code: "7.14:1",
    severity: "Error",
    message: "‘PrintField’ attribute missing in non-interactive form item",
    guideline: "7.14",
    fixHint:
      "Include the /PrintField attribute for non-interactive form items to support printing.",
  },
  {
    category: "XFA",
    code: "7.15:1",
    severity: "Error",
    message: "PDF contains a dynamic XFA form",
    guideline: "7.15",
    fixHint:
      "Avoid using dynamic XFA. Convert forms to AcroForms and ensure proper tagging.",
  },
  {
    category: "Security",
    code: "7.16:1 (7.6.3.2)",
    severity: "Error",
    message:
      "Security settings block assistive technologies from accessing document’s content",
    guideline: "7.6.3.2",
    fixHint:
      "Ensure document permissions allow accessibility (e.g., content copying for screen readers).",
  },
  {
    category: "Security",
    code: "7.16:2 (7.6.3.2)",
    severity: "Error",
    message: "Conversion is not allowed by permission restrictions",
    guideline: "7.6.3.2",
    fixHint: "Remove restrictions that block content extraction or conversion.",
  },
  {
    category: "Navigation",
    code: "7.17:1",
    severity: "Error",
    message: "Document Outlines Error",
    guideline: "7.17",
    fixHint:
      "Create and structure outlines (bookmarks) logically to reflect document hierarchy.",
  },
  {
    category: "Navigation",
    code: "7.17:2",
    severity: "Error",
    message: "Natural language of outlines can be determined",
    guideline: "7.17",
    fixHint:
      "Define /Lang for each outline item or inherit from parent document.",
  },
  {
    category: "Navigation",
    code: "7.17:3",
    severity: "Need manual",
    message: "Semantically appropriate Page Labels",
    guideline: "7.17",
    fixHint:
      "Check that page labels (e.g., Roman numerals) reflect logical order for navigation.",
  },
  {
    category: "Annotations",
    code: "7.18.1:1",
    severity: "Error",
    message: "Natural language of Contents entry cannot be determined",
    guideline: "7.18.1",
    fixHint:
      "Use the /Lang attribute to specify the language of the Contents entry.",
  },
  {
    category: "Annotations",
    code: "7.18.1:2",
    severity: "Error",
    message: "Alternative description missing for an annotation",
    guideline: "7.18.1",
    fixHint:
      "Provide an /Alt entry for each annotation to describe its purpose.",
  },
  {
    category: "Annotations",
    code: "7.18.1:3",
    severity: "Error",
    message: "Annotation is not nested inside an ‘Annot’ structure element",
    guideline: "7.18.1",
    fixHint:
      "Ensure annotations are associated with a parent 'Annot' structure element.",
  },
  {
    category: "Annotations",
    code: "7.18.2:1",
    severity: "Error",
    message:
      "An annotation with subtype undefined in ISO 32000 does not meet 7.18.1",
    guideline: "7.18.2",
    fixHint: "Only use annotation subtypes defined in ISO 32000.",
  },
  {
    category: "Annotations",
    code: "7.18.2:2",
    severity: "Error",
    message: "An annotation of subtype TrapNet exists",
    guideline: "7.18.2",
    fixHint:
      "Remove or replace annotations of type TrapNet to ensure conformance.",
  },
  {
    category: "Annotations",
    code: "7.18.3:1",
    severity: "Error",
    message:
      "Tab order entry in page with annotations not set to ‘S’ (Structure)",
    guideline: "7.18.3",
    fixHint:
      "Set /Tabs to 'S' in the page dictionary to enable structure-based navigation.",
  },
  {
    category: "Annotations",
    code: "7.18.4:1",
    severity: "Error",
    message: "‘Widget’ annotation not nested inside a ‘Form’ structure element",
    guideline: "7.18.4",
    fixHint: "Nest all Widget annotations within a Form structure element.",
  },
  {
    category: "Annotations",
    code: "7.18.5:1",
    severity: "Error",
    message:
      "‘Link’ annotation is not nested inside a ‘Link’ structure element",
    guideline: "7.18.5",
    fixHint: "Link annotations must be children of a 'Link' structure element.",
  },
  {
    category: "Annotations",
    code: "7.18.6.2:1",
    severity: "Error",
    message: "CT key is missing from the media clip data dictionary",
    guideline: "7.18.6.2",
    fixHint:
      "Include the /CT (content type) key in all media clip data dictionaries.",
  },
  {
    category: "Annotations",
    code: "7.18.6.2:2",
    severity: "Error",
    message: "Alt key is missing from the media clip data dictionary",
    guideline: "7.18.6.2",
    fixHint:
      "Include an /Alt entry to provide a description of the media clip.",
  },
  {
    category: "Annotations",
    code: "7.18.7:1",
    severity: "Error",
    message:
      "File attachment annotation. ‘F’ or ‘UF’ key missing in file specification",
    guideline: "7.18.7",
    fixHint:
      "Include either the /F (ASCII) or /UF (Unicode) key to specify file name in attachment.",
  },
  {
    category: "Annotations",
    code: "7.18.7:2",
    severity: "Warning",
    message:
      "File attachment annotation. ‘Desc’ key missing in file specification",
    guideline: "7.18.7",
    fixHint:
      "Add a /Desc entry to describe the attached file's content or purpose.",
  },
  {
    category: "Annotations",
    code: "7.18.8:1",
    severity: "Error",
    message: "A PrinterMark annotation is included in logical structure",
    guideline: "7.18.8",
    fixHint:
      "Exclude PrinterMark annotations from the structure tree; mark them as artifacts.",
  },
  {
    category: "Annotations",
    code: "7.18.8:2",
    severity: "Error",
    message:
      "The appearance stream of a PrinterMark annotation is not marked as Artifact",
    guideline: "7.18.8",
    fixHint: "Mark appearance streams of PrinterMark annotations as artifacts.",
  },
  {
    category: "Actions",
    code: "7.19:1",
    severity: "Need manual",
    message:
      "Actions were found. Need to check actions according to specification PDF/UA manually",
    guideline: "7.19",
    fixHint:
      "Manually inspect document actions (e.g., JavaScript, submit forms) for compliance.",
  },
  {
    category: "XObjects",
    code: "7.20:1",
    severity: "Error",
    message: "Reference XObject shall not be used in conforming PDF/UA file",
    guideline: "7.20",
    fixHint:
      "Avoid usage of reference XObjects as they are not supported in PDF/UA.",
  },
  {
    category: "XObjects",
    code: "7.20:2",
    severity: "Error",
    message:
      "The content of Form XObject isn’t incorporated into structure elements",
    guideline: "7.20",
    fixHint:
      "Ensure all content from Form XObjects is represented in the structure tree.",
  },
  {
    category: "Text",
    code: "7.2:1",
    severity: "Need manual",
    message: "Logical Reading Order",
    guideline: "7.2",
    fixHint:
      "Verify the order of tags matches visual and logical reading sequence.",
  },
  {
    category: "General",
    code: "7.1:5",
    severity: "Need manual",
    message: "Color contrast",
    guideline: "7.1",
    fixHint:
      "Use contrast ratio tools to ensure text meets minimum contrast thresholds (4.5:1).",
  },
  {
    category: "General",
    code: "7.1:9.1 (14.7)",
    severity: "Error",
    message: "‘StructParents’ key missing in page",
    guideline: "14.7",
    fixHint:
      "Add /StructParents to each page object that includes tagged content.",
  },
  {
    category: "General",
    code: "7.1:2.1",
    severity: "Warning",
    message: "Structure tree missing",
    guideline: "14.8",
    fixHint:
      "Ensure the PDF contains a /StructTreeRoot entry to define logical structure.",
  },
  {
    category: "General",
    code: "7.1:2.2",
    severity: "Warning",
    message: "‘Document’ structure element found which is not a root element",
    guideline: "14.8.2.2",
    fixHint:
      "Use the 'Document' element only as the root of the structure tree.",
  },
  {
    category: "General",
    code: "7.1:2.3",
    severity: "Warning",
    message: "‘[ELEMENT_NAME]’ structure element used as root element",
    guideline: "14.8.2.2",
    fixHint: "Use only 'Document' as the root structure element.",
  },
  {
    category: "General",
    code: "7.1:2.4.1",
    severity: "Warning",
    message:
      "Possibly inappropriate use of a ‘[ELEMENT_NAME]’ structure element",
    guideline: "14.8.2.2",
    fixHint:
      "Review element semantics and confirm appropriate tag use for content type.",
  },
  {
    category: "General",
    code: "7.1:2.4.2",
    severity: "Error",
    message: "Invalid use of a ‘[ELEMENT_NAME]’ structure element",
    guideline: "14.8.2.2",
    fixHint:
      "Correct invalid element usage by referring to standard structure types.",
  },
  {
    category: "General",
    code: "7.1:2.5",
    severity: "Warning",
    message:
      "Possibly wrong nested ‘[ELEMENT_NAME]’ struct element into StructTreeRoot",
    guideline: "14.8.2.2",
    fixHint:
      "Ensure structural nesting follows the logical document hierarchy.",
  },
  {
    category: "General",
    code: "7.1:3 (14.8.4)",
    severity: "Error",
    message: "Non‑standard structure type ‘[TYPE_NAME]’ not mapped",
    guideline: "14.8.4",
    fixHint: "Map non-standard types to standard types using the role map.",
  },
  {
    category: "General",
    code: "7.1:4 (14.8.4)",
    severity: "Warning",
    message: "Standard structure type ‘[TYPE_NAME]’ is remapped",
    guideline: "14.8.4",
    fixHint:
      "Avoid remapping standard types unless absolutely necessary and justifiable.",
  },
  {
    category: "General",
    code: "7.1:8 (14.7.1)",
    severity: "Error",
    message: "‘Suspects’ entry is set",
    guideline: "14.7.1",
    fixHint: "Remove the /Suspects entry from the document structure.",
  },
  {
    category: "General",
    code: "7.1:9.2 (14.7)",
    severity: "Error",
    message: "‘StructParent’ entry missing in the annotation",
    guideline: "14.7",
    fixHint: "Include the /StructParent entry for all tagged annotations.",
  },
  {
    category: "General",
    code: "7.1:9.3 (14.7)",
    severity: "Error",
    message: "Entry for given ‘StructParents’ not found",
    guideline: "14.7",
    fixHint:
      "Ensure all 'StructParents' entries in page dictionaries have matching entries in the structure tree.",
  },
  {
    category: "Fonts",
    code: "7.21.3.1",
    severity: "Error",
    message: "Character collection in CIDFont incompatible with internal CMap",
    guideline: "7.21.3.1",
    fixHint: "Make sure CIDFont character collections match the CMap used.",
  },
  {
    category: "Fonts",
    code: "7.21.3.2",
    severity: "Error",
    message: "CMap not embedded for font ‘[FONT_NAME]’",
    guideline: "7.21.3.2",
    fixHint: "Embed the CMap used for custom font encoding.",
  },
  {
    category: "Fonts",
    code: "7.21.4.2",
    severity: "Error",
    message: "Glyphs missing in embedded font ‘[FONT_NAME]’",
    guideline: "7.21.4.2",
    fixHint: "Ensure the font subset includes all glyphs used in the document.",
  },
  {
    category: "Fonts",
    code: "7.21.6",
    severity: "Error",
    message:
      "Incorrect “Differences” array for non-symbolic TrueType font ‘[FONT_NAME]’",
    guideline: "7.21.6",
    fixHint:
      "Correct the Differences array to preserve standard Unicode mapping.",
  },
  {
    category: "Annotations",
    code: "7.18.5:1",
    severity: "Error",
    message:
      "‘Link’ annotation is not nested inside a ‘Link’ structure element",
    guideline: "7.18.5",
    fixHint:
      "Ensure each Link annotation has a corresponding Link structure element.",
  },
  {
    category: "Graphics",
    code: "7.3:2",
    severity: "Error",
    message: "Alternative text missing for ‘[ELEMENT_NAME]’",
    guideline: "14.8.4.5",
    fixHint:
      "Add alt text to all <Figure> and similar structure elements representing images.",
  },
  {
    category: "Graphics",
    code: "7.3:3",
    severity: "Error",
    message: "Caption accompanying figure missing",
    guideline: "14.8.4.5",
    fixHint:
      "Add captions to images when required by context (e.g., charts, informative figures).",
  },
  {
    category: "Headings",
    code: "7.4.2:1",
    severity: "Error",
    message: "The first heading is not on the first level",
    guideline: "7.4.2",
    fixHint:
      "Start content structure with an <H1> element to ensure hierarchy.",
  },
  {
    category: "Lists",
    code: "7.6:2",
    severity: "Error",
    message:
      "‘Lbl’ and ‘LBody’ structure element must be children of ‘LI’ element",
    guideline: "7.6",
    fixHint:
      "Ensure list label and body are correctly nested inside a list item (LI).",
  },
  {
    category: "General",
    code: "7.1:6.2",
    severity: "Error",
    message: "Title missing in document’s XMP metadata",
    guideline: "14.3",
    fixHint:
      "Add a dc:title entry in the XMP metadata to identify the document’s title.",
  },
  {
    category: "General",
    code: "7.1:6.3",
    severity: "Warning",
    message: "Title is empty in document’s XMP metadata",
    guideline: "14.3",
    fixHint:
      "Ensure the title field in the XMP metadata is populated with meaningful text.",
  },
  {
    category: "General",
    code: "7.1:7.1 (12.2)",
    severity: "Warning",
    message: "‘ViewerPreferences’ dictionary missing",
    guideline: "12.2",
    fixHint:
      "Add a ViewerPreferences dictionary to guide document behavior (e.g., open mode).",
  },
  {
    category: "General",
    code: "7.1:7.2 (12.2)",
    severity: "Error",
    message: "‘DisplayDocTitle’ entry is not set",
    guideline: "12.2",
    fixHint:
      "Set DisplayDocTitle to true in ViewerPreferences so screen readers use the XMP title.",
  },
  {
    category: "General",
    code: "7.1:8 (14.7.1)",
    severity: "Error",
    message: "‘Suspects’ entry is set",
    guideline: "14.7.1",
    fixHint:
      "Remove the /Suspects key which signals potentially unstructured content.",
  },
  {
    category: "General",
    code: "7.1:9.1 (14.7)",
    severity: "Error",
    message: "‘StructParents’ key missing in page",
    guideline: "14.7",
    fixHint:
      "Add a StructParents key to all page dictionaries that contain tagged content.",
  },
  {
    category: "General",
    code: "7.1:9.2 (14.7)",
    severity: "Error",
    message: "‘StructParent’ entry missing in the annotation",
    guideline: "14.7",
    fixHint:
      "Ensure every annotation has a StructParent entry that maps it to the structure tree.",
  },
  {
    category: "General",
    code: "7.1:9.3 (14.7)",
    severity: "Error",
    message: "Entry for given ‘StructParents’ not found",
    guideline: "14.7",
    fixHint:
      "Ensure StructParents references correspond to existing entries in the structure tree.",
  },
  {
    category: "Text",
    code: "7.2:1",
    severity: "Need manual",
    message: "Logical Reading Order",
    guideline: "7.2",
    fixHint:
      "Verify visually and structurally that reading order matches the intended flow of content.",
  },
  {
    category: "Text",
    code: "7.2:3.1 (14.9.2.2)",
    severity: "Error",
    message: "Natural language of text object undetermined",
    guideline: "14.9.2.2",
    fixHint:
      "Assign /Lang attributes to relevant structure elements or the entire document.",
  },
  // Add more entries here...
];

// -----------------------------
// Component
// -----------------------------
export function PdfUaErrorsTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryFilter = searchParams.get("category") || "all";
  const severityFilter = searchParams.get("severity") || "all";
  const queryParam = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 15;

  const [query, setQuery] = useState(queryParam);

  const allCategories = useMemo(
    () => Array.from(new Set(rawErrors.map((e) => e.category))).sort(),
    []
  );

  const allSeverities: ErrorRow["severity"][] = [
    "Error",
    "Warning",
    "Need manual",
  ];

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    if (!("page" in updates)) params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Update local query when URL param changes
  useEffect(() => setQuery(queryParam), [queryParam]);

  const filtered = useMemo(() => {
    let temp = [...rawErrors];
    if (query) {
      const lower = query.toLowerCase();
      temp = temp.filter((e) =>
        `${e.code} ${e.message}`.toLowerCase().includes(lower)
      );
    }
    if (categoryFilter !== "all") {
      temp = temp.filter((e) => e.category === categoryFilter);
    }
    if (severityFilter !== "all") {
      temp = temp.filter((e) => e.severity === severityFilter);
    }
    return temp;
  }, [query, categoryFilter, severityFilter]);

  // Export filtered data for parent component
  useEffect(() => {
    // This effect is just to demonstrate exporting data.
    // In a real scenario, you might pass a callback prop
    // or use context to share the filtered data.
    // For this task, we'll assume the parent can access 'filtered'.
  }, [filtered]);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  const exportCSV = () => {
    const headers = [
      "Category",
      "Code",
      "Severity",
      "Message",
      "Guideline",
      "Fix Hint",
    ];

    const csvContent = [
      headers.join(","),
      ...filtered.map((err) =>
        [
          `"${err.category}"`,
          `"${err.code}"`,
          `"${err.severity}"`,
          `"${err.message.replace(/"/g, '""')}"`,
          `"${(err.guideline || "").replace(/"/g, '""')}"`,
          `"${(err.fixHint || "").replace(/"/g, '""')}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "pdf-ua-errors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div
      className="space-y-4"
      role="region"
      aria-label="PDF/UA Compliance Errors"
    >
      {/* Filter Bar */}
      <div
        className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-md"
        role="search"
        aria-label="Filter errors"
      >
        {/* Category Filter */}
        <div className="flex flex-col gap-2 w-[200px]">
          <Label htmlFor="category-select">Category</Label>
          <Select
            value={categoryFilter}
            onValueChange={(v) => updateParams({ category: v })}
          >
            <SelectTrigger id="category-select">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Severity Filter */}
        <div className="flex flex-col gap-2 w-[160px]">
          <Label htmlFor="severity-select">Severity</Label>
          <Select
            value={severityFilter}
            onValueChange={(v) => updateParams({ severity: v })}
          >
            <SelectTrigger id="severity-select">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {allSeverities.map((sev) => (
                <SelectItem key={sev} value={sev}>
                  {sev}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="error-search">Search Errors</Label>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              id="error-search"
              type="search"
              placeholder="Search code or message…"
              className="pl-9"
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);
                updateParams({ q: val });
              }}
            />
          </div>
        </div>

        {/* Clear Button */}
        <div className="flex items-end gap-2 md:ml-auto">
          <Button
            variant="outline"
            onClick={() =>
              updateParams({ category: "all", severity: "all", q: "" })
            }
            className="flex items-center gap-2 mt-auto" // Added mt-auto for alignment
          >
            <Filter className="h-4 w-4" /> Clear Filters
          </Button>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="flex items-center gap-2 mt-auto" // Added mt-auto for alignment
            disabled={filtered.length === 0}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table aria-label="PDF/UA compliance errors">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="w-[100px]">Severity</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Guideline</TableHead>
              <TableHead>Fix Suggestion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody aria-live="polite" aria-atomic="true">
            {paginated.length > 0 ? (
              paginated.map((err, idx) => (
                <TableRow
                  key={`${err.code}-${idx}`}
                  className="hover:bg-gray-50/50"
                >
                  <TableCell className="whitespace-nowrap">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${getCategoryBadgeColor(
                        err.category
                      )}`}
                    >
                      {err.category}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">
                    {err.code}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {err.severity}
                  </TableCell>
                  <TableCell>{err.message}</TableCell>
                  <TableCell>{err.guideline || "—"}</TableCell>
                  <TableCell>{err.fixHint || "—"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No matching errors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-center gap-2 py-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateParams({ page: String(Math.max(1, page - 1)) })
            }
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              variant={n === page ? "default" : "outline"}
              size="sm"
              onClick={() => updateParams({ page: n.toString() })}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateParams({ page: String(Math.min(totalPages, page + 1)) })
            }
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </nav>
      )}

      {/* Footer Info */}
      <p
        className="text-sm text-gray-500"
        aria-live="polite"
        aria-atomic="true"
      >
        Showing {(page - 1) * itemsPerPage + 1} to{" "}
        {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length}{" "}
        errors
      </p>
    </div>
  );
}
