# Approved hardware render additions

Add the six approved BBC Micro, ZX81, Master System I, VIC-20, Electron and
800XL render sets to the existing static illustration catalogue. Preserve the
accepted page design and image component; this is a media/data extension.
The shared catalogue supplies system openings, matching Vault openings and
alternate views in the secondary image index. No 3D viewer is introduced.

Select the approved case-profile renders for BBC/ZX81/Master System and fitted
artwork renders for VIC/Electron/800XL. Publish responsive WebP derivatives with
hash-only public provenance. Validate each new studio receipt, image, native
checkpoint and input before conversion. Keep original CAD/reference assets out
of the public website. Retain VIC/C64 typeface credit and name the 800XL variant
explicitly on the Atari family article through a `vaultSystem` association.

The existing component/section direction follows the surrounding family design;
the frontend design skill's component exception applies, so no new layout,
branding, motion or image-gallery redesign is part of this change.

Validate normal unit/type/content checks, a production build, hardware-image
browser regressions at desktop/phone sizes and actual screenshots at desktop,
tablet and phone widths. Preserve unrelated website review artefacts. Commit
website work in this repository; subsequent model work belongs in the umbrella
asset library. Next model batch: CPC 464, short-case Atari ST and Game Boy Color.

## Verification

Prepared 30 retained views at three responsive widths: 90 publication WebPs.
The six new machines contribute 54 images; existing publication images retain
their framing. The new native/image receipt controls reject both a stale native
hash and a changed render. Public provenance contains hashes and dimensions,
without private source paths.

`npm run check` passes: 220 tests, type checks with no additions to the existing
73-error baseline, content/link checks and prepared assembler/player checks.
`npm run build` passes, including page frames and Pagefind. The initial build
started before image preparation completed; it was discarded and rerun after
the finished manifest was available. Six hardware browser tests pass against
the production preview, covering all eleven system/Vault openings at desktop
and phone sizes, alternate links, gallery accessibility and JavaScript disabled.

Screenshots of every new system illustration were inspected at 1440 and 390px;
VIC and the Atari family Vault opening were also checked at 768px. Whole cases,
caption wrapping, variant naming and credits are intact, without image overflow.
The existing family composition remains appropriate for this media extension.
The skill source lint has no findings. Its whole-page inspector flags existing
family eyebrows/rules/paper palette, picture/motion quotas and long-article
footer spacing. Those concern the inherited page design, not the inserted image
component; no broad redesign or extra motion was introduced for this task.

The required full CI browser suite caught the image index's inherited 32px
outer top padding, which conflicts with the shared-frame rule. The gallery
now leaves that opening space to Layout. Twelve targeted desktop/mobile tests
pass: the six existing hardware checks and the six gallery frame cases at
390, 1440 and 1920px. The full suite passed the hardware checks; its only six
failures were those gallery frame cases.
