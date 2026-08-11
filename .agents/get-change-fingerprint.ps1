[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$repoRoot = (git rev-parse --show-toplevel).Trim()
if (-not $repoRoot) {
    throw 'Tidak berada di dalam repository Git.'
}

Push-Location -LiteralPath $repoRoot
try {
    $mergeBase = git merge-base HEAD main 2>$null
    if ($LASTEXITCODE -eq 0 -and $mergeBase) {
        $baseHead = ([string]$mergeBase).Trim()
    }
    else {
        $baseHead = (git rev-parse HEAD).Trim()
    }
    $tracked = @(git diff --name-only --relative $baseHead)
    $untracked = @(git ls-files --others --exclude-standard)

    $paths = @($tracked + $untracked) |
        Where-Object { $_ -and ($_ -notmatch '^(\.agents/reports/|\.agents\\reports\\)') } |
        ForEach-Object { $_ -replace '\\', '/' } |
        Sort-Object -Unique

    $manifestLines = foreach ($path in $paths) {
        $nativePath = $path -replace '/', [IO.Path]::DirectorySeparatorChar
        $absolutePath = Join-Path -Path $repoRoot -ChildPath $nativePath
        if (Test-Path -LiteralPath $absolutePath -PathType Leaf) {
            $contentHash = (Get-FileHash -LiteralPath $absolutePath -Algorithm SHA256).Hash.ToLowerInvariant()
            "$path`tfile`t$contentHash"
        }
        else {
            "$path`tdeleted`t-"
        }
    }

    $manifest = [string]::Join("`n", @($manifestLines))
    $sha256 = [Security.Cryptography.SHA256]::Create()
    try {
        $bytes = [Text.Encoding]::UTF8.GetBytes($manifest)
        $fingerprint = ([BitConverter]::ToString($sha256.ComputeHash($bytes))).Replace('-', '').ToLowerInvariant()
    }
    finally {
        $sha256.Dispose()
    }

    "BASE_HEAD=$baseHead"
    "DIFF_FINGERPRINT=$fingerprint"
    'FILES:'
    if ($manifestLines) {
        $manifestLines
    }
}
finally {
    Pop-Location
}
