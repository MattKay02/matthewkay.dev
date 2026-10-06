#!/bin/sh
# Vercel's build step (see vercel.json).
#
# 1. Refresh the live data. If a source is down, the committed snapshot is used.
npm run github || echo "GitHub refresh failed: using the snapshot in src/data/github.json"
npm run stores || echo "Store check failed: using the snapshot in src/data/stores.json"
# 2. Build the static site into out/, then print /cv to out/cv.pdf. The CV step
#    fails the deploy if the CV runs past one A4 page.
set -e
npm run build
npm run cv
