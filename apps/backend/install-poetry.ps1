# PowerShell script to install Poetry on Windows

Write-Host "Installing Poetry..." -ForegroundColor Green

# Check if Poetry is already installed
if (Get-Command poetry -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Poetry is already installed!" -ForegroundColor Green
    poetry --version
    exit 0
}

# Check if Python is available
Write-Host "Checking for Python..." -ForegroundColor Yellow
$pythonCmd = $null
$pythonPaths = @("python", "python3", "py")

foreach ($cmd in $pythonPaths) {
    try {
        $version = & $cmd --version 2>&1
        if ($LASTEXITCODE -eq 0 -and $version -match "Python") {
            $pythonCmd = $cmd
            Write-Host "[OK] Found Python: $version" -ForegroundColor Green
            break
        }
    } catch {
        continue
    }
}

if (-not $pythonCmd) {
    Write-Host "[ERROR] Python is required to install Poetry." -ForegroundColor Red
    Write-Host "Please install Python 3.7+ from https://www.python.org/" -ForegroundColor Yellow
    Write-Host "Or use the Windows Store: ms-windows-store://pdp/?ProductId=9NRWMJP3717K" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Alternative: Install Poetry manually using pipx:" -ForegroundColor Yellow
    Write-Host "  pip install pipx" -ForegroundColor Cyan
    Write-Host "  pipx install poetry" -ForegroundColor Cyan
    exit 1
}

# Install Poetry using the official installer
Write-Host ""
Write-Host "Downloading Poetry installer..." -ForegroundColor Yellow
try {
    $installerUrl = "https://install.python-poetry.org"
    $installerScript = Invoke-WebRequest -Uri $installerUrl -UseBasicParsing -ErrorAction Stop
    
    Write-Host "Running Poetry installer with Python..." -ForegroundColor Yellow
    
    # Save to temp file
    $tempFile = [System.IO.Path]::GetTempFileName() + ".py"
    $installerScript.Content | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline
    
    # Run with Python
    & $pythonCmd $tempFile --version latest
    
    # Clean up
    Remove-Item $tempFile -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "[OK] Poetry installer completed" -ForegroundColor Green
    
} catch {
    Write-Host "[ERROR] Failed to download or run Poetry installer" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative installation methods:" -ForegroundColor Yellow
    Write-Host "1. Using pipx (recommended):" -ForegroundColor Cyan
    Write-Host "   pip install pipx" -ForegroundColor Gray
    Write-Host "   pipx install poetry" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Using pip:" -ForegroundColor Cyan
    Write-Host "   pip install poetry" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Manual installation:" -ForegroundColor Cyan
    Write-Host "   https://python-poetry.org/docs/#installation" -ForegroundColor Gray
    exit 1
}

# Refresh PATH
Write-Host "Refreshing PATH..." -ForegroundColor Yellow
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$env:Path = "$userPath;$machinePath"

# Common Poetry installation paths
$poetryPaths = @(
    "$env:APPDATA\Python\Scripts",
    "$env:LOCALAPPDATA\Programs\Python\Python*\Scripts",
    "$env:USERPROFILE\.local\bin"
)

foreach ($path in $poetryPaths) {
    $resolvedPaths = Resolve-Path $path -ErrorAction SilentlyContinue
    foreach ($resolvedPath in $resolvedPaths) {
        if (Test-Path "$resolvedPath\poetry.exe") {
            $env:Path += ";$resolvedPath"
            Write-Host "[OK] Found Poetry at: $resolvedPath" -ForegroundColor Green
        }
    }
}

# Verify installation
Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

if (Get-Command poetry -ErrorAction SilentlyContinue) {
    Write-Host "[SUCCESS] Poetry installed successfully!" -ForegroundColor Green
    poetry --version
    Write-Host ""
    Write-Host "Note: If Poetry is not found in new terminals, restart your terminal" -ForegroundColor Yellow
    Write-Host "or add Poetry to your PATH manually." -ForegroundColor Yellow
} else {
    Write-Host "[WARNING] Poetry installation completed, but not found in PATH." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Poetry may be installed at one of these locations:" -ForegroundColor Cyan
    foreach ($path in $poetryPaths) {
        Write-Host "  - $path" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "To add Poetry to PATH manually:" -ForegroundColor Yellow
    Write-Host "1. Find the Poetry installation directory" -ForegroundColor Gray
    Write-Host "2. Add it to your PATH environment variable" -ForegroundColor Gray
    Write-Host "3. Restart your terminal" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Or restart your terminal - Poetry may be available after restart." -ForegroundColor Cyan
}
