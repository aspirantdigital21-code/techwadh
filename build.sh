#!/usr/bin/env bash
set -euo pipefail

if [ "${CF_PAGES_BRANCH:-}" = "main" ]; then
    echo "Building production website..."
    hugo --gc --minify
else
    if [ -z "${CF_PAGES_URL:-}" ]; then
        echo "Error: CF_PAGES_URL is missing."
        exit 1
    fi

    echo "Building preview website..."
    hugo --environment preview --baseURL "$CF_PAGES_URL" --gc --minify
fi
