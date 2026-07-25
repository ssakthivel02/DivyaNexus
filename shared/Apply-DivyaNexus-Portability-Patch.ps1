param(
    [Parameter(Mandatory = $true)]
    [string]$RepoPath
)

$ErrorActionPreference = "Stop"
$ExpectedBranch = "repair/divyanexus-production"
$CommitMessage = "fix: productionise DivyaNexus assets and remove Manus runtime"

$RepoPath = (Resolve-Path $RepoPath).Path
$PayloadPath = Join-Path $PSScriptRoot "payload"

if (-not (Test-Path (Join-Path $RepoPath ".git"))) {
    throw "The supplied path is not a Git repository: $RepoPath"
}

$CurrentBranch = (git -C $RepoPath branch --show-current).Trim()
if ($LASTEXITCODE -ne 0) {
    throw "Unable to determine the current Git branch."
}
if ($CurrentBranch -ne $ExpectedBranch) {
    throw "Stop: current branch is '$CurrentBranch'. Switch to '$ExpectedBranch' before applying the patch."
}

if (-not (Test-Path $PayloadPath)) {
    throw "Payload folder is missing: $PayloadPath"
}

Write-Host "Applying verified DivyaNexus production-portability payload..."
Copy-Item -Path (Join-Path $PayloadPath "*") -Destination $RepoPath -Recurse -Force

$DeletePaths = @(
    "client/public/__manus__/debug-collector.js"
)
foreach ($RelativePath in $DeletePaths) {
    $Target = Join-Path $RepoPath $RelativePath
    if (Test-Path $Target) {
        Remove-Item $Target -Force
        Write-Host "Deleted production-only debug file: $RelativePath"
    }
}

# Verify that prohibited production strings are absent from the key generated source files.
$FilesToScan = @(
    "client/index.html",
    "client/public/sw.js",
    "client/public/manifest.webmanifest",
    "client/src/data/content.ts",
    "vite.config.ts"
)
$Prohibited = @(
    "manus-storage",
    "__manus__",
    "BUILT_IN_FORGE",
    "filebin.net",
    "%VITE_ANALYTICS_ENDPOINT%",
    "%VITE_ANALYTICS_WEBSITE_ID%",
    "vitePluginManusRuntime",
    "vitePluginStorageProxy",
    "vitePluginManusDebugCollector"
)
foreach ($RelativePath in $FilesToScan) {
    $Target = Join-Path $RepoPath $RelativePath
    if (-not (Test-Path $Target)) {
        throw "Required file is missing after copy: $RelativePath"
    }
    $Text = Get-Content -Raw -Path $Target
    foreach ($Term in $Prohibited) {
        if ($Text.Contains($Term)) {
            throw "Verification failed: '$Term' remains in $RelativePath"
        }
    }
}

$RequiredAssets = @(
    "client/public/assets/divyanexus/hero-moonlit-horizon.webp",
    "client/public/assets/divyanexus/temple-dusk.webp",
    "client/public/assets/divyanexus/sacred-manuscript.webp",
    "client/public/assets/divyanexus/ask-divya-lantern.webp",
    "client/public/assets/divyanexus/app-icon-192.png",
    "client/public/assets/divyanexus/app-icon-512.png"
)
foreach ($RelativePath in $RequiredAssets) {
    $Target = Join-Path $RepoPath $RelativePath
    if (-not (Test-Path $Target)) {
        throw "Required asset is missing: $RelativePath"
    }
    if ((Get-Item $Target).Length -le 0) {
        throw "Required asset is empty: $RelativePath"
    }
}

git -C $RepoPath add -A
if ($LASTEXITCODE -ne 0) {
    throw "git add failed."
}

git -C $RepoPath diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "No changes to commit. The patch may already be applied."
    exit 0
}

git -C $RepoPath commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "git commit failed."
}

git -C $RepoPath push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "git push failed. Open GitHub Desktop and select Push origin."
}

Write-Host "Patch committed and pushed successfully."
Write-Host "Next: wait for the Validate DivyaNexus React App workflow. Do not merge PR #2 until it is green."
