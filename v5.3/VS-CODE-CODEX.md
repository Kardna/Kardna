# Editing Kardna directly in VS Code with OpenAI Codex

## Install the extension

1. Open Visual Studio Code.
2. Open **Extensions** with `Ctrl+Shift+X`.
3. Search for **Codex** by OpenAI, or open the official OpenAI/ChatGPT extension listing.
4. Install it and sign in with the same ChatGPT account used for Codex access.
5. Open the `kardna-v5.3` folder in VS Code, not an individual file.

## Give Codex project access

1. Open the Codex panel from the VS Code activity bar.
2. Select the normal workspace/agent permission mode first.
3. Allow edits and terminal commands inside this repository when prompted.
4. Keep network or full-access permissions off unless a task genuinely needs them.

This repository includes `AGENTS.md`. Codex reads project instructions from that file so it knows Kardna’s branding, performance rules, game-folder format, player requirements, and proxy constraints.

## Start the project

Open the VS Code terminal in the project folder and run:

```powershell
npm install
npm run dev
```

Then open:

```text
http://localhost:8080
```

## Useful first prompt

```text
Read AGENTS.md and inspect the current Kardna repository before editing. Run the site on localhost:8080, preserve all existing games, and make changes directly in this workspace. After changes, run the relevant checks and summarize the exact files modified.
```

## Important limitation

The Codex extension can edit the same local files directly, but it does not automatically import this exact ChatGPT web conversation word-for-word. `AGENTS.md`, the repository files, and any prompt pasted into the extension provide the durable project context.
