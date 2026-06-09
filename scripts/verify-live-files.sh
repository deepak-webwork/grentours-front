#!/bin/bash
# Run from project root: bash scripts/verify-live-files.sh

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT" || exit 1

echo "Project: $ROOT"
echo ""

REQUIRED=(
  "lib/packageDetail.js"
  "lib/submitEnquiry.js"
  "components/booking/StayInquiryForm.jsx"
  "components/booking/DetailGallery.jsx"
  "components/booking/RelatedCardsSwiper.jsx"
  "components/booking/DetailAccordion.jsx"
  "components/listing/ListFilterHeader.jsx"
  "components/search/SearchModal.jsx"
  "components/enquiry/EnquiryProvider.jsx"
  "components/home/TravelMediaSection.jsx"
)

MISSING=0
for f in "${REQUIRED[@]}"; do
  if [ -f "$f" ]; then
    echo "OK   $f"
  else
    echo "MISS $f"
    MISSING=$((MISSING + 1))
  fi
done

echo ""
if [ "$MISSING" -gt 0 ]; then
  echo "$MISSING required file(s) missing."
  echo "Fix: git pull origin main   (if using git)"
  echo "  or upload lib/ and components/ from your local machine."
  exit 1
fi

echo "All required files present. Run: npm run build"
exit 0
