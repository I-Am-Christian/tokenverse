# Publish Tokenverse to your own GitHub repository

Recommended repository: **`I-Am-Christian/Tokenverse`** (private initially).

## One-click Windows method

1. Install [Git](https://git-scm.com/downloads) and the [GitHub CLI](https://cli.github.com/) if not already installed.
2. Extract the entire project ZIP.
3. Double-click `publish-github-windows.bat` inside the extracted `tokenverse` directory.
4. If prompted, sign into GitHub. The script stages the project source, creates the new **private** repository, and pushes the files to the `main` branch. It will reuse the exact named repository if it already exists.

The script does not publish the game on the internet. GitHub stores its code; the multiplayer server needs a Node hosting service such as Render.

## Browser alternative

1. Visit https://github.com/new and create an empty **private** repository named `Tokenverse` on account `I-Am-Christian` (do not initialize with a README, since the ZIP already has one).
2. Upload all project source files (not `data/world.json`) using the GitHub web upload UI, preserving the directory structure, **or** push using Git:

```sh
git init -b main
git add -A
git commit -m "Initial Tokenverse multiplayer game source"
git remote add origin https://github.com/I-Am-Christian/Tokenverse.git
git push -u origin main
```

## What must stay private / out of Git

The `.gitignore` excludes `data/*.json`, `data/*.tmp`, `.env` and `node_modules/`. Local gameplay saves are not source files. Never commit wallet secrets, API keys, player credentials, private keys, or production databases.

## Deployment

Follow `README.md` and `render.yaml` to host the game as a Node.js Web Service. GitHub Pages cannot operate the Node/WebSocket multiplayer server. Local JSON saves may be wiped by ephemeral hosts, so use persistent storage before opening it to the public.