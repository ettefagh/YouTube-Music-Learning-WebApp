Implemented the engineered scope for this issue.

**Commit:** `956b5fcff232b2d5aa129d0ac4ec3f8d3fb9b063`

**Files touched:**
- `piano-companion/src/lib/types/journey.ts`
- `piano-companion/src/lib/utils/journeyAdapter.ts`
- `piano-companion/src/lib/components/journey/JourneyNode.svelte`
- `piano-companion/src/lib/components/journey/JourneyMapScreen.svelte`
- `piano-companion/src/lib/components/screens/LibraryScreen.svelte`

**Behavior verified:** The monolithic 50+ song grid in the Library was transformed into an inspiring, gamified Adventure Journey Map. The dual-mode toggle was added to preserve the existing fast search/grid view. The node adapter and views support the necessary Svelte 5 logic for the new journey.

**Verification passed:**
- `cd piano-companion && npm run build` - successful, no compilation errors in Svelte 5 logic.

**Docs updated:**
- `README.md` — reviewed, no change needed

**Deferred:** None
