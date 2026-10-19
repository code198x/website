# SimCity Amiga captures

Four complete native MAME snapshots, unedited. The same cold-boot input schedule opens the held disk, starts an Easy city using its generated map, places residential/commercial/industrial zones and a coal plant, draws a short road, observes the annual budget and confirms it. No memory writes or game-code patches.

The manifest records exact media identities and tool hash. Game media, firmware and any temporary checkpoint are excluded. The final article captures all come from the full cold-boot script, not checkpoint replay. Set snapshot filenames/output directory locally before execution; no private collection paths are required in this published script. The frame counter begins when Lua registers its callback.

Rights in SimCity remain with its owners. These are our captures for criticism and review, not freely licensed game assets.

The manifest lists the exact launch flags, including zero autoboot delay and fresh task-specific configuration/state directories. Angle-bracket values describe locally supplied paths; they are not files distributed with this study. The scripted mouse mode selection uses `user_value`, and the mouse fields carry accumulated counters modulo 256. The headless environment uses SDL dummy video/audio. Set a bounded host timeout as well as the emulated time limit; this run completed at callback frame 17,740.
