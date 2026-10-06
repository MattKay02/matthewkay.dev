#!/bin/sh
# Vercel's install step (see vercel.json). Vercel builds on Amazon Linux 2023,
# which is missing the system libraries headless Chrome needs to print the CV,
# so install those first, then the packages and Playwright's headless Chrome.
set -e
dnf install -y -q --setopt=strict=0 \
  nss nspr atk at-spi2-atk at-spi2-core cups-libs dbus-libs libdrm libxkbcommon \
  libX11 libxcb libXcomposite libXdamage libXext libXfixes libXrandr \
  mesa-libgbm pango cairo alsa-lib \
  || echo "dnf: some libraries did not install; the CV step will name any that are missing"
npm ci
npx playwright install chromium --only-shell
