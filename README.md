# ContractForge — Federal Contract File Builder

A browser-based tool for government contracting officers to build and manage federal contract files.

## Features

- **Document Checklist** — Tailored checklists for Commercial, SAT, Full & Open, and Construction contracts
- **FAR/DFARS Clause Builder** — 30+ pre-loaded clauses across mandatory, commercial, construction, and DFARS tabs
- **Folder Structure Generator** — Auto-generates a contract file folder tree for KTFileShare / CON-IT
- **SF-1449 Form Builder** — Pre-fills from contract info, supports all major blocks
- **DD-1155 Form Builder** — Line item support with auto-fill from contract info
- **PWS / SOW Builder** — Section-by-section PWS with task tracking and SOW narrative mode
- **AI Draft Assistant** — Claude-powered drafting of J&As, D&Fs, PNMs, evaluation criteria, and more
- **localStorage persistence** — All data saves automatically in the browser

---

## Project Structure

```
contractforge/
├── index.html          ← Main HTML shell and all panel markup
├── css/
│   └── styles.css      ← All styling and CSS variables
├── js/
│   ├── data.js         ← Checklist templates and FAR/DFARS clause data
│   ├── storage.js      ← localStorage save/load and file download helper
│   ├── contracts.js    ← Global state, contract creation, switchContract(), refreshUI()
│   ├── checklist.js    ← Checklist rendering and toggle logic
│   ├── clauses.js      ← FAR/DFARS clause builder
│   ├── folder.js       ← Folder tree generator and export
│   ├── forms.js        ← SF-1449, DD-1155, PWS/SOW form logic
│   ├── ai.js           ← AI assistant chat (Anthropic API)
│   └── nav.js          ← Panel navigation and app bootstrap (loaded last)
├── serve.py            ← One-command Python local server
└── README.md
```

**Script load order matters.** `index.html` loads the scripts in this order:
`data.js` → `storage.js` → `contracts.js` → `checklist.js` → `clauses.js` → `folder.js` → `forms.js` → `ai.js` → `nav.js`

---

## Running Locally

### Option A — Python server (recommended)

Requires Python 3 (pre-installed on macOS and most Linux distros).

```bash
cd contractforge
python3 serve.py
```

This opens `http://localhost:8000` in your browser automatically.

### Option B — VS Code Live Server

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Open the `contractforge/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

### Option C — Host on a web server

Copy the entire `contractforge/` folder to any static web host (Apache, Nginx, S3, GitHub Pages, etc.). No build step required.

> **Why can't I just open index.html directly?**  
> Browsers block loading separate JS/CSS files over `file://` for security reasons (CORS). Use one of the options above instead.

---

## Extending the App

### Add a new FAR clause

Edit `js/data.js` and add an entry to the appropriate array inside `CLAUSES`:

```javascript
{ num: 'FAR 52.XXX-X', title: 'Clause Title', desc: 'Short description.', tags: ['all'] },
```

### Add a checklist item

Edit `js/data.js` and add an entry to the appropriate phase array inside `CHECKLIST_TEMPLATES`:

```javascript
{ id: 'unique-id', label: 'Document label', ref: 'FAR X.XXX' },
```

### Add a new contract type

1. Add a new key to `CHECKLIST_TEMPLATES` in `js/data.js`
2. Add a label to `CONTRACT_TYPE_LABELS` in `js/data.js`
3. Add a `<option>` to the `#nc-type` select in `index.html`
4. Add a folder tree branch in `js/folder.js` → `_buildFolderTree()`

---

## Notes

- All data is stored in the browser's `localStorage`. Clearing browser data will erase contract files.
- The AI Assistant requires an internet connection and calls the Anthropic API.
- No data is sent to any server other than Anthropic's API (for AI messages only).
