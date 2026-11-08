# Pure ASCII Build Script for AI Resource Hub
$ErrorActionPreference = "Stop"

$srcFiles = @(
  "src\icons.js",
  "src\data\mockData.js",
  "src\data\storageEngine.js",
  "src\services\apiService.js",
  "src\components\Sidebar.jsx",
  "src\components\Header.jsx",
  "src\components\DashboardView.jsx",
  "src\components\PromptsView.jsx",
  "src\components\SkillsView.jsx",
  "src\components\WorkflowsView.jsx",
  "src\components\GithubProjectsView.jsx",
  "src\components\ApiCenterViews.jsx",
  "src\components\GlobalSearchModal.jsx",
  "src\components\ReportExportModal.jsx",
  "src\App.jsx"
)

$sb = New-Object System.Text.StringBuilder

# Declare React hooks ONCE globally for all components
[void]$sb.AppendLine("// === GLOBAL REACT HOOKS ===")
[void]$sb.AppendLine("const { useState, useEffect, useRef, useMemo, useCallback } = React;")
[void]$sb.AppendLine("")

foreach ($f in $srcFiles) {
    $fullPath = Join-Path $PSScriptRoot $f
    if (Test-Path $fullPath) {
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $txt = [System.Text.Encoding]::UTF8.GetString($bytes)
        [void]$sb.AppendLine("// === FILE: $f ===")
        [void]$sb.AppendLine($txt)
        [void]$sb.AppendLine("")
    } else {
        Write-Warning "File not found: $fullPath"
    }
}

$header = @'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>AI Resource Hub - 个人 AI 资源与模型管理工作台</title>
  
  <!-- Favicon -->
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>">

  <!-- Offline Local Vendor Libraries -->
  <script src="vendor/react.production.min.js"></script>
  <script src="vendor/react-dom.production.min.js"></script>
  <script src="vendor/babel.min.js"></script>
  <script src="vendor/echarts.min.js"></script>
  <script src="vendor/tailwind.min.js"></script>

  <!-- Tailwind Configuration -->
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eff6ff',
              100: '#dbeafe',
              500: '#3b82f6',
              600: '#2563eb',
              700: '#1d4ed8'
            }
          },
          fontFamily: {
            sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
            mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
          }
        }
      }
    };
  </script>

  <style>
    /* Sleek custom scrollbars */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #94A3B8;
    }
    .dark ::-webkit-scrollbar-thumb {
      background: #334155;
    }
    .dark ::-webkit-scrollbar-thumb:hover {
      background: #475569;
    }

    @keyframes pulseSoft {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.85; }
    }
    .animate-pulse-soft {
      animation: pulseSoft 2s infinite ease-in-out;
    }

    /* Print styles */
    @media print {
      body {
        background-color: white !important;
      }
      aside, header, button, .no-print {
        display: none !important;
      }
    }
  </style>

  <!-- Diagnostic Error Handler -->
  <script>
    window.addEventListener('error', function(e) {
      console.error("Global Error Caught:", e);
      var errBox = document.getElementById('error-display');
      if (!errBox) {
        errBox = document.createElement('div');
        errBox.id = 'error-display';
        errBox.style.cssText = 'position:fixed;bottom:20px;left:20px;right:20px;z-index:9999;padding:16px;border-radius:16px;background:#FEF2F2;border:1px solid #F87171;color:#991B1B;font-family:monospace;font-size:12px;box-shadow:0 10px 25px rgba(0,0,0,0.1);max-height:300px;overflow-y:auto;';
        document.body.appendChild(errBox);
      }
      errBox.innerHTML = '<strong style="font-size:14px;">[Module Error]:</strong><br>' +
        '<span>' + (e.message || e.error || 'Unknown Error') + '</span><br>' +
        '<span style="color:#6B7280;font-size:11px;">Location: ' + (e.filename || '') + ' : ' + (e.lineno || '') + '</span>' +
        (e.error && e.error.stack ? '<pre style="margin-top:8px;font-size:10px;white-space:pre-wrap;color:#7F1D1D;">' + e.error.stack + '</pre>' : '');
    });
  </script>
</head>
<body class="bg-[#F4F7FB] dark:bg-[#080C14] antialiased selection:bg-blue-500 selection:text-white">
  <div id="root">
    <div style="display:flex;height:100vh;width:100vw;align-items:center;justify-content:center;background:#F4F7FB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:14px;">
        <div style="width:48px;height:48px;border-radius:18px;background:linear-gradient(135deg,#3B82F6,#4F46E5);display:flex;align-items:center;justify-content:center;color:white;font-size:24px;box-shadow:0 10px 25px -5px rgba(59,130,246,0.35);" class="animate-pulse-soft">
          &#9889;
        </div>
        <div style="font-size:14px;font-weight:700;color:#0F172A;letter-spacing:0.02em;">AI RESOURCE HUB</div>
        <div style="font-size:11px;color:#64748B;">Loading AI Resource Hub...</div>
      </div>
    </div>
  </div>

  <!-- Compiled Application Logic -->
  <script type="text/babel">
'@

$footer = @'
  </script>
</body>
</html>
'@

$outputPath = Join-Path $PSScriptRoot "index.html"
$finalHtml = $header + "`n" + $sb.ToString() + "`n" + $footer

# Save with UTF-8 BOM so all Windows systems and browsers detect UTF-8 automatically
$utf8WithBom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($outputPath, $finalHtml, $utf8WithBom)

Write-Host "AI Resource Hub successfully built to: $outputPath"
