disposition: fix

No separate QUALITY BAR card was supplied; the approved manual brief and existing DESIGN.md provide the finish authority. Source inspection sampled the shared layouts, components, styles, tab controller, C64 alternative guide, catalogue route and outer Layout; the remaining guide content was reviewed through captures. This is an independent subagent review, without browser use.

## persistence

Pass. PRODUCT.md, DESIGN.md, the Setup surface brief and the written implementation plan exist. This is an explicitly approved extension of the existing family identity, with no image comp or new visual world. The brief explicitly records that the structure was agreed without a concept seed, so the absent seed is not an unapproved omission. No shipping raster was introduced. All ten required captures exist, show the named content from the document top, and contain usable desktop/mobile evidence. The supplied detector result is empty.

## fidelity

| Element or promise | Result | Evidence |
| --- | --- | --- |
| TYPE: Nebula manual hierarchy and mono commands | Match in production; contradicted in preview | Production titles, sections and prose form a clear manual hierarchy. Both preview captures lose its spacing and proportions: the page title is smaller than the component section headings, controls have no usable padding, and adjacent blocks touch. |
| MATERIAL: paper, ink, rules and square controls | Match | Production uses flat paper and ink without simulated physical effects, ornamental cards or invented raster material. |
| GROUND: approved paper | Match | Captures retain the family paper field specified by DESIGN.md, with lighter listings and dark command blocks. |
| THESIS: begin with the lesson; install when needed | Match | The index leads with three direct browser starts. Primary guides distinguish browser use, supplied-program playback and local rebuilding. |
| OWN-WORLD: manual reading mode | Contradicted on Setup routes | The index, alternative guides and ROM guide retain a prominent italic magazine-style SETUP GUIDE strip above the title. Primary machine guides omit it. The brief explicitly selects a plain manual opening; DESIGN.md reserves magazine voice for editorial containers. |
| STORY: run, change, save and continue | Match | All four primary guide captures explain a real result and how to change and preserve it; BASIC and assembly remain independent, and Amiga language routes stay distinct. |
| FIRST VIEWPORT: title, explanation, browser starts | Adaptation | Mobile contents move above the first section, as allowed by the approved requirement for useful mobile contents. Browser starts remain the first content section. The redundant Setup strip is the separate contradiction above. |
| FORM: progressive OS disclosure and navigation | Contradicted in alternative contents | Desktop alternative-guide TOCs list macOS, Windows and Linux headings and every hidden panel's steps together while only macOS is visible. The contents promise destinations that are currently concealed. The tab controller hides panels but does not coordinate those contents entries. |
| Return navigation | Contradicted | All four alternative desktop captures concatenate “Back to Setup GuideStart…” without a gap; C64 mobile reproduces it. The C64 and Amiga ROM sentences also join the preceding full stop directly to “How…”. Source confirms consecutive inline anchors and no matching back-section layout in setup.css. |
| Component previews | Contradicted | preview-desktop.png and preview-mobile.png show the actual components but do not reproduce their production spacing, type or control dimensions. The catalogue imports setup.css while its declarations depend on site aliases such as --space-*, --gutter and --font-family-read. Restore the required token context so the preview is a trustworthy specimen. |
| Truth and tool scope | Match within review evidence | The visible content assigns assembly to Asm198x and C64/Spectrum BASIC plus Amiga disk preparation to Build198x. It does not imply full browser rebuilding on every machine or introduce Docker. Execution evidence comes from the parent's checks; this visual review does not independently certify installations. |

## ceiling

The manual's available devices—readable measure, clear hierarchy, fine rules, square selection controls and machine ink—are present in the primary guides. No additional ornament, depth or image treatment is needed. The preview and alternative-guide navigation must attain that existing finish before shipping.

## material_fixes

1. OWN-WORLD / FIRST VIEWPORT: suppress the inherited SETUP GUIDE magazine strip for this manual layout; SetupLayout can use the outer Layout's existing masthead={false} option. Recapture index, an alternative and ROM pages.
2. Preview fidelity: give /catalogue/setup/ the same required token/alias context as production so title hierarchy, page inset, vertical rhythm, command padding and OS targets match the rendered components; recapture both preview files.
3. FORM / coverage: make alternative-guide contents omit hidden OS-panel headings or reveal the correct panel when selected, with visible/current contents consistent after OS changes; verify keyboard navigation and recapture the alternative guide.
4. Floor / spacing: separate each alternative guide's back and curriculum links with a responsive layout gap, and preserve whitespace before inline ROM links; verify the four alternatives at desktop and mobile widths.

## keep

Keep the direct browser starts, independent language routes, optional local installation, concrete change/save steps, restrained paper manual hierarchy and existing URLs.
