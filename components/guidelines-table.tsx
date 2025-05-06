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
    {
      id: "1.2.1",
      principle: "Perceivable",
      guideline: "Audio-only and Video-only (Prerecorded)",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Ensure that audio-only and video-only prerecorded content includes equivalent alternatives. Audio-only content must have transcripts, and video-only must have full descriptions. This ensures users who are deaf or blind can perceive the information that would otherwise be inaccessible.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html",
      tags: ["transcripts", "media alternatives", "audio-only", "video-only"],
      impacts: ["deaf users", "blind users", "low vision", "hard of hearing"],
    },
    {
      id: "1.2.2",
      principle: "Perceivable",
      guideline: "Captions (Prerecorded)",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Provide synchronized captions for all prerecorded audio content in video. Captions help users who are deaf or hard of hearing access dialogue, sound effects, and other meaningful audio. Captions should be accurate and synchronized with the visual presentation to ensure equal access.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html",
      tags: ["captions", "video", "audio", "prerecorded", "multimedia"],
      impacts: ["deaf users", "hard of hearing", "ESL users"],
    },
    {
      id: "1.2.3",
      principle: "Perceivable",
      guideline: "Audio Description or Media Alternative (Prerecorded)",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Provide audio descriptions or a text-based alternative for prerecorded video content to describe important visual details, such as actions, scene changes, and on-screen text. This allows blind and low vision users to perceive visual information otherwise inaccessible in the video alone.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-or-media-alternative-prerecorded.html",
      tags: [
        "audio description",
        "media alternative",
        "video",
        "blind accessibility",
      ],
      impacts: ["blind users", "low vision", "screen reader users"],
    },
    {
      id: "1.2.4",
      principle: "Perceivable",
      guideline: "Captions (Live)",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Live audio content in synchronized media, such as webinars or broadcasts, must include real-time captions to ensure users who are deaf or hard of hearing can follow along. Captions must reflect the spoken dialogue and important audio content with minimal delay.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/captions-live.html",
      tags: [
        "live video",
        "real-time captions",
        "broadcast accessibility",
        "webinars",
      ],
      impacts: ["deaf users", "hard of hearing"],
    },
    {
      id: "1.2.5",
      principle: "Perceivable",
      guideline: "Audio Description (Prerecorded)",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Provide audio descriptions for prerecorded video content to narrate key visual elements such as actions, text, and scenes. This allows users who are blind or have low vision to understand visual information that is not conveyed through the primary audio track alone.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html",
      tags: ["audio description", "video", "prerecorded media", "narration"],
      impacts: ["blind users", "low vision", "screen reader users"],
    },
    {
      id: "1.2.6",
      principle: "Perceivable",
      guideline: "Sign Language (Prerecorded)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Offer sign language interpretation for all meaningful audio content in prerecorded video to provide full access for users whose primary language is sign language. Sign language conveys tone, emotion, and meaning that may be lost through text alternatives alone.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/sign-language-prerecorded.html",
      tags: [
        "sign language",
        "prerecorded",
        "video accessibility",
        "interpretation",
      ],
      impacts: ["deaf users", "sign language users"],
    },
    {
      id: "1.2.7",
      principle: "Perceivable",
      guideline: "Extended Audio Description (Prerecorded)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Enable extended audio description for prerecorded video by pausing the video as needed to provide additional narration about visual content. This ensures that blind and low vision users can fully understand scenes that contain fast-paced or dense visual information.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/extended-audio-description-prerecorded.html",
      tags: [
        "extended description",
        "video",
        "blind users",
        "prerecorded media",
      ],
      impacts: ["blind users", "low vision"],
    },
    {
      id: "1.2.8",
      principle: "Perceivable",
      guideline: "Media Alternative (Prerecorded)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Provide a full text-based alternative for all prerecorded synchronized media. This alternative should include all spoken dialogue and descriptions of visual content to allow users who cannot access audio or video to still understand the media’s full meaning.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/media-alternative-prerecorded.html",
      tags: ["text alternative", "media", "video", "transcript", "prerecorded"],
      impacts: ["deaf users", "blind users", "low vision", "hard of hearing"],
    },
    {
      id: "1.2.9",
      principle: "Perceivable",
      guideline: "Audio-only (Live)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Ensure that live audio-only content, such as a radio stream or live speech, has a text-based alternative like a real-time transcript. This supports users who are deaf or hard of hearing by providing access to spoken information as it occurs.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/audio-only-live.html",
      tags: ["live audio", "real-time transcript", "accessibility", "speech"],
      impacts: ["deaf users", "hard of hearing"],
    },
    {
      id: "1.3.1",
      principle: "Perceivable",
      guideline: "Info and Relationships",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Ensure that the structure and relationships within content—such as headings, lists, form labels, and tables—can be programmatically determined. This allows assistive technologies to convey meaning and navigation, enabling users with disabilities to understand content organization and context.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html",
      tags: ["semantic structure", "headings", "labels", "forms", "tables"],
      impacts: ["screen reader users", "cognitive disabilities", "low vision"],
    },
    {
      id: "1.3.2",
      principle: "Perceivable",
      guideline: "Meaningful Sequence",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Content must be presented in a meaningful reading and navigation order that can be programmatically determined. This ensures that users relying on screen readers or keyboard navigation receive information in a logical and coherent sequence, as intended by the author.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html",
      tags: ["reading order", "screen readers", "navigation", "content flow"],
      impacts: ["screen reader users", "blind users", "cognitive disabilities"],
    },
    {
      id: "1.3.3",
      principle: "Perceivable",
      guideline: "Sensory Characteristics",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Instructions must not rely solely on sensory characteristics like color, shape, size, or location. Users with vision impairments or cognitive disabilities may not perceive these cues. Instead, provide additional text or labels to convey the same information clearly and inclusively.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html",
      tags: ["instructions", "color", "shape", "location", "non-visual cues"],
      impacts: ["blind users", "colorblind users", "cognitive disabilities"],
    },
    {
      id: "1.3.4",
      principle: "Perceivable",
      guideline: "Orientation",
      level: "AA",
      version: "WCAG 2.1",
      summary:
        "Content must not restrict its display to a single screen orientation (portrait or landscape) unless essential. This ensures that users who have devices mounted in a fixed orientation—such as in assistive technology setups—can still access all content and functionality.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/orientation.html",
      tags: ["orientation", "mobile", "layout", "flexibility"],
      impacts: ["motor disabilities", "mobile users", "switch device users"],
    },
    {
      id: "1.3.5",
      principle: "Perceivable",
      guideline: "Identify Input Purpose",
      level: "AA",
      version: "WCAG 2.1",
      summary:
        "Input fields that collect user information—such as name, email, or address—must include HTML autocomplete attributes so that the purpose can be programmatically identified. This helps assistive technologies offer personalized input support and improves form usability.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html",
      tags: ["forms", "input fields", "autocomplete", "personal information"],
      impacts: [
        "cognitive disabilities",
        "motor impairments",
        "screen reader users",
      ],
    },
    {
      id: "1.3.6",
      principle: "Perceivable",
      guideline: "Identify Purpose",
      level: "AAA",
      version: "WCAG 2.1",
      summary:
        "User interface components, icons, and regions must be marked up in a way that their purpose can be programmatically determined. This allows assistive technologies and personalization tools to adapt interfaces to user needs, enhancing accessibility for users with cognitive or language-related disabilities.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/identify-purpose.html",
      tags: ["semantics", "ARIA", "UI components", "personalization"],
      impacts: [
        "cognitive disabilities",
        "screen reader users",
        "language learners",
      ],
    },
    {
      id: "1.4.1",
      principle: "Perceivable",
      guideline: "Use of Color",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Color must not be the only means of conveying information, indicating an action, prompting a response, or distinguishing visual elements. Users with color vision deficiencies may not perceive these distinctions. Supplement color with text, patterns, or shapes.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html",
      tags: ["color", "contrast", "instructions", "visual indicators"],
      impacts: ["colorblind users", "low vision", "cognitive disabilities"],
    },
    {
      id: "1.4.2",
      principle: "Perceivable",
      guideline: "Audio Control",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "If audio plays automatically for more than 3 seconds, users must have a mechanism to pause, stop, or control the volume independently of the system volume. This prevents interference with screen readers and supports users with cognitive or auditory challenges.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html",
      tags: ["audio", "autoplay", "media control", "sound"],
      impacts: [
        "screen reader users",
        "cognitive disabilities",
        "hard of hearing",
      ],
    },
    {
      id: "1.4.3",
      principle: "Perceivable",
      guideline: "Contrast (Minimum)",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Text and images of text must have a contrast ratio of at least 4.5:1 against the background (3:1 for large text). This ensures readability for users with low vision or color blindness and improves legibility across various lighting conditions and devices.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
      tags: ["contrast", "text readability", "color", "visual clarity"],
      impacts: ["low vision", "colorblind users", "older adults"],
    },
    {
      id: "1.4.4",
      principle: "Perceivable",
      guideline: "Resize Text",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Text must remain readable and functional when resized up to 200% without assistive technology. This helps users with low vision or age-related visual decline read content more comfortably without loss of content or functionality.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html",
      tags: ["text resizing", "zoom", "responsive design", "scalability"],
      impacts: ["low vision", "older adults"],
    },
    {
      id: "1.4.5",
      principle: "Perceivable",
      guideline: "Images of Text",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Use real text rather than images of text whenever possible. Text images don’t scale well, are harder to read, and are inaccessible to screen readers. Exceptions apply when text is part of a logo or when formatting can't be achieved with actual text.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html",
      tags: ["text rendering", "images", "scaling", "readability"],
      impacts: ["screen reader users", "low vision", "mobile users"],
    },
    {
      id: "1.4.6",
      principle: "Perceivable",
      guideline: "Contrast (Enhanced)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "To further support readability, especially for users with low vision, text and images of text should have a contrast ratio of at least 7:1 (or 4.5:1 for large text). This higher contrast threshold ensures maximum legibility in various viewing conditions.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html",
      tags: [
        "enhanced contrast",
        "visual accessibility",
        "legibility",
        "color use",
      ],
      impacts: ["low vision", "older adults", "colorblind users"],
    },
    {
      id: "1.4.7",
      principle: "Perceivable",
      guideline: "Low or No Background Audio",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "For prerecorded audio with speech, background sounds should be at least 20 dB lower than the foreground speech or be able to be turned off. This ensures that users who are hard of hearing or using assistive hearing devices can clearly perceive spoken content without distraction.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/low-or-no-background-audio.html",
      tags: ["audio", "background noise", "speech clarity", "media"],
      impacts: ["hard of hearing", "older adults", "assistive tech users"],
    },
    {
      id: "1.4.8",
      principle: "Perceivable",
      guideline: "Visual Presentation",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Provide users with the ability to control visual presentation of text, including font size, color, line spacing, and text width. This enhances readability and reduces visual strain for users with dyslexia, low vision, or cognitive disabilities.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html",
      tags: ["text customization", "readability", "typography", "layout"],
      impacts: ["low vision", "dyslexia", "cognitive disabilities"],
    },
    {
      id: "1.4.9",
      principle: "Perceivable",
      guideline: "Images of Text (No Exception)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Avoid using images of text entirely, even for decorative or design reasons, unless it's essential. This ensures that all users can scale, reflow, or access the text through assistive technology, which is not possible with static text images.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/images-of-text-no-exception.html",
      tags: ["images of text", "scalability", "accessibility", "real text"],
      impacts: ["screen reader users", "low vision", "mobile users"],
    },
    {
      id: "1.4.10",
      principle: "Perceivable",
      guideline: "Reflow",
      level: "AA",
      version: "WCAG 2.1",
      summary:
        "Content must support responsive reflow so it can be presented without horizontal scrolling at a width of 320px (for vertical scrolling) or 256px (for horizontal). This benefits users on mobile devices or those with low vision using zoom tools.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/reflow.html",
      tags: ["responsive design", "zoom", "layout", "scrolling"],
      impacts: ["low vision", "mobile users", "screen magnifier users"],
    },
    {
      id: "1.4.11",
      principle: "Perceivable",
      guideline: "Non-text Contrast",
      level: "AA",
      version: "WCAG 2.1",
      summary:
        "Visual information required to understand and operate user interface components—such as buttons, form fields, and focus indicators—must have a contrast ratio of at least 3:1 against adjacent colors. This helps users with low vision distinguish and use interface elements effectively.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html",
      tags: ["UI elements", "contrast", "focus indicators", "form controls"],
      impacts: ["low vision", "colorblind users", "motor disabilities"],
    },
    {
      id: "1.4.12",
      principle: "Perceivable",
      guideline: "Text Spacing",
      level: "AA",
      version: "WCAG 2.1",
      summary:
        "Users must be able to override text spacing settings—such as line height, letter spacing, and paragraph spacing—without loss of content or functionality. This supports users with dyslexia and other reading disabilities who rely on custom text formatting for comprehension.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html",
      tags: ["typography", "text formatting", "readability", "custom styles"],
      impacts: ["dyslexia", "cognitive disabilities", "low vision"],
    },
    {
      id: "1.4.13",
      principle: "Perceivable",
      guideline: "Content on Hover or Focus",
      level: "AA",
      version: "WCAG 2.1",
      summary:
        "When additional content appears on hover or focus (like tooltips or dropdowns), users must be able to dismiss, move to, or interact with that content without it disappearing unexpectedly. This ensures that all users can access and control dynamic content safely.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html",
      tags: ["hover", "focus", "tooltips", "popup content", "keyboard access"],
      impacts: ["motor impairments", "low vision", "cognitive disabilities"],
    },
    {
      id: "2.1.1",
      principle: "Operable",
      guideline: "Keyboard",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "All functionality must be available via a keyboard interface, without requiring specific timing for keystrokes. This ensures that users who rely on keyboard navigation—including those using screen readers, switch devices, or alternative keyboards—can access all content and features.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html",
      tags: ["keyboard access", "navigation", "input", "assistive tech"],
      impacts: ["motor disabilities", "blind users", "screen reader users"],
    },
    {
      id: "2.1.2",
      principle: "Operable",
      guideline: "No Keyboard Trap",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Users must be able to move keyboard focus into and out of all components. Keyboard traps—where users cannot escape a modal, menu, or input area—must be avoided to ensure consistent navigation and prevent lock-ins for assistive technology users.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/no-keyboard-trap.html",
      tags: ["keyboard navigation", "focus", "modals", "accessibility"],
      impacts: [
        "keyboard-only users",
        "motor disabilities",
        "screen reader users",
      ],
    },
    {
      id: "2.1.3",
      principle: "Operable",
      guideline: "Keyboard (No Exception)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "All functionality must be fully operable using the keyboard with no exceptions. This criterion strengthens 2.1.1 by removing allowances for scenarios where a keyboard interface might not be feasible, offering maximum accessibility assurance.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/keyboard-no-exception.html",
      tags: ["keyboard", "no exception", "navigation", "interaction"],
      impacts: ["motor disabilities", "blind users", "screen reader users"],
    },
    {
      id: "2.1.4",
      principle: "Operable",
      guideline: "Character Key Shortcuts",
      level: "A",
      version: "WCAG 2.1",
      summary:
        "If single-character keyboard shortcuts are implemented, users must be able to turn them off, remap them, or only activate them on focus. This prevents accidental triggers for users who use speech input or alternative keyboards that may simulate key presses.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html",
      tags: ["keyboard shortcuts", "speech input", "remap", "customization"],
      impacts: [
        "motor disabilities",
        "speech input users",
        "assistive tech users",
      ],
    },
    {
      id: "2.2.1",
      principle: "Operable",
      guideline: "Timing Adjustable",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "If a time limit is set for any part of the content, users must be able to turn it off, adjust it, or extend it unless it’s essential (e.g., for real-time events). This ensures users with cognitive, physical, or vision-related disabilities can complete tasks at their own pace.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html",
      tags: [
        "timeouts",
        "form completion",
        "cognitive accessibility",
        "user control",
      ],
      impacts: ["cognitive disabilities", "motor impairments", "low vision"],
    },
    {
      id: "2.2.2",
      principle: "Operable",
      guideline: "Pause, Stop, Hide",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Users must be able to pause, stop, or hide any moving, blinking, scrolling, or auto-updating content that lasts more than five seconds, unless it's essential. This helps users who are easily distracted, rely on screen readers, or have cognitive or vestibular disabilities.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html",
      tags: ["animations", "auto-play", "motion", "user control"],
      impacts: [
        "cognitive disabilities",
        "vestibular disorders",
        "screen reader users",
      ],
    },
    {
      id: "2.2.3",
      principle: "Operable",
      guideline: "No Timing",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Content and functionality must not rely on time limits, unless they are essential. This removes barriers for users who need more time due to cognitive, physical, or language processing challenges and ensures a fully user-controlled experience.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/no-timing.html",
      tags: ["no time limits", "user control", "cognitive accessibility"],
      impacts: ["cognitive disabilities", "motor impairments", "older adults"],
    },
    {
      id: "2.2.4",
      principle: "Operable",
      guideline: "Interruptions",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Interruptions, such as system alerts or updates, must be able to be postponed or suppressed by the user—unless essential. This reduces distractions and supports users who may have difficulty resuming focus after disruption.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/interruptions.html",
      tags: ["alerts", "pop-ups", "notifications", "user control"],
      impacts: ["cognitive disabilities", "ADHD", "screen reader users"],
    },
    {
      id: "2.2.5",
      principle: "Operable",
      guideline: "Re-authenticating",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "When user sessions expire, any entered data should be preserved so users can re-authenticate without losing work. This is essential for users with slower input speeds, motor disabilities, or cognitive impairments who may take longer to complete tasks.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/re-authenticating.html",
      tags: ["session timeout", "form data", "user session", "preservation"],
      impacts: ["motor impairments", "cognitive disabilities", "older adults"],
    },
    {
      id: "2.2.6",
      principle: "Operable",
      guideline: "Timeouts",
      level: "AAA",
      version: "WCAG 2.1",
      summary:
        "If a timeout causes data loss or the end of a session, users must be warned beforehand. This supports people with cognitive or physical impairments who may need more time to read, input, or process information.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/timeouts.html",
      tags: ["timeouts", "warnings", "user control", "session expiration"],
      impacts: ["cognitive disabilities", "motor disabilities", "slow typers"],
    },
    {
      id: "2.3.1",
      principle: "Operable",
      guideline: "Three Flashes or Below Threshold",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Web content must not flash more than three times in any one-second period unless it stays below the general flash and red flash thresholds. This reduces the risk of seizures in individuals with photosensitive epilepsy.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html",
      tags: ["flashing content", "epilepsy", "seizure risk", "animation"],
      impacts: ["photosensitive epilepsy", "seizure-prone users"],
    },
    {
      id: "2.3.2",
      principle: "Operable",
      guideline: "Three Flashes",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "No part of the content should flash more than three times per second, regardless of thresholds. This stricter requirement ensures maximum safety for users susceptible to seizures, eliminating flashing risk entirely.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/three-flashes.html",
      tags: ["flashing content", "animation", "visual effects", "epilepsy"],
      impacts: ["photosensitive epilepsy", "neurological disabilities"],
    },
    {
      id: "2.3.3",
      principle: "Operable",
      guideline: "Animation from Interactions",
      level: "AAA",
      version: "WCAG 2.1",
      summary:
        "Users must be able to disable non-essential animations triggered by interactions (e.g., parallax effects, transitions). This helps individuals with vestibular disorders or cognitive conditions who may experience disorientation or distraction from motion effects.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html",
      tags: ["animations", "motion", "parallax", "user preference"],
      impacts: [
        "vestibular disorders",
        "cognitive disabilities",
        "motion sensitivity",
      ],
    },
    {
      id: "2.4.1",
      principle: "Operable",
      guideline: "Bypass Blocks",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Provide a mechanism for users to skip repetitive content such as headers, navigation menus, or banners. This enables keyboard and screen reader users to access the main content quickly without navigating through redundant page elements each time.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html",
      tags: ["skip links", "navigation", "page structure", "keyboard access"],
      impacts: [
        "screen reader users",
        "keyboard-only users",
        "motor disabilities",
      ],
    },
    {
      id: "2.4.2",
      principle: "Operable",
      guideline: "Page Titled",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Each web page must have a descriptive title that accurately identifies its topic or purpose. Page titles are essential for screen reader users, browser tabs, and search engines to help users orient themselves and distinguish between pages.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/page-titled.html",
      tags: ["page title", "head element", "screen reader", "SEO"],
      impacts: ["screen reader users", "cognitive disabilities", "all users"],
    },
    {
      id: "2.4.3",
      principle: "Operable",
      guideline: "Focus Order",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Ensure that the keyboard focus moves through elements in a logical order that preserves meaning and operability. This allows users navigating via keyboard or assistive technology to follow content as intended without confusion or missed elements.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html",
      tags: ["focus management", "keyboard", "navigation order", "interaction"],
      impacts: [
        "screen reader users",
        "keyboard-only users",
        "cognitive disabilities",
      ],
    },
    {
      id: "2.4.4",
      principle: "Operable",
      guideline: "Link Purpose (In Context)",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "The purpose of each link must be clear from its link text or surrounding content. This helps users—especially those using screen readers—understand where a link will take them, even when browsing out of context (e.g., via a links list).",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context.html",
      tags: ["links", "context", "screen reader", "navigation"],
      impacts: ["screen reader users", "cognitive disabilities", "low vision"],
    },
    {
      id: "2.4.5",
      principle: "Operable",
      guideline: "Multiple Ways",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Provide at least two ways to locate a web page within a site, such as navigation menus, search functions, or a sitemap. This improves discoverability and supports users with cognitive, visual, or motor impairments in finding content more easily.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/multiple-ways.html",
      tags: ["navigation", "site structure", "search", "usability"],
      impacts: ["cognitive disabilities", "low vision", "motor disabilities"],
    },
    {
      id: "2.4.6",
      principle: "Operable",
      guideline: "Headings and Labels",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Headings and labels must describe the topic or purpose of content they introduce. Clear labeling helps users—especially those using screen readers or with cognitive disabilities—understand, locate, and interact with content more effectively.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html",
      tags: ["labels", "headings", "semantics", "clarity"],
      impacts: ["screen reader users", "cognitive disabilities", "low vision"],
    },
    {
      id: "2.4.7",
      principle: "Operable",
      guideline: "Focus Visible",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "A visible focus indicator must be provided when users navigate via keyboard. This allows users to clearly see which element is active or selected, making navigation more predictable and accessible for those not using a mouse.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html",
      tags: ["keyboard", "focus indicator", "navigation", "interaction"],
      impacts: ["keyboard-only users", "low vision", "motor disabilities"],
    },
    {
      id: "2.4.8",
      principle: "Operable",
      guideline: "Location",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Provide users with information about their current location within a set of web pages, such as a breadcrumb trail or highlighted navigation. This helps users with cognitive or visual impairments understand site structure and maintain orientation while navigating.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/location.html",
      tags: ["breadcrumbs", "navigation", "orientation", "site hierarchy"],
      impacts: ["cognitive disabilities", "low vision", "screen reader users"],
    },
    {
      id: "2.4.9",
      principle: "Operable",
      guideline: "Link Purpose (Link Only)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Each link's purpose must be clear from the link text alone, without relying on surrounding context. This supports users who navigate through lists of links in screen readers and need meaningful, self-contained descriptions.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-link-only.html",
      tags: ["links", "navigation", "context-free", "screen reader"],
      impacts: ["screen reader users", "cognitive disabilities"],
    },
    {
      id: "2.4.10",
      principle: "Operable",
      guideline: "Section Headings",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Use section headings to organize content into logical regions. Proper use of headings helps users—especially those using screen readers or with cognitive challenges—understand structure, skim pages, and find information efficiently.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/section-headings.html",
      tags: ["headings", "structure", "semantics", "navigation"],
      impacts: ["screen reader users", "cognitive disabilities", "low vision"],
    },
    {
      id: "2.4.11",
      principle: "Operable",
      guideline: "Focus Not Obscured (Minimum)",
      level: "AA",
      version: "WCAG 2.2",
      summary:
        "When an element receives keyboard focus, it must be at least partially visible on the screen. This prevents hidden or obstructed focus indicators, ensuring users can see and track their position during keyboard navigation.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html",
      tags: ["focus visibility", "keyboard", "interaction", "UI feedback"],
      impacts: ["keyboard-only users", "low vision", "screen magnifier users"],
    },
    {
      id: "2.4.12",
      principle: "Operable",
      guideline: "Focus Not Obscured (Enhanced)",
      level: "AAA",
      version: "WCAG 2.2",
      summary:
        "When an element receives focus, it must be fully visible and not hidden at all by other content. This enhanced version of 2.4.11 ensures that the entire focused element is perceivable, supporting precise interaction for all users.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-enhanced.html",
      tags: ["focus indicator", "obstruction", "UI visibility", "keyboard"],
      impacts: ["keyboard-only users", "low vision", "motor disabilities"],
    },
    {
      id: "2.4.13",
      principle: "Operable",
      guideline: "Focus Appearance",
      level: "AAA",
      version: "WCAG 2.2",
      summary:
        "The visible focus indicator must be highly perceivable, occupying enough area and contrast to be easily detected. This supports users who rely on keyboard navigation and need a strong visual cue to follow their location on screen.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html",
      tags: ["focus style", "contrast", "keyboard navigation", "UI feedback"],
      impacts: ["low vision", "keyboard-only users", "motor impairments"],
    },
    {
      id: "2.5.1",
      principle: "Operable",
      guideline: "Pointer Gestures",
      level: "A",
      version: "WCAG 2.1",
      summary:
        "All complex gestures that require multiple fingers or path-based movement must have a simple alternative (e.g., tap or click). This ensures users with limited mobility or those using assistive tech can still activate key functionality.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html",
      tags: ["touch interaction", "gesture control", "motor accessibility"],
      impacts: [
        "motor disabilities",
        "switch device users",
        "touchscreen users",
      ],
    },
    {
      id: "2.5.2",
      principle: "Operable",
      guideline: "Pointer Cancellation",
      level: "A",
      version: "WCAG 2.1",
      summary:
        "Interactions triggered by pointer input must not occur until the user completes the action (e.g., releasing the finger or mouse). This prevents accidental activation and benefits users with tremors, mobility impairments, or unsteady hand control.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html",
      tags: ["input control", "touch", "mouse", "error prevention"],
      impacts: ["motor disabilities", "users with tremors", "older adults"],
    },

    {
      id: "2.5.3",
      principle: "Operable",
      guideline: "Label in Name",
      level: "A",
      version: "WCAG 2.1",
      summary:
        "The accessible name of a UI component must include the visible text label. This ensures voice input users can activate elements by speaking their visible labels, and screen reader users receive consistent information across modalities.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html",
      tags: [
        "labels",
        "voice control",
        "speech recognition",
        "naming consistency",
      ],
      impacts: [
        "speech input users",
        "screen reader users",
        "cognitive disabilities",
      ],
    },
    {
      id: "2.5.4",
      principle: "Operable",
      guideline: "Motion Actuation",
      level: "A",
      version: "WCAG 2.1",
      summary:
        "If functionality is triggered by device motion (like shaking or tilting), an alternative interface must be provided. This ensures users who cannot perform physical gestures—due to motor impairments or device limitations—can still operate all functions.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation.html",
      tags: ["motion", "gesture", "accessibility", "device input"],
      impacts: ["motor disabilities", "mobile users", "assistive device users"],
    },
    {
      id: "2.5.5",
      principle: "Operable",
      guideline: "Target Size (Enhanced)",
      level: "AAA",
      version: "WCAG 2.1",
      summary:
        "Pointer targets must be at least 44 by 44 CSS pixels, unless spacing or presentation makes it unnecessary. Larger targets help users with limited dexterity, tremors, or touchscreen devices activate controls accurately and avoid errors.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html",
      tags: ["target size", "touch", "accuracy", "UI design"],
      impacts: ["motor disabilities", "older adults", "mobile users"],
    },
    {
      id: "2.5.6",
      principle: "Operable",
      guideline: "Concurrent Input Mechanisms",
      level: "AAA",
      version: "WCAG 2.1",
      summary:
        "Web content must support multiple input methods—keyboard, mouse, voice, and touch—without disabling any by default. This ensures flexibility and compatibility for users who rely on assistive tech or alternate navigation devices.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/concurrent-input-mechanisms.html",
      tags: ["multi-input", "compatibility", "keyboard", "touch", "mouse"],
      impacts: ["assistive tech users", "motor disabilities", "older adults"],
    },
    {
      id: "2.5.7",
      principle: "Operable",
      guideline: "Dragging Movements",
      level: "AA",
      version: "WCAG 2.2",
      summary:
        "Any functionality that requires dragging must also be accessible using a simple pointer interaction (e.g., tap or click). This helps users who have difficulty with precise dragging motions due to motor impairments or limited mobility.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html",
      tags: ["drag-and-drop", "interaction", "pointer input", "UI control"],
      impacts: ["motor disabilities", "switch users", "touchscreen users"],
    },
    {
      id: "2.5.8",
      principle: "Operable",
      guideline: "Target Size (Minimum)",
      level: "AA",
      version: "WCAG 2.2",
      summary:
        "Interactive elements must have a minimum target size of 24 by 24 CSS pixels unless there’s sufficient spacing or alternative methods. This helps users with limited precision—especially on mobile devices—avoid missed clicks or errors.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
      tags: ["target size", "tap area", "touch interface", "hit area"],
      impacts: ["motor disabilities", "older adults", "touchscreen users"],
    },
    {
      id: "3.1.1",
      principle: "Understandable",
      guideline: "Language of Page",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "The default human language of the page must be programmatically indicated (e.g., using the `lang` attribute). This allows screen readers to pronounce text correctly and enables language-specific tools to provide accurate support.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html",
      tags: [
        "language",
        "screen reader",
        "internationalization",
        "html attributes",
      ],
      impacts: [
        "screen reader users",
        "multilingual users",
        "language learners",
      ],
    },
    {
      id: "3.1.2",
      principle: "Understandable",
      guideline: "Language of Parts",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "When a passage of text uses a language different from the page’s default, it must be programmatically marked. This helps screen readers switch pronunciations and ensures proper interpretation of multilingual content.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html",
      tags: [
        "multilingual",
        "pronunciation",
        "language switching",
        "internationalization",
      ],
      impacts: [
        "screen reader users",
        "multilingual users",
        "language learners",
      ],
    },
    {
      id: "3.1.3",
      principle: "Understandable",
      guideline: "Unusual Words",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Provide a mechanism (such as a glossary or tooltip) to explain words or phrases used in an unusual or limited context. This helps users unfamiliar with jargon, idioms, or technical terms understand the content more effectively.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/unusual-words.html",
      tags: ["glossary", "terminology", "jargon", "clarity"],
      impacts: [
        "cognitive disabilities",
        "language learners",
        "general public",
      ],
    },
    {
      id: "3.1.4",
      principle: "Understandable",
      guideline: "Abbreviations",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Provide expansions or definitions for abbreviations and acronyms either on first use or via accessible methods (e.g., tooltips, glossaries). This ensures users unfamiliar with shorthand can understand the intended meaning.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/abbreviations.html",
      tags: ["abbreviations", "acronyms", "clarity", "terminology"],
      impacts: [
        "cognitive disabilities",
        "language learners",
        "screen reader users",
      ],
    },
    {
      id: "3.1.5",
      principle: "Understandable",
      guideline: "Reading Level",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Ensure that text is written at or below a lower secondary education reading level, or provide simplified versions. This helps users with cognitive or learning disabilities comprehend information without confusion or overload.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html",
      tags: ["plain language", "readability", "comprehension", "literacy"],
      impacts: [
        "cognitive disabilities",
        "language learners",
        "general public",
      ],
    },
    {
      id: "3.1.6",
      principle: "Understandable",
      guideline: "Pronunciation",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Where pronunciation is critical to understanding (e.g., for words that are ambiguous), provide a method for users to access pronunciation guidance. This benefits users with cognitive or language challenges or those learning new words.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/pronunciation.html",
      tags: ["pronunciation", "clarity", "learning support", "audio"],
      impacts: [
        "cognitive disabilities",
        "language learners",
        "screen reader users",
      ],
    },
    {
      id: "3.2.1",
      principle: "Understandable",
      guideline: "On Focus",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "When a user interface component receives focus (e.g., via keyboard), it must not trigger a major change in context such as navigation, form submission, or modal opening. This prevents unexpected behavior for keyboard and assistive tech users.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html",
      tags: [
        "focus behavior",
        "keyboard access",
        "user control",
        "form elements",
      ],
      impacts: [
        "keyboard-only users",
        "motor disabilities",
        "screen reader users",
      ],
    },
    {
      id: "3.2.2",
      principle: "Understandable",
      guideline: "On Input",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Changing a form control (e.g., selecting a dropdown option) must not automatically trigger a change of context like submitting the form, opening a new window, or navigating to another page. Users should always remain in control of navigation.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/on-input.html",
      tags: ["form behavior", "user control", "interaction", "input fields"],
      impacts: [
        "cognitive disabilities",
        "motor impairments",
        "screen reader users",
      ],
    },
    {
      id: "3.2.3",
      principle: "Understandable",
      guideline: "Consistent Navigation",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Navigation mechanisms that are repeated across pages must appear in the same relative order each time. This predictable structure helps users—especially those with cognitive impairments—learn and reliably navigate websites.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html",
      tags: ["navigation", "predictability", "site structure", "menus"],
      impacts: [
        "cognitive disabilities",
        "screen reader users",
        "general usability",
      ],
    },
    {
      id: "3.2.4",
      principle: "Understandable",
      guideline: "Consistent Identification",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "Components that have the same functionality across a website must be identified consistently. For example, links or buttons that lead to the same action should use the same labels. This ensures familiarity and reduces confusion.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/consistent-identification.html",
      tags: ["consistency", "labels", "navigation", "usability"],
      impacts: ["cognitive disabilities", "screen reader users", "all users"],
    },
    {
      id: "3.2.5",
      principle: "Understandable",
      guideline: "Change on Request",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Major changes of context (like page loads or modals) should only occur after a user explicitly requests them. This provides maximum control and prevents disorientation caused by unexpected shifts, especially for users with cognitive or mobility impairments.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/change-on-request.html",
      tags: ["user control", "interaction", "modal", "navigation"],
      impacts: [
        "cognitive disabilities",
        "motor disabilities",
        "screen reader users",
      ],
    },
    {
      id: "3.2.6",
      principle: "Understandable",
      guideline: "Consistent Help",
      level: "A",
      version: "WCAG 2.2",
      summary:
        "If help mechanisms (like contact info, live chat, or instructions) are available, they should appear in the same relative location across pages. This predictability supports users who depend on help to complete tasks or resolve issues.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html",
      tags: ["help", "support", "consistency", "predictability"],
      impacts: ["cognitive disabilities", "new users", "general usability"],
    },
    {
      id: "3.3.1",
      principle: "Understandable",
      guideline: "Error Identification",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "When a user makes an input error (e.g., invalid form field), the error must be clearly identified and described to the user in text. This ensures users understand what went wrong and how to correct it, supporting accessibility in forms.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html",
      tags: ["form errors", "error messages", "input validation", "feedback"],
      impacts: ["cognitive disabilities", "low vision", "screen reader users"],
    },
    {
      id: "3.3.2",
      principle: "Understandable",
      guideline: "Labels or Instructions",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Forms and interactive elements must include clear labels or instructions to inform users how to complete input fields or select options. This helps users avoid mistakes and improves accessibility for people with cognitive or vision impairments.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html",
      tags: ["form labels", "instructions", "forms", "input fields"],
      impacts: ["cognitive disabilities", "low vision", "screen reader users"],
    },
    {
      id: "3.3.3",
      principle: "Understandable",
      guideline: "Error Suggestion",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "When users make errors in forms, provide suggestions for correcting the input. This helps users—especially those with cognitive or learning disabilities—understand what changes are needed to proceed successfully.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html",
      tags: ["error handling", "form validation", "usability", "guidance"],
      impacts: [
        "cognitive disabilities",
        "learning disabilities",
        "screen reader users",
      ],
    },
    {
      id: "3.3.4",
      principle: "Understandable",
      guideline: "Error Prevention (Legal, Financial, Data)",
      level: "AA",
      version: "WCAG 2.0",
      summary:
        "For forms involving legal, financial, or data-related commitments, provide mechanisms to review, correct, and confirm input before final submission. This minimizes risk for users who may enter incorrect information unintentionally.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html",
      tags: ["confirmation", "review", "form errors", "data accuracy"],
      impacts: [
        "cognitive disabilities",
        "all users",
        "high-risk interactions",
      ],
    },
    {
      id: "3.3.5",
      principle: "Understandable",
      guideline: "Help",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Provide context-sensitive help for forms or complex interactions. This might include tooltips, inline guidance, or links to support content. It assists users with processing challenges or those unfamiliar with the form structure.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/help.html",
      tags: ["help", "support", "tooltips", "form assistance"],
      impacts: ["cognitive disabilities", "new users", "screen reader users"],
    },
    {
      id: "3.3.6",
      principle: "Understandable",
      guideline: "Error Prevention (All)",
      level: "AAA",
      version: "WCAG 2.0",
      summary:
        "Allow all users to review, confirm, and correct input before finalizing any submission. This applies broadly—not just to financial or legal data—and ensures that errors can be caught and fixed before consequences occur.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html",
      tags: ["confirmation", "review", "error handling", "input validation"],
      impacts: [
        "cognitive disabilities",
        "motor impairments",
        "general usability",
      ],
    },
    {
      id: "3.3.7",
      principle: "Understandable",
      guideline: "Redundant Entry",
      level: "A",
      version: "WCAG 2.2",
      summary:
        "Users must not be required to re-enter the same information multiple times in a process unless essential. Reduce repetitive tasks to support users with memory issues, mobility challenges, or slow input methods.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html",
      tags: ["form efficiency", "input reuse", "usability", "repetition"],
      impacts: ["cognitive disabilities", "motor disabilities", "slow typers"],
    },
    {
      id: "3.3.8",
      principle: "Understandable",
      guideline: "Accessible Authentication (Minimum)",
      level: "AA",
      version: "WCAG 2.2",
      summary:
        "Authentication processes must not rely only on cognitive function (e.g., solving puzzles, remembering passwords). Provide alternatives such as copy/paste, password managers, or biometric input to accommodate users with cognitive impairments.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html",
      tags: ["authentication", "login", "cognitive load", "security"],
      impacts: ["cognitive disabilities", "dyslexia", "older adults"],
    },
    {
      id: "3.3.9",
      principle: "Understandable",
      guideline: "Accessible Authentication (Enhanced)",
      level: "AAA",
      version: "WCAG 2.2",
      summary:
        "Authentication must be achievable without relying on cognitive tests of any kind. This means no memorization, puzzles, or problem-solving should be required—only simple, accessible methods like passkeys, biometrics, or device-based solutions.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-enhanced.html",
      tags: ["authentication", "cognitive accessibility", "login", "security"],
      impacts: [
        "cognitive disabilities",
        "dyslexia",
        "older adults",
        "assistive tech users",
      ],
    },
    {
      id: "4.1.1",
      principle: "Robust",
      guideline: "Parsing",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "Ensure that web content uses well-formed markup—no duplicate IDs, unclosed tags, or incorrect nesting. Proper parsing ensures assistive technologies can accurately interpret the page, maintaining reliability across platforms and devices.",
      w3cLink: "https://www.w3.org/WAI/WCAG22/Understanding/parsing.html",
      tags: ["HTML", "syntax", "markup", "code quality"],
      impacts: [
        "screen reader users",
        "assistive technology",
        "cross-browser users",
      ],
    },
    {
      id: "4.1.2",
      principle: "Robust",
      guideline: "Name, Role, Value",
      level: "A",
      version: "WCAG 2.0",
      summary:
        "All UI components must expose their name, role, and state/value through the accessibility API. This enables assistive technologies like screen readers to interact meaningfully with custom elements, sliders, buttons, and inputs.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html",
      tags: ["ARIA", "accessibility API", "custom components", "semantics"],
      impacts: [
        "screen reader users",
        "keyboard users",
        "assistive technology",
      ],
    },
    {
      id: "4.1.3",
      principle: "Robust",
      guideline: "Status Messages",
      level: "AA",
      version: "WCAG 2.1",
      summary:
        "Status messages (e.g., 'form submitted', 'error occurred') must be programmatically conveyed to assistive technologies without moving focus. This helps users who cannot visually detect changes or alerts receive critical feedback.",
      w3cLink:
        "https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html",
      tags: ["status messages", "live regions", "ARIA", "notifications"],
      impacts: ["screen reader users", "blind users", "cognitive disabilities"],
    },
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
