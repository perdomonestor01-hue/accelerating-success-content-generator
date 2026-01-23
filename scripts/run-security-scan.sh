#!/bin/bash
# Quick security scan for this project
# Runs the global scan_secrets.py against this project directory

echo "🔒 Running security scan..."
python3 ~/agents/security-lib/scan_secrets.py "$(dirname "$0")/.."

if [ $? -eq 0 ]; then
    echo "✅ No secrets found - safe to commit"
else
    echo "❌ Secrets detected - DO NOT COMMIT until fixed"
    exit 1
fi
