# Loop UX Tools Privacy Policy

Three static pages that say what Loop UX's own Chrome extensions and Google Workspace add-ons do with data, served by GitHub Pages from `main`, root folder. Every store listing of these tools links to its tool's section. README.md is the overview for people.

## Layout

- `index.html`: the list of the policies. `chrome-extensions/index.html` and `workspace-add-ons/index.html`: the policies, with a section per tool.
- `page.css`, `nav.js`, `share.js` and `theme.js`: shared by the pages. `loopux/`: files from the Loop UX design system kit, copied unchanged.
- `assets/icons/`: each tool's 128 px icon from the Loop UX tool icon pack (`tool-icons/` in Loop-UX/Design-System), named after its section ID.
- Computer setup and the shared skills (`tools-privacy-policy`): Loop-UX/Handbook, `SETUP.md`.

## Rules

- Before any change, read the `tools-privacy-policy` skill (`Skills/tools-privacy-policy/` in Loop-UX/AI-Library). It holds every rule for these pages: what may be said on them, how a tool's section changes, the section IDs the store listings link to, the writing rules, and `scripts/check-pages.py`, which must pass before a push.
- This repository is public, and so are its history and its commit messages. Never put an ID, an account detail, a Cloud project name, a store item ID, an internal or personal email address, or anything only staff need to know in any file here.
- README.md stays the short overview (15 lines at most; the check counts them), and this file stays a pointer to the skill: the rules for the pages live there, never here.
