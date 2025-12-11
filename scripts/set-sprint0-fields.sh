#!/bin/bash

# -------- CONFIG --------

OWNER="qw8aminute"
PROJECT_NUMBER=1         # <-- change if your sprint0 project number is not 1
ITERATION_VALUE="Sprint 0"  # <-- must match an Iteration option name in the project

REPO="qw8aminute/studio"

echo "🧩 Updating project fields for sprint0 items in $REPO (project #$PROJECT_NUMBER)…"

# -------- HELPERS --------

get_item_id() {
  local TITLE="$1"

  gh project item-list "$PROJECT_NUMBER" \
    --owner "$OWNER" \
    --format json |
    jq -r --arg TITLE "$TITLE" '
      # supports both { "items": [...] } and plain [ ... ]
      (.items // .)[]
      | select(.content.title == $TITLE)
      | .id
    '
}

update_item_fields() {
  local TITLE="$1"
  local PRIORITY="$2"
  local SIZE="$3"
  local ESTIMATE="$4"
  local EPIC_VALUE="$5"

  local ITEM_ID
  ITEM_ID=$(get_item_id "$TITLE")

  if [ -z "$ITEM_ID" ] || [ "$ITEM_ID" == "null" ]; then
    echo "⚠️  No project item found for: $TITLE"
    return
  fi

  ARGS=(--id "$ITEM_ID"
        --field "Priority=$PRIORITY"
        --field "Size=$SIZE"
        --field "Estimate=$ESTIMATE")

  # Only set Iteration if you configured a value
  if [ -n "$ITERATION_VALUE" ]; then
    ARGS+=(--field "Iteration=$ITERATION_VALUE")
  fi

  # Only set Epic for stories
  if [ -n "$EPIC_VALUE" ]; then
    ARGS+=(--field "Epic=$EPIC_VALUE")
  fi

  gh project item-edit "${ARGS[@]}" >/dev/null

  echo "✅ Updated: $TITLE  [Priority=$PRIORITY, Size=$SIZE, Estimate=$ESTIMATE, Epic=$EPIC_VALUE]"
}

# -------- EPICS (no Epic link set on these) --------

update_item_fields "[EPIC] Mini Templates Engine"      "High"   "L" "8"  ""
update_item_fields "[EPIC] Tune-Up Engine"             "High"   "L" "8"  ""
update_item_fields "[EPIC] Brand & Content Engine"     "High"   "L" "8"  ""
update_item_fields "[EPIC] Micro Teaching Engine"      "High"   "L" "8"  ""
update_item_fields "[EPIC] Ops & Weekly Rhythm"        "Medium" "M" "5"  ""

# -------- STORIES — Mini Templates --------

update_item_fields "[STORY] MT-1 Template Backlog & Priorities" \
  "Medium" "M" "3" "Mini Templates Engine"

update_item_fields "[STORY] MT-2 Build & Publish KPI Template" \
  "High" "M" "5" "Mini Templates Engine"

# -------- STORIES — Tune-Up --------

update_item_fields "[STORY] TU-1 Create Tune-Up Flyer" \
  "High" "M" "3" "Tune-Up Engine"

update_item_fields "[STORY] TU-2 Nextdoor Outreach Cadence" \
  "Medium" "M" "3" "Tune-Up Engine"

update_item_fields "[STORY] TU-3 Tune-Up Delivery Checklist" \
  "Medium" "S" "2" "Tune-Up Engine"

# -------- STORIES — Brand & Content Engine --------

update_item_fields "[STORY] BC-1 Select & Prep ABQ Photo Set" \
  "Medium" "S" "2" "Brand & Content Engine"

update_item_fields "[STORY] BC-2 Define Content Cadence" \
  "Medium" "M" "3" "Brand & Content Engine"

update_item_fields "[STORY] BC-3 Drumcanon Visual Landing" \
  "Medium" "M" "3" "Brand & Content Engine"

# -------- STORIES — Micro Teaching --------

update_item_fields "[STORY] MTG-1 Design AI for Busy Parents Workshop" \
  "High" "M" "5" "Micro Teaching Engine"

update_item_fields "[STORY] MTG-2 Eventbrite & Promo Setup" \
  "High" "S" "3" "Micro Teaching Engine"

# -------- STORIES — Ops --------

update_item_fields "[STORY] OPS-1 Weekly Operating Rhythm" \
  "High" "S" "2" "Ops & Weekly Rhythm"

echo "🎉 Finished updating sprint0 fields."
