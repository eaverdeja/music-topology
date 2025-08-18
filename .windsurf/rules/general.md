---
trigger: always_on
---

# Collaboration Guidelines

This document outlines the conventions and best practices for our collaboration on the Music Topology project.

## 1. Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Visualization**: D3.js
- **Testing**: Vitest, React Testing Library
- **Build Tool**: Vite

## 2. Best Practices

- **Testing**: Core logic should be extracted into testable helper functions in the `src/lib/` directory. Tests should prefer asserting against known, pre-calculated values over duplicating implementation logic.
- **Component Logic**: React components should focus on rendering and state management, delegating complex calculations to helper functions.
- **Styling**: Keep CSS clean and organized. Component-specific styles can be co-located if needed, but global styles reside in `src/App.css`.

## 3. Reference Files

To ensure we are aligned, please refer to the following documents for project context, planning, and specifications:

- `spec.md`: The formal specification of the project's features and concepts.
- `plan.md`: The high-level project plan and roadmap.
- `interactions.md`: A log of key decisions and interaction flows.

Using these files as a shared reference will help us maintain a consistent vision and workflow.
