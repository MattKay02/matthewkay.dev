#!/bin/sh
# Vercel's build step (see vercel.json).
#
# 1. Refresh the live data. If a source is down, the committed snapshot is used.
npm run github || echo "GitHub refresh failed: using the snapshot in src/data/github.json"
npm run stores || echo "Store check failed: using the snapshot in src/data/stores.json"
npm run frunt || echo "frunt figures failed: using the snapshot in src/data/frunt-stats.json"
npm run mgk || echo "MGKFitness figures failed: using the snapshot in src/data/mgk-stats.json"
npm run screens || echo "Screens feed failed: using the snapshot in src/data/screens.json"
# 2. Build the static site into out/, then photograph /og/ into out/og.png, the
#    whole board into out/board-*.jpg (Explore on phones), and the case-study
#    README visuals into out/readme/. Previews also print /cv to out/cv.pdf
#    (failing the deploy if it runs past one A4 page); production has no CV,
#    as it's emailed on request (src/cv/flags.ts).
set -e
# Drafts show on previews (src/case-studies/flags.ts reads NEXT_PUBLIC_VERCEL_ENV).
# Vercel only sets that for a known framework, and vercel.json names none.
export NEXT_PUBLIC_VERCEL_ENV="$VERCEL_ENV"
npm run build
if [ "$VERCEL_ENV" = "preview" ]; then node scripts/build-cv.mjs; fi
npm run og
npm run board
npm run readme
