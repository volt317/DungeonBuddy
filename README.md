# README.md

<div align="center">

[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-7c3aed?logo=obsidian)](#)
[![CodeQL](https://github.com/volt317/DungeonBuddy/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/volt317/DungeonBuddy/actions/workflows/github-code-scanning/codeql)
[![Build](https://github.com/volt317/DungeonBuddy/actions/workflows/build.yml/badge.svg)](https://github.com/volt317/DungeonBuddy/actions/workflows/build.yml)
[![Release](https://img.shields.io/github/v/release/volt317/DungeonBuddy?include_prereleases&label=release)](https://github.com/volt317/DungeonBuddy/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

<p align="center">
  <img src="assets/banner.png" alt="DungeonBuddy Banner"/>
</p>

---
## DungeonBuddy Abstract  

DungeonBuddy is a Plugin used inside of Obsidian. 
The high level idea of the tool is to import markdown documents and then 
split them into their own respective files. This allows key subjects to 
be branched apart. In almost all literature, including Player Handbooks or 
Campaign books, the table of contents is indicator for where these 
sections end and begin. They will naturally follow the cadence of the book.
In digital text, we see these as headers.

---

## Features

* Automatically splits markdown files into separate notes by headers (`#`).
* Preserves markdown formatting (e.g., `>`, `**`, lists, code blocks).
* Automatically creates folders in the vault as needed.
* Handles large markdown files (tested up to **1 MB**).
* Supports multiple sources like campaigns, homebrew, references, and misc.
* Optional deduplication and filename conflict resolution.
* Works entirely in the Obsidian vault, no external processing required.

---

## Install

1. **Download the plugin**

   * Clone or download the repo.
   * Find the `main.js` and the `manifest.json` files. **Do not include `node_modules`.**

2. **Copy to your vault**

   * Place the contents into:

     ```
     <Vault>/.obsidian/plugins/dungeonbuddy/
     ```

     It should contain:

     ```
     main.js  
     manifest.json  
     ```

3. **Dependencies**

   * Ensure you have the following (mostly for development/building, 
not for users):

     * Node.js 20+
     * TypeScript 5+
     * Obsidian API types (`@types/obsidian`) if building locally
   * Users installing the plugin into the vault do **not** need to install any dependencies.

4. **Enable the plugin**

   * Open Obsidian → Settings → Community Plugins → Enable DungeonBuddy. (you may need to enable community plugins)

---

## Usage

* After enabling, DungeonBuddy adds commands for each supported source type:

  * `Import Campaign Markdown`
  * `Import Reference Markdown`
  * `Import Homebrew Markdown`
  * `Import Misc Markdown`

* Commands can be accessed with the default shortcut (Ctrl+P)

* To import a markdown file:

  1. Select the appropriate command.
  2. Pick your markdown file.
  3. DungeonBuddy will parse headers and create structured notes in the vault.

**Notes:**

* The first-level headers (`#`) become new notes.
* Subheaders are demoted by one level (`##` → `#`) and included as content.
* Files already existing in the vault will get `_1`, `_2`, etc. appended 
automatically.
* Large files are processed efficiently using an internal buffer.

---

## File Size & Performance

* Tested on files **≥1 MB**.
* Uses an internal line buffer for each note to avoid running into 
Obsidian’s cache limits.
* Small delays are used when writing to the vault to avoid overwhelming 
Obsidian.

---

## Development

If you want to modify or rebuild:

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```
3. Build the plugin:

   ```bash
   npm run build
   ```

   This generates the `dist/` folder with `main.js`.
4. Copy the `dist/` folder to your vault’s plugin folder (see Install).

---

## Future Features / Ideas

* Auto-detect keywords and generate hyperlinks.
* Background processing for massive vaults.
* Support for multiple markdown formats and source types.
* Generalized for any large markdown files, not just D&D

---

## License

MIT

---

## Future
I will probably add a couple more features, like recursive header value
extraction and maybe even generalize the tool for general imports.

Please leave a like, or buy me a coffee if this helps.
DM me for questions.
