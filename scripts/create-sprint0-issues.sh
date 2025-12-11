#!/bin/bash

REPO="qw8aminute/studio"
PROJECT="sprint0"

echo "🚀 Creating Sprint 0 issues for $REPO …"

create_issue() {
  local TITLE="$1"
  local BODY="$2"
  local LABELS="$3"

  gh issue create \
    --repo "$REPO" \
    --title "$TITLE" \
    --body "$BODY" \
    --label "$LABELS" \
    --project "$PROJECT" >/dev/null

  echo "Created issue: $TITLE"
}

# -------------------------------
#  EPICS
# -------------------------------

create_issue "[EPIC] Mini Templates Engine" "
Goal: Build & ship the first set of reusable mini templates to establish QD Creator Studio.

- [ ] Define initial template backlog (KPI, D3, ROA/ROE, onboarding, email automation)
- [ ] Choose sprint0 templates #1 and #2
- [ ] Define naming convention and folder structure
- [ ] Decide demo data conventions
- [ ] Document the 'Template Done' checklist
" "epic,engine:mini-templates,sprint0"

create_issue "[EPIC] Tune-Up Engine" "
Goal: Launch a clear, repeatable Tune-Up service that ABQ businesses can buy.

- [ ] Define the standard Tune-Up package
- [ ] Create 1-page digital flyer
- [ ] Define Nextdoor outreach cadence
- [ ] Define in-person local outreach
- [ ] Document delivery workflow + artifacts
" "epic,engine:tune-up,sprint0"

create_issue "[EPIC] Brand & Content Engine" "
Goal: Establish ABQ-flavored content streams for Studio, Drumcanon, and freelance.

- [ ] Choose 10 starter ABQ photos
- [ ] Define posting cadences for ABQ, ThirdAI, Studio
- [ ] Stand up minimal Drumcanon visuals landing
- [ ] Document weekly content ritual
" "epic,engine:brand,sprint0"

create_issue "[EPIC] Micro Teaching Engine" "
Goal: Build and schedule the first workshop: 'AI for Busy Parents.'

- [ ] Lock topic, promise, price
- [ ] Draft outline and slides
- [ ] Set up Eventbrite event
- [ ] Define payment flow (Venmo/Zelle)
- [ ] Build promotion plan
" "epic,engine:micro-teach,sprint0"

create_issue "[EPIC] Ops & Weekly Rhythm" "
Goal: Create a simple weekly operating rhythm.

- [ ] Define Monday–Sunday focus days
- [ ] Block daily 30-minute outreach
- [ ] Set weekly review slot
- [ ] Choose tool for tracking (Notion/Trello)
" "epic,ops,sprint0"

# -------------------------------
# STORIES — Mini Templates
# -------------------------------

create_issue "[STORY] MT-1 Template Backlog & Priorities" "
Goal: Capture and prioritize first-wave Studio templates.

- [ ] List all template ideas
- [ ] Score by effort + demand
- [ ] Choose 3 top ROI templates
- [ ] Save to /docs/templates-backlog.md
" "story,engine:mini-templates,sprint0"

create_issue "[STORY] MT-2 Build & Publish KPI Template" "
Goal: Ship the first template and wire it across platforms.

- [ ] Build KPI Dashboard Template
- [ ] Export 3 screenshots
- [ ] Write short description
- [ ] Publish to Gumroad
- [ ] Add to Fiverr gallery
- [ ] Add to Upwork portfolio
- [ ] Log link in /docs/shipped-templates.md
" "story,engine:mini-templates,sprint0"

# -------------------------------
# STORIES — Tune-Up
# -------------------------------

create_issue "[STORY] TU-1 Create Tune-Up Flyer" "
Goal: Build a single-page visual that explains the Tune-Up service.

- [ ] Define offer
- [ ] Write 3–5 outcome bullets
- [ ] Add visuals
- [ ] Add CTA
- [ ] Export PDF + PNG
" "story,engine:tune-up,sprint0"

create_issue "[STORY] TU-2 Nextdoor Outreach Cadence" "
Goal: Turn Nextdoor into a lead engine.

- [ ] Draft intro post
- [ ] Draft example/before-after post
- [ ] Draft soft promo post
- [ ] Build 3-post/week cadence
- [ ] Save templates in /docs/outreach-nextdoor.md
" "story,engine:tune-up,sprint0"

create_issue "[STORY] TU-3 Tune-Up Delivery Checklist" "
Goal: Ensure every Tune-Up produces portfolio-ready artifacts.

- [ ] Define before/after capture process
- [ ] Create Loom walkthrough script
- [ ] Write 1-paragraph case study template
- [ ] Save as /docs/tuneup-delivery-checklist.md
" "story,engine:tune-up,sprint0"

# -------------------------------
# STORIES — Brand & Content Engine
# -------------------------------

create_issue "[STORY] BC-1 Select & Prep ABQ Photo Set" "
Goal: Build a starter library of ABQ visuals.

- [ ] Select 10 images
- [ ] Light edits
- [ ] Write micro-stories
- [ ] Save into /assets/abq-pack-01/
" "story,engine:brand,sprint0"

create_issue "[STORY] BC-2 Define Content Cadence" "
Goal: Define separate but consistent content for ABQ, ThirdAI, Studio.

- [ ] Define ABQ cadence
- [ ] Define ThirdAI cadence
- [ ] Define Studio cadence
- [ ] Document in /docs/content-cadence.md
" "story,engine:brand,sprint0"

create_issue "[STORY] BC-3 Drumcanon Visual Landing" "
Goal: Build a minimal Drumcanon landing for creative identity.

- [ ] Choose layout/theme
- [ ] Add 5 ABQ images
- [ ] Add short text statement
- [ ] Link Drumcanon in bios
" "story,engine:brand,sprint0"

# -------------------------------
# STORIES — Micro Teaching
# -------------------------------

create_issue "[STORY] MTG-1 Design AI for Busy Parents Workshop" "
Goal: Build teachable workshop structure.

- [ ] Define parent persona
- [ ] Draft outline
- [ ] Build slides
- [ ] Define live demos
" "story,engine:micro-teach,sprint0"

create_issue "[STORY] MTG-2 Eventbrite & Promo Setup" "
Goal: Enable signups and promotion.

- [ ] Create Eventbrite event
- [ ] Add payment details
- [ ] Create promo graphic
- [ ] Draft 3 promo posts
" "story,engine:micro-teach,sprint0"

# -------------------------------
# STORIES — Ops
# -------------------------------

create_issue "[STORY] OPS-1 Weekly Operating Rhythm" "
Goal: Build structure for consistency.

- [ ] Assign focus days
- [ ] Add daily outreach block
- [ ] Add weekly retro slot
- [ ] Document in /docs/weekly-rhythm.md
" "story,ops,sprint0"

echo "🎉 Sprint 0 issues created successfully."
