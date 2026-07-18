// Prompt skills: instruction packs injected into the model's system prompt
// when invoked with /name. Ported from the user's Claude skill library
// (morning, skill-creator, docx, pptx, xlsx, pdf) and adapted for a chat
// environment without code execution — the model produces content, complete
// HTML pages, or ready-to-run scripts instead of executing anything itself.

export interface PromptSkill {
  name: string
  description: string
  usage: string
  instructions: string
}

export const PROMPT_SKILLS: PromptSkill[] = [
  {
    name: 'morning',
    description: 'Render a morning brief as a styled single-file HTML page',
    usage: '/morning [notes about your day]',
    instructions: `Render the user's morning brief as ONE complete single-file HTML page, delivered in a single \`\`\`html code block they can save and open. This page is their 30-second morning glance: one calm view of the shape of the day.

You cannot fetch calendars or email here. Build the brief from: (1) whatever the user included in the invocation, (2) stored memories, (3) if you have neither, ask one short question for today's schedule/priorities before rendering.

LAYOUT — two full-bleed bands, content max-width 860px:
- Top band (wash #F9F9F7): small day-date line (e.g. "Friday · July 18 2026"), then ONE serif headline spoken like a friend handing them the day ("A steady climb until 2, then the day opens up."). Below it one SVG ~840x170: a single unbroken terrain stroke edge to edge, elevation = meeting load; a calm day flattens to still water — never invent mountains. Meeting dots sit ON the line (filled #2E2C27, r 6-13 by weight). Under the drawing, three left-aligned text columns ("acts": morning / midday / evening) with faint hairline dividers: bold time range, then one specific sentence each.
- Bottom band (bg #FCFCFB, hard edge line #E1E1DF between bands): two stacked lists, "Needs attention" then "Resolved". Per item: bold title ≤10 words, then one sentence with the ask and why it matters today. Faint grey numerals. Nothing in either list → one calm line: "Nothing needs you this morning."

COLOR — ink #2E2C27, ink-soft #6B6A63, ink-grey #B4B3A8, hairline #E4E3DC, clay #C6613F rationed to exactly ONE drawing accent (dawn sun, tension squiggle, flag). Serif (Georgia) for the headline only, system sans for everything else. No cards, chips, badges, buttons, footer, or timestamps. One media query at 640px: acts stack vertically.

VOICE — observe and hand over. Never command, apologize, pad ("you've got this!"), review, or narrate process. A quiet day is a quiet day.`,
  },
  {
    name: 'skill-creator',
    description: 'Design and install a new custom skill into Hermes',
    usage: '/skill-creator <what the skill should do>',
    instructions: `Help the user create a new reusable skill for this Hermes workspace. A skill is a named instruction pack invoked with /name that shapes how you respond.

Process:
1. Understand the job: what recurring task is this for, what does a great result look like, what inputs will invocations carry? Ask at most 2 short questions if genuinely unclear — otherwise draft.
2. Write the skill: a short kebab-case name, a one-line description, and focused instructions (150-400 words). Instructions should be written TO the model, contain concrete output format/structure/tone rules, and cover the 2-3 most likely failure modes. No filler like "be helpful".
3. Show the draft to the user in readable form, then SAVE it by emitting this tag exactly (it is parsed and installed automatically, then stripped from your visible reply):

<skill name="kebab-name" description="one line, under 120 chars">
the full instructions
</skill>

4. Confirm: tell the user the skill is installed and they can run it with /kebab-name.

To improve an existing custom skill, emit the tag with the same name — it overwrites. Never emit the tag until the user has seen the draft or explicitly said "just make it".`,
  },
  {
    name: 'docx',
    description: 'Author professional Word documents (content + generator script)',
    usage: '/docx <what document you need>',
    instructions: `The user needs a Word document. You cannot write files here, so deliver BOTH:
1. The complete document content, professionally structured (title, headings, body, tables) in markdown — ready to paste into Word or Google Docs.
2. When the document needs real formatting (TOC, letterhead, tracked layout), also offer a complete Node.js generator script using the docx npm package, in one code block, runnable with "npm install docx && node make-doc.js".

docx-js footguns to respect in any script you write:
- Page size defaults to A4; for US Letter set page: { size: { width: 12240, height: 15840 } } (DXA, 1440 = 1 inch).
- Tables need columnWidths on the table AND width on every cell, both WidthType.DXA, summing correctly.
- Table shading: ShadingType.CLEAR, never SOLID (renders black).
- Lists: use a numbering config with LevelFormat.BULLET — never a literal bullet character.
- ImageRun requires type: ("png", "jpg", ...). PageBreak must live inside a Paragraph.
- Never use \\n inside text — separate Paragraph elements.
- TOC entries require built-in HeadingLevel.* on headings.

Writing standards: match the genre (memo, letter, report, proposal); front-load the point; one idea per paragraph; tables for anything enumerable; professional font (Arial or Times New Roman) unless told otherwise. Ask for missing essentials (recipient, letterhead details, dates) instead of inventing them.`,
  },
  {
    name: 'pptx',
    description: 'Design slide decks (outline + pptxgenjs generator script)',
    usage: '/pptx <what deck you need>',
    instructions: `The user needs a presentation. You cannot write files here, so deliver:
1. A slide-by-slide outline: per slide — layout choice, title, visual concept, and the exact on-slide text (terse; slides are not documents). Vary layouts — never every section on the same title-and-bullets slide. Include speaker notes where they help.
2. On request (or when the deck is the true deliverable), a complete Node.js pptxgenjs script in one code block, runnable with "npm install pptxgenjs && node make-deck.js".

pptxgenjs footguns to respect in any script:
- Set pres.layout BEFORE adding slides; default canvas is 10 x 5.625 in ("LAYOUT_16x9"); off-canvas coordinates are silently accepted.
- Hex colors: never "#", never 8 digits — color: "FF0000". Alpha in hex corrupts the file; use transparency: 0-100.
- Never share one options/shadow object across two add* calls (mutated in place). One new pptxgen() per file.
- Lists: bullet: true per item, breakLine: true on all but the last; space with paraSpaceAfter, never a literal bullet char.
- Shadow offset must be >= 0 (use angle 270 to cast upward). letterSpacing is ignored — use charSpacing.
- Charts: use addChart() natively; set showTitle+title, showValue: true, chartColors from the palette; on stacked bars dataLabelPosition must be ctr/inEnd/inBase (outEnd corrupts). A combo series with a secondary axis needs BOTH valAxes and catAxes (two entries each) or PowerPoint discards the chart.
- Speaker notes: slide.addNotes(), never a text box. Text boxes have built-in padding — margin: 0 when aligning with shapes.

Design standards: one message per slide; strong typographic hierarchy; a consistent 3-4 color palette; data gets a chart, not a paragraph.`,
  },
  {
    name: 'xlsx',
    description: 'Build spreadsheets and financial models (data + openpyxl script)',
    usage: '/xlsx <what spreadsheet you need>',
    instructions: `The user needs a spreadsheet. You cannot write files here, so deliver:
1. The sheet design: tab names, column headers, and the data laid out as a markdown table (or CSV in a code block for easy import), with every formula written as a real formula (=SUM(B2:B9)), never a precomputed value.
2. For anything beyond a flat table, a complete Python openpyxl script in one code block, runnable with "pip install openpyxl && python make-sheet.py".

Non-negotiable standards (from the user's spreadsheet skill):
- Use formulas, never hardcoded results — the sheet must recalculate when inputs change.
- Follow the user's spec literally: exact tab names, exact headers, the formula they spelled out.
- Zero formula errors; guard denominators that can be zero (IFERROR / IF(x=0,...)).
- Prefer Excel-2007-era functions — SUMIFS, INDEX, MATCH, IFERROR, SUMPRODUCT. Avoid XLOOKUP/FILTER/SORT/UNIQUE/SEQUENCE (portability); do sorting/filtering in the script before writing cells.
- Document every assumption and hardcoded number where the reader sees it, with a source.
- Professional font (Arial / Times New Roman).
- Financial models: blue text (0,0,255) for hardcoded inputs, black for formulas, green for cross-sheet links; yellow fill for cells the user should edit. Currency $#,##0 with units in the header ("Revenue ($mm)"); negatives in parentheses; zeros as "-"; percentages stored as fractions (0.15 -> 15.0%); years as text. Every assumption in its own labeled cell referenced by formulas (=B5*(1+$B$6), never =B5*1.05); formulas consistent across every projection period.
- openpyxl gotchas for scripts: merged cells — write the top-left anchor only; quote sheet names containing spaces in references ('Assumptions Inputs'!$B$5); keep_vba=True when loading .xlsm.`,
  },
  {
    name: 'pdf',
    description: 'Work with PDFs — create, merge, split, extract, fill forms (pypdf scripts)',
    usage: '/pdf <what you need done>',
    instructions: `The user needs PDF work. You cannot open or write files here, so deliver ready-to-run Python scripts (pypdf / pdfplumber / reportlab), each in one code block with its pip install line, plus exact instructions for where to put the input files.

Recipes to draw on:
- Merge: pypdf PdfWriter, append pages from each PdfReader in order.
- Split / extract pages: one PdfWriter per output range.
- Rotate: page.rotate(90) (clockwise).
- Text extraction: pdfplumber for text AND tables (page.extract_table()); pypdf extract_text() for simple text.
- Watermark / stamp: pypdf page.merge_page(stamp_page) over each page.
- Create from scratch: reportlab canvas (or generate clean HTML and tell the user to print-to-PDF for rich layouts).
- Forms: pypdf reader.get_fields() to discover field names, writer.update_page_form_field_values() to fill; note checkboxes need their export value (often "/Yes"), not True.
- Encrypt/decrypt: writer.encrypt(password) / PdfReader(f, password=...).
- Scanned PDFs: OCR with ocrmypdf ("pip install ocrmypdf", needs tesseract) — one command: ocrmypdf in.pdf out.pdf.

Standards: scripts must be complete and runnable as-is (no placeholders except clearly marked file paths); state assumptions about the input; when a task could destroy content (in-place edits), have the script write to a NEW file. If the user pasted PDF text into chat, just do the work on it directly.`,
  },
]
