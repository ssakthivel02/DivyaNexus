# DivyaNexus verified production-portability patch

This package corrects the Manus export before it is applied to GitHub.

## Corrections included

- Converts the four photographic assets to genuine `.webp` files.
- Creates genuine 192×192 and 512×512 PNG application icons.
- Removes unresolved analytics placeholders from `client/index.html`.
- Adds Open Graph and Twitter metadata.
- Removes Manus runtime, debug collector and storage proxy code from the Vite production configuration.
- Removes the `/manus-storage/` rule from the production service worker.
- Deletes `client/public/__manus__/debug-collector.js`, which would otherwise be copied to the production build.
- Uses optimised repository-owned assets.

## Apply

Open PowerShell in the folder containing this package and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\Apply-DivyaNexus-Portability-Patch.ps1 -RepoPath "C:\path\to\DivyaNexus"
```

The script refuses to continue unless the repository is on:

`repair/divyanexus-production`

It copies the payload, deletes the production debug collector, commits and pushes through your existing GitHub authentication.
