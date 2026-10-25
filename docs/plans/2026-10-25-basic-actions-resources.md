# BASIC action and resource primitives — batches 68–71

Continue from exact retained source67 6b74eb8a6db3f12748a6f861add14e0b60a28e4c and site67 bed1bc037efc97d6ef3288bc0c1674523557d2ad. No merge/deploy. Reuse current worktrees and pinned tools. All previous project rules/gates remain.

## Inventory and selection

- Candidate74 action-cooldown: separate service/tick and try operations, zero period allowed, availability supplied by caller. Existing BASIC damage-rules combines health/hit/recovery and timed-status owns lifetime/phase, neither supplies this interface.
- Candidate75 approach-target deferred, not completed: BASIC ai/waypoint-route lines3210–3250 already implements signed distance/clamped step with arrival. Reuse that code rather than a duplicate one-axis entry.
- Candidate76 Manhattan-distance deferred, not completed: BASIC ai/nearest-target already computes widened Manhattan sums, compared to whole target set. No standalone BASIC arithmetic wrapper for quota.
- Candidate77 resource-wallet: one scalar resource, saturating refill, atomic affordable spending. Existing inventory-stacks rejects an excessive addition; this deliberately accepts/clamps refills and avoids category arrays. Clear behavioural difference.
- Candidate78 score-counter: retain unsigned16-bit encoding and configurable cap, checked wide award, exact cap vs clipping pulse, invalid state rejected. Existing high-score-insertion orders records; it does not accumulate awards.
- Candidate79 seeded-random: right-shifting8-bit Galois LFSR feedback180, seed0normalises1, explicit zero-corruption error, replay/save state. Existing shuffle-bag/weighted-choice consume caller choices, not random generation. Reuse assembly algorithm/contract and crossplatform article, explain 255cycle and nonuniform masking. No assumed AmigaBlitz/NESBASIC/FORTH support.

## Files and contracts before implementation

For each topic: C64 BASICV2, Spectrum BASIC, BBC BASIC under {system}/patterns/basic/framework/{topic}/{routines.bas,demo.bas,custom.bas,wrong.bas,repaired.bas,build.py,Makefile,README.md,verification/*}; corresponding three website MDX pages and normal/wrong captures. Shared isolated model cross-platform/patterns/framework/basic-resource-models/cases.py, four per-topic basic_oracle.py, scripts/verify-basic-resources.py/check-basic-resources.py and four test_basic_*.py tests. Retain older namespaces/evidence unchanged. No sharedlayout/schema/dependency changes.

1. Cooldown Rremaining/Qrequest/Aavailable/Preload/Moperation/Ggrant/Ovalid. initclearsall. M0tick clearsgrant and saturatingdecrements; M1try neveradvancestime and grants/reloads onlyR0,Qnonzero,Anonzero; inputbytes, M0/1. Invalid clearsG/O preservesR/inputs. Caller ticks independently ofrequests and checksavailability/createsaction immediately. Defaultperiod3 vs custom5; error ticks onlyonrequests. 12call trace plus16tables andinit. No actual hardwaretimer/resource reservation.
2. Wallet Bbalance/Aamount/Mmode/Oaccepted/Eerror. initzero. Validbytes, M0refill saturates255; M1spend atomic ifaffordable, unknownmode invalid. Zeroamountaccepted. E1invalid; E0valid even unaffordable. Wrong flips spendmode torefill beforehelper. Customfirstspend2vs5. Retain wholetrace and earlycheck, as finalbalancesmayconverge.
3. Score L/Hscorelow/high,A/Bawardlow/high,C/Dcaplow/high,Fclipped,Ovalid. initallzero; setcapafter. Validatebytes/current<=cap thenwideadd≤131070, saturatecap onlystrictlyabove; award/cappreserved. Wrong dropsawardhighbeforecall. Customcap999vs65535. Observerpackedbytes, BASICintermediatewide; wideBASICscalar alternative explained. Scoreformat separate.
4. RNG Rstate/Sseed/Moperation/Ovalid. initzero. M0seednormalises0to1; M1next shiftsright, conditional XOR180 implemented arithmetic bitwalkportableacrossdialects. R0duringnext reportsinvalid/preserveszero, no silentrepair. Inputsbytes/M0/1. Normalexternal0/custom167 then8draws; wrong bypassesseed. Full255cycle/seedhostinvariants plusnativeboundary/sequential/save/restorestate. No claimofstatisticalindependence, entropy or longperiod.

## Verification and publication

Write independent algebraic/reference models and host invariants (absolute cooldown expiry, wallet conservation/cap, integerwide score, XORreference/cycle/replay), sixteen native boundary rows pertopic plus retained caller traces. Normal/custom/wrong/exactrepair on all3stockinterpreters, actual loadedprogram and completepacket/count/guards/completion/pixels, 2postcompletionframes; rejectchangedsource/observer/program/trace/image. Finishallsource/model/observer/Ruffbeforefreezing records. Atmost6independent jobs, distinctoutputs. Builderrorsprintactualstdout.

Per-topic twelve native variants+host+111negativecontrols; sixunchangeddevelopmentdesktop/phonechecks beforecommit. Push4ordinarydependent source/sitepairs, retainheads/attachmentattempts. Atfinaltipfullpublisher(old1314+12=1326units,old2876+32=2908artefacts),32newPRG/TAP+16BBCsourceidentities, fullsite230tests/unchanged73baseline/build, productionold282+24=306desktopphonechecks. Readactualoutcomes, don't assumeestimates. AllCIstatusesvisible/separate. Verifyremoteheads/tworecoverybundles,remove12completedbuilddirs/privateVSFs, then count/update117/153/queue/NEXT/state. Atcutoffsafecheckpoint/cleanup/pauseheartbeat.
