#!/bin/sh
# Vercel's build step (see vercel.json).
#
# 1. Refresh the live data. If a source is down, the committed snapshot is used.
npm run github || echo "GitHub refresh failed: using the snapshot in src/data/github.json"
npm run stores || echo "Store check failed: using the snapshot in src/data/stores.json"
npm run frunt || echo "frunt figures failed: using the snapshot in src/data/frunt-stats.json"
npm run screens || echo "Screens feed failed: using the snapshot in src/data/screens.json"
# 2. Build the static site into out/, then print /cv to out/cv.pdf (fails the
#    deploy if the CV runs past one A4 page), photograph /og/ into out/og.png,
#    the whole board into out/board-*.jpg (Explore on phones), and the
#    case-study README visuals into out/readme/.
set -e
npm run build
npm run cv
npm run og
npm run board
npm run readme
