"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
  const router = useRouter()
  const levelFilter = searchParams.get("level") || ""
  const principleFilter = searchParams.get("principle") || ""
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const itemsPerPage = 10

  const [filteredGuidelines, setFilteredGuidelines] = useState<Guideline[]>([])
  const [paginatedGuidelines, setPaginatedGuidelines] = useState<Guideline[]>([])
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [totalPages, setTotalPages] = useState(1)

  // Complete WCAG 2.2 guidelines data
  const guidelines: Guideline[] = [
    // Perceivable
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
      id: "1.2.2",
      principle: "Perceivable",
      guideline: "Captions (Prerecorded)",
      level: "A",
      summary: "Provide captions for prerecorded audio content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html",
    },
    {
      id: "1.2.3",
      principle: "Perceivable",
      guideline: "Audio Description or Media Alternative (Prerecorded)",
      level: "A",
      summary: "Provide audio description or text alternative for video content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html",
    },
    {
      id: "1.2.4",
      principle: "Perceivable",
      guideline: "Captions (Live)",
      level: "AA",
      summary: "Provide captions for live audio content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html",
    },
    {
      id: "1.2.5",
      principle: "Perceivable",
      guideline: "Audio Description (Prerecorded)",
      level: "AA",
      summary: "Provide audio description for prerecorded video content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html",
    },
    {
      id: "1.2.6",
      principle: "Perceivable",
      guideline: "Sign Language (Prerecorded)",
      level: "AAA",
      summary: "Provide sign language interpretation for prerecorded audio content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/sign-language-prerecorded.html",
    },
    {
      id: "1.2.7",
      principle: "Perceivable",
      guideline: "Extended Audio Description (Prerecorded)",
      level: "AAA",
      summary: "Provide extended audio description for prerecorded video content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html",
    },
    {
      id: "1.2.8",
      principle: "Perceivable",
      guideline: "Media Alternative (Prerecorded)",
      level: "AAA",
      summary: "Provide alternative for time-based media",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/media-alternative-prerecorded.html",
    },
    {
      id: "1.2.9",
      principle: "Perceivable",
      guideline: "Audio-only (Live)",
      level: "AAA",
      summary: "Provide alternatives for live audio-only content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-live.html",
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
      id: "1.3.2",
      principle: "Perceivable",
      guideline: "Meaningful Sequence",
      level: "A",
      summary: "Present content in a meaningful sequence",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html",
    },
    {
      id: "1.3.3",
      principle: "Perceivable",
      guideline: "Sensory Characteristics",
      level: "A",
      summary: "Don't rely solely on sensory characteristics for instructions",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html",
    },
    {
      id: "1.3.4",
      principle: "Perceivable",
      guideline: "Orientation",
      level: "AA",
      summary: "Content not restricted to specific orientation",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/orientation.html",
    },
    {
      id: "1.3.5",
      principle: "Perceivable",
      guideline: "Identify Input Purpose",
      level: "AA",
      summary: "Input fields collecting personal data have appropriate autocomplete attributes",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html",
    },
    {
      id: "1.3.6",
      principle: "Perceivable",
      guideline: "Identify Purpose",
      level: "AAA",
      summary: "The purpose of UI components, icons, and regions can be programmatically determined",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html",
    },
    {
      id: "1.4.1",
      principle: "Perceivable",
      guideline: "Use of Color",
      level: "A",
      summary: "Don't use color as the only visual means of conveying information",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
    },
    {
      id: "1.4.2",
      principle: "Perceivable",
      guideline: "Audio Control",
      level: "A",
      summary: "Provide user control for audio that plays automatically",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html",
    },
    {
      id: "1.4.3",
      principle: "Perceivable",
      guideline: "Contrast (Minimum)",
      level: "AA",
      summary: "Text has sufficient contrast against its background",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
    },
    {
      id: "1.4.4",
      principle: "Perceivable",
      guideline: "Resize Text",
      level: "AA",
      summary: "Text can be resized without loss of content or functionality",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html",
    },
    {
      id: "1.4.5",
      principle: "Perceivable",
      guideline: "Images of Text",
      level: "AA",
      summary: "Use text rather than images of text",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html",
    },
    {
      id: "1.4.6",
      principle: "Perceivable",
      guideline: "Contrast (Enhanced)",
      level: "AAA",
      summary: "Text has enhanced contrast against its background",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html",
    },
    {
      id: "1.4.7",
      principle: "Perceivable",
      guideline: "Low or No Background Audio",
      level: "AAA",
      summary: "Audio is clear with no or minimal background noise",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html",
    },
    {
      id: "1.4.8",
      principle: "Perceivable",
      guideline: "Visual Presentation",
      level: "AAA",
      summary: "Provide user control over text presentation",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html",
    },
    {
      id: "1.4.9",
      principle: "Perceivable",
      guideline: "Images of Text (No Exception)",
      level: "AAA",
      summary: "Use text rather than images of text with no exceptions",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text-no-exception.html",
    },
    {
      id: "1.4.10",
      principle: "Perceivable",
      guideline: "Reflow",
      level: "AA",
      summary: "Content can be presented without scrolling in two dimensions",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html",
    },
    {
      id: "1.4.11",
      principle: "Perceivable",
      guideline: "Non-text Contrast",
      level: "AA",
      summary: "User interface components and graphical objects have sufficient contrast",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
    },
    {
      id: "1.4.12",
      principle: "Perceivable",
      guideline: "Text Spacing",
      level: "AA",
      summary: "No loss of content when text spacing is adjusted",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html",
    },
    {
      id: "1.4.13",
      principle: "Perceivable",
      guideline: "Content on Hover or Focus",
      level: "AA",
      summary: "Additional content that appears on hover or focus can be dismissed",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html",
    },

    // Operable
    {
      id: "2.1.1",
      principle: "Operable",
      guideline: "Keyboard",
      level: "A",
      summary: "All functionality is available from a keyboard",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
    },
    {
      id: "2.1.2",
      principle: "Operable",
      guideline: "No Keyboard Trap",
      level: "A",
      summary: "Users can navigate away from keyboard focus",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html",
    },
    {
      id: "2.1.3",
      principle: "Operable",
      guideline: "Keyboard (No Exception)",
      level: "AAA",
      summary: "All functionality is available from a keyboard without exceptions",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard-no-exception.html",
    },
    {
      id: "2.1.4",
      principle: "Operable",
      guideline: "Character Key Shortcuts",
      level: "A",
      summary: "Character key shortcuts can be turned off or remapped",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html",
    },
    {
      id: "2.2.1",
      principle: "Operable",
      guideline: "Timing Adjustable",
      level: "A",
      summary: "Users can adjust or extend time limits",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html",
    },
    {
      id: "2.2.2",
      principle: "Operable",
      guideline: "Pause, Stop, Hide",
      level: "A",
      summary: "Users can pause, stop, or hide moving content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html",
    },
    {
      id: "2.2.3",
      principle: "Operable",
      guideline: "No Timing",
      level: "AAA",
      summary: "No time limits on user interaction",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/no-timing.html",
    },
    {
      id: "2.2.4",
      principle: "Operable",
      guideline: "Interruptions",
      level: "AAA",
      summary: "Users can postpone or suppress interruptions",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/interruptions.html",
    },
    {
      id: "2.2.5",
      principle: "Operable",
      guideline: "Re-authenticating",
      level: "AAA",
      summary: "Data is preserved when re-authenticating",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html",
    },
    {
      id: "2.2.6",
      principle: "Operable",
      guideline: "Timeouts",
      level: "AAA",
      summary: "Users are warned about timeouts that could cause data loss",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html",
    },
    {
      id: "2.3.1",
      principle: "Operable",
      guideline: "Three Flashes or Below Threshold",
      level: "A",
      summary: "Content doesn't flash more than three times per second",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html",
    },
    {
      id: "2.3.2",
      principle: "Operable",
      guideline: "Three Flashes",
      level: "AAA",
      summary: "Content doesn't flash more than three times per second (no exceptions)",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html",
    },
    {
      id: "2.3.3",
      principle: "Operable",
      guideline: "Animation from Interactions",
      level: "AAA",
      summary: "Users can disable non-essential animation triggered by interaction",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html",
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
      id: "2.4.2",
      principle: "Operable",
      guideline: "Page Titled",
      level: "A",
      summary: "Pages have titles that describe topic or purpose",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html",
    },
    {
      id: "2.4.3",
      principle: "Operable",
      guideline: "Focus Order",
      level: "A",
      summary: "Focus order preserves meaning and operability",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
    },
    {
      id: "2.4.4",
      principle: "Operable",
      guideline: "Link Purpose (In Context)",
      level: "A",
      summary: "Link purpose can be determined from the link text or context",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html",
    },
    {
      id: "2.4.5",
      principle: "Operable",
      guideline: "Multiple Ways",
      level: "AA",
      summary: "Provide multiple ways to locate a page",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html",
    },
    {
      id: "2.4.6",
      principle: "Operable",
      guideline: "Headings and Labels",
      level: "AA",
      summary: "Headings and labels describe topic or purpose",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html",
    },
    {
      id: "2.4.7",
      principle: "Operable",
      guideline: "Focus Visible",
      level: "AA",
      summary: "Keyboard focus indicator is visible",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
    },
    {
      id: "2.4.8",
      principle: "Operable",
      guideline: "Location",
      level: "AAA",
      summary: "User's location within the site is available",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/location.html",
    },
    {
      id: "2.4.9",
      principle: "Operable",
      guideline: "Link Purpose (Link Only)",
      level: "AAA",
      summary: "Link purpose can be determined from the link text alone",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html",
    },
    {
      id: "2.4.10",
      principle: "Operable",
      guideline: "Section Headings",
      level: "AAA",
      summary: "Section headings are used to organize content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/section-headings.html",
    },
    {
      id: "2.4.11",
      principle: "Operable",
      guideline: "Focus Not Obscured (Minimum)",
      level: "AA",
      summary: "Focused element is not entirely hidden by author-created content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html",
    },
    {
      id: "2.4.12",
      principle: "Operable",
      guideline: "Focus Not Obscured (Enhanced)",
      level: "AAA",
      summary: "No part of the focused element is hidden by author-created content",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html",
    },
    {
      id: "2.4.13",
      principle: "Operable",
      guideline: "Focus Appearance",
      level: "AAA",
      summary: "Focus indicator is clearly visible with minimum area and contrast",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html",
    },
    {
      id: "2.5.1",
      principle: "Operable",
      guideline: "Pointer Gestures",
      level: "A",
      summary: "Multipoint or path-based gestures have single-point alternative",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html",
    },
    {
      id: "2.5.2",
      principle: "Operable",
      guideline: "Pointer Cancellation",
      level: "A",
      summary: "Functions activated by pointer can be cancelled",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html",
    },
    {
      id: "2.5.3",
      principle: "Operable",
      guideline: "Label in Name",
      level: "A",
      summary: "Visible text label is part of accessible name",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html",
    },
    {
      id: "2.5.4",
      principle: "Operable",
      guideline: "Motion Actuation",
      level: "A",
      summary: "Functions triggered by motion can also be operated by user interface components",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html",
    },
    {
      id: "2.5.5",
      principle: "Operable",
      guideline: "Target Size (Enhanced)",
      level: "AAA",
      summary: "Size of target for pointer inputs is at least 44 by 44 CSS pixels",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html",
    },
    {
      id: "2.5.6",
      principle: "Operable",
      guideline: "Concurrent Input Mechanisms",
      level: "AAA",
      summary: "Content can be operated through multiple input methods",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms.html",
    },
    {
      id: "2.5.7",
      principle: "Operable",
      guideline: "Dragging Movements",
      level: "AA",
      summary: "Functions that require dragging have a non-dragging alternative",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
    },
    {
      id: "2.5.8",
      principle: "Operable",
      guideline: "Target Size (Minimum)",
      level: "AA",
      summary: "Interactive targets are at least 24 by 24 CSS pixels",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
    },

    // Understandable
    {
      id: "3.1.1",
      principle: "Understandable",
      guideline: "Language of Page",
      level: "A",
      summary: "The default human language of the page can be programmatically determined",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
    },
    {
      id: "3.1.2",
      principle: "Understandable",
      guideline: "Language of Parts",
      level: "AA",
      summary: "The language of passages can be programmatically determined",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html",
    },
    {
      id: "3.1.3",
      principle: "Understandable",
      guideline: "Unusual Words",
      level: "AAA",
      summary: "Provide mechanism for identifying specific definitions of words used in an unusual way",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/unusual-words.html",
    },
    {
      id: "3.1.4",
      principle: "Understandable",
      guideline: "Abbreviations",
      level: "AAA",
      summary: "Provide mechanism for identifying expanded form of abbreviations",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/abbreviations.html",
    },
    {
      id: "3.1.5",
      principle: "Understandable",
      guideline: "Reading Level",
      level: "AAA",
      summary: "Provide text that is not more complex than lower secondary education level",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html",
    },
    {
      id: "3.1.6",
      principle: "Understandable",
      guideline: "Pronunciation",
      level: "AAA",
      summary: "Provide mechanism for identifying specific pronunciation of words",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html",
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
      id: "3.2.2",
      principle: "Understandable",
      guideline: "On Input",
      level: "A",
      summary: "Changing a setting does not automatically cause a change of context",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/on-input.html",
    },
    {
      id: "3.2.3",
      principle: "Understandable",
      guideline: "Consistent Navigation",
      level: "AA",
      summary: "Navigation mechanisms are consistent across multiple pages",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html",
    },
    {
      id: "3.2.4",
      principle: "Understandable",
      guideline: "Consistent Identification",
      level: "AA",
      summary: "Components with the same functionality are identified consistently",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html",
    },
    {
      id: "3.2.5",
      principle: "Understandable",
      guideline: "Change on Request",
      level: "AAA",
      summary: "Changes of context are initiated only by user request",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html",
    },
    {
      id: "3.2.6",
      principle: "Understandable",
      guideline: "Consistent Help",
      level: "A",
      summary: "Help mechanisms appear in the same relative order on all pages",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html",
    },
    {
      id: "3.3.1",
      principle: "Understandable",
      guideline: "Error Identification",
      level: "A",
      summary: "Input errors are identified and described to the user",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html",
    },
    {
      id: "3.3.2",
      principle: "Understandable",
      guideline: "Labels or Instructions",
      level: "A",
      summary: "Labels or instructions are provided for user input",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
    },
    {
      id: "3.3.3",
      principle: "Understandable",
      guideline: "Error Suggestion",
      level: "AA",
      summary: "Suggestions for error correction are provided",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html",
    },
    {
      id: "3.3.4",
      principle: "Understandable",
      guideline: "Error Prevention (Legal, Financial, Data)",
      level: "AA",
      summary: "Submissions with legal or financial consequences can be reviewed, corrected, or confirmed",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html",
    },
    {
      id: "3.3.5",
      principle: "Understandable",
      guideline: "Help",
      level: "AAA",
      summary: "Context-sensitive help is available",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/help.html",
    },
    {
      id: "3.3.6",
      principle: "Understandable",
      guideline: "Error Prevention (All)",
      level: "AAA",
      summary: "All submissions can be reviewed, corrected, or confirmed",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html",
    },
    {
      id: "3.3.7",
      principle: "Understandable",
      guideline: "Redundant Entry",
      level: "A",
      summary: "Information previously entered by the user is auto-populated",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html",
    },
    {
      id: "3.3.8",
      principle: "Understandable",
      guideline: "Accessible Authentication (Minimum)",
      level: "AA",
      summary: "Authentication processes don't rely solely on cognitive tests",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html",
    },
    {
      id: "3.3.9",
      principle: "Understandable",
      guideline: "Accessible Authentication (Enhanced)",
      level: "AAA",
      summary: "Authentication processes don't rely on any cognitive tests",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html",
    },

    // Robust
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
    {
      id: "4.1.3",
      principle: "Robust",
      guideline: "Status Messages",
      level: "AA",
      summary: "Status messages can be programmatically determined",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html",
    },
  ]

  // Update URL with filters
  const updateFilters = (newFilters: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 when filters change
    if (Object.keys(newFilters).some((key) => key !== "page")) {
      params.set("page", "1")
    }

    router.push(`?${params.toString()}`)
  }

  // Filter guidelines based on search params
  useEffect(() => {
    let filtered = [...guidelines]

    if (query) {
      filtered = filtered.filter(
        (guideline) =>
          guideline.id.toLowerCase().includes(query.toLowerCase()) ||
          guideline.principle.toLowerCase().includes(query.toLowerCase()) ||
          guideline.guideline.toLowerCase().includes(query.toLowerCase()) ||
          guideline.summary.toLowerCase().includes(query.toLowerCase()),
      )
    }

    if (levelFilter) {
      filtered = filtered.filter((guideline) => guideline.level === levelFilter)
    }

    if (principleFilter) {
      filtered = filtered.filter((guideline) => guideline.principle === principleFilter)
    }

    setFilteredGuidelines(filtered)
    setTotalPages(Math.ceil(filtered.length / itemsPerPage))

    // Get current page of guidelines
    const startIndex = (page - 1) * itemsPerPage
    setPaginatedGuidelines(filtered.slice(startIndex, startIndex + itemsPerPage))
  }, [query, levelFilter, principleFilter, page, itemsPerPage])

  useEffect(() => {
    setQuery(searchParams.get("q") || "")
  }, [searchParams])

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
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-md">
        <div className="flex flex-col gap-2">
          <Label htmlFor="level-filter">Conformance Level</Label>
          <Select value={levelFilter} onValueChange={(value) => updateFilters({ level: value })}>
            <SelectTrigger id="level-filter" className="w-[180px]">
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="principle-filter">Principle</Label>
          <Select value={principleFilter} onValueChange={(value) => updateFilters({ principle: value })}>
            <SelectTrigger id="principle-filter" className="w-[180px]">
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

        <div className="flex flex-col gap-2">
          <Label htmlFor="search-filter">Search Guidelines</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              id="search-filter"
              type="search"
              placeholder="Search guidelines..."
              className="pl-10 w-full md:w-[250px]"
              value={query}
              onChange={(e) => {
                const newQuery = e.target.value
                const params = new URLSearchParams(searchParams.toString())

                if (newQuery) {
                  params.set("q", newQuery)
                } else {
                  params.delete("q")
                }

                params.set("page", "1")
                router.push(`?${params.toString()}`)
              }}
              aria-label="Search guidelines"
            />
          </div>
        </div>

        <div className="flex items-end ml-auto">
          <Button
            variant="outline"
            onClick={() => {
              const params = new URLSearchParams()
              params.set("page", "1")
              router.push(`?${params.toString()}`)
            }}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            Showing {paginatedGuidelines.length} of {filteredGuidelines.length} WCAG 2.2 Guidelines
          </TableCaption>
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
            {paginatedGuidelines.length > 0 ? (
              paginatedGuidelines.map((guideline) => (
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ page: Math.max(1, page - 1).toString() })}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters({ page: pageNum.toString() })}
                aria-label={`Page ${pageNum}`}
                aria-current={pageNum === page ? "page" : undefined}
              >
                {pageNum}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ page: Math.min(totalPages, page + 1).toString() })}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="text-sm text-gray-500">
        Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredGuidelines.length)} of{" "}
        {filteredGuidelines.length} guidelines
      </div>
    </div>
  )
}
