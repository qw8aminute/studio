#!/bin/bash

REPO="qw8aminute/studio"

echo "🏷  Creating labels in $REPO …"

create_label() {
  local NAME="$1"
  local COLOR="$2"
  local DESC="$3"

  gh label create "$NAME" \
    --repo "$REPO" \
    --color "$COLOR" \
    --description "$DESC" 2>/dev/null

  if [ $? -eq 0 ]; then
    echo "Created label: $NAME"
  else
    echo "Label '$NAME' already exists or could not be created (ignoring)."
  fi
}

create_label "epic" "5319E7" "High-level epic for Studio"
create_label "story" "0E8A16" "Deliverable user story"
create_label "sprint0" "BFD4F2" "First 7 days of launching Studio"

create_label "engine:mini-templates" "F9D0C4" "Mini templates engine"
create_label "engine:tune-up" "FEF2C0" "Tune-Up engine"
create_label "engine:brand" "C2F0C2" "Brand & content engine"
create_label "engine:micro-teach" "C5DEF5" "Micro teaching engine"

create_label "ops" "D4C5F9" "Operational / rhythm work"

echo "✅ Label creation script finished."
