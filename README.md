QD Studio - Sprint Automation and Project Bootstrap
===================================================

This repository contains the automation scaffolding for the QD Studio (studio.qdfafo.com) build. The focus is simple: automate sprint setup, reduce cognitive load, and make it easy to spin up new cycles of work.

Contents
--------

1. create-labels.sh  
   Creates all labels needed for the Studio workflow:
   - epic
   - story
   - sprint0
   - engine:mini-templates
   - engine:tune-up
   - engine:brand
   - engine:micro-teach
   - ops

2. create-sprint0-issues.sh  
   Seeds Sprint 0 with its epics and stories. Titles are predefined. Running this script again will create duplicate issues because titles are used as unique keys.

3. set-sprint0-fields.sh  
   Updates each Sprint 0 project item with:
   - Priority
   - Size
   - Estimate
   - Iteration (e.g. Sprint 0)
   - Epic linkage for stories

   This script uses the GitHub CLI (gh) and jq to locate project items and apply field values.

Directory Structure
-------------------

studio/
  create-labels.sh
  create-sprint0-issues.sh
  set-sprint0-fields.sh
  README.md

How To Use These Scripts
------------------------

1. Run create-labels.sh  
   Only needed when new labels are introduced, or when bootstrapping the repository for the first time.

2. Run create-sprint0-issues.sh  
   Creates all Sprint 0 epics and stories inside the repository and assigns them to the specified project.

3. Run set-sprint0-fields.sh  
   Sets Priority, Size, Estimate, Iteration, and Epic relationships.

Requirements
-----------

- GitHub CLI (gh)
- jq
- Valid GitHub project configured for the sprint
- Authenticated GitHub session

Sprint Pattern
--------------

To create future sprints (Sprint 1, Sprint 2, etc.):

1. Copy the sprint0 scripts.
2. Rename them for the new sprint.
3. Adjust titles, iteration names, and epic links.
4. Run them in sequence: labels (if needed), issues, fields.

Purpose
-------

This repo exists to support high-frequency creative work by reducing the friction of starting a sprint. It enables an agile structure for a one-person studio and keeps overhead low while maximizing focus on output.

