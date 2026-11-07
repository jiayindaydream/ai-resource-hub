// Dashboard / Overview View Component
window.DashboardView = function DashboardView({ state, setCurrentView, onQuickAdd, onOpenReport }) {
  const Icons = window.Icons;
  const stats = state.dashboardStats;
  const chartRef = useRef(null);
  const pieRef = useRef(null);

  useEffect(() => {
    let mainChart = null;
    let pieChart = null;

    if (window.echarts && chartRef.current) {
      mainChart = window.echarts.init(chartRef.current);
      const isMillions = state.dailyTrends.some(d => d.tokens >= 500000);
      const tokenSeriesName = isMillions ? "Token 消耗 (M)" : "Token 消耗 (K)";
      const tokenUnit = isMillions ? "M Tokens" : "K Tokens";
      const dates = state.dailyTrends.map(d => d.date);
      const tokens = state.dailyTrends.map(d => isMillions ? (d.tokens / 1000000).toFixed(2) : (d.tokens / 1000).toFixed(1));
      const costs = state.dailyTrends.map(d => d.cost);

      const isDark = document.documentElement.classList.contains("dark");
      const textColor = isDark ? "#94A3B8" : "#64748B";
      const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

      mainChart.setOption({
        tooltip: {
          trigger: "axis",
          backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
          borderColor: isDark ? "#334155" : "#E2E8F0",
          textStyle: { color: isDark ? "#F8FAFC" : "#0F172A", fontSize: 12 },
          formatter: (params) => {
            let str = `<div class="font-bold mb-1">${params[0].axisValue}</div>`;
            params.forEach(p => {
              const unit = p.seriesName.includes("Token") ? ` ${tokenUnit}` : " USD";
              str += `<div class="flex items-center justify-between gap-4 text-xs py-0.5">
                <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full" style="background:${p.color}"></span>${p.seriesName}</span>
                <span class="font-semibold">${p.value}${unit}</span>
              </div>`;
            });
            return str;
          }
        },
        legend: {
          data: [tokenSeriesName, "API 费用 ($)"],
          top: 0,
          right: 55,
          textStyle: { color: textColor, fontSize: 12 }
        },
        grid: {
          top: 45,
          left: 45,
          right: 45,
          bottom: 25
        },
        xAxis: {
          type: "category",
          data: dates,
          axisLine: { lineStyle: { color: gridColor } },
          axisTick: { show: false },
          axisLabel: { color: textColor, fontSize: 11 }
        },
        yAxis: [
          {
            type: "value",
            name: tokenUnit,
            nameTextStyle: { color: textColor, fontSize: 10 },
            splitLine: { lineStyle: { color: gridColor } },
            axisLabel: { color: textColor, fontSize: 11 }
          },
          {
            type: "value",
            name: "USD ($)",
            nameTextStyle: { color: textColor, fontSize: 10 },
            splitLine: { show: false },
            axisLabel: { color: textColor, fontSize: 11 }
          }
        ],
        series: [
          {
            name: tokenSeriesName,
            type: "line",
            smooth: true,
            data: tokens,
            showSymbol: false,
            itemStyle: { color: "#3B82F6" },
            areaStyle: {
              color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(59, 130, 246, 0.35)" },
                { offset: 1, color: "rgba(59, 130, 246, 0.0)" }
              ])
            }
          },
          {
            name: "API 费用 ($)",
            type: "bar",
            yAxisIndex: 1,
            data: costs,
            barWidth: "40%",
            itemStyle: {
              color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#818CF8" },
                { offset: 1, color: "#6366F1" }
              ]),
              borderRadius: [4, 4, 0, 0]
            }
          }
        ]
      });
    }

    if (window.echarts && pieRef.current) {
      pieChart = window.echarts.init(pieRef.current);
      const isDark = document.documentElement.classList.contains("dark");
      const textColor = isDark ? "#94A3B8" : "#64748B";

      pieChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{b}: ${c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: "5%",
          top: "center",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { color: textColor, fontSize: 11 }
        },
        series: [
          {
            name: "模型费用分布",
            type: "pie",
            radius: ["45%", "75%"],
            center: ["35%", "50%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: isDark ? "#111827" : "#FFFFFF",
              borderWidth: 2
            },
            label: { show: false },
            emphasis: {
              label: { show: false }
            },
            data: state.modelRankings.map(m => ({
              value: m.cost,
              name: m.model
            }))
          }
        ],
        color: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899"]
      });
    }

    const handleResize = () => {
      mainChart && mainChart.resize();
      pieChart && pieChart.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      mainChart && mainChart.dispose();
      pieChart && pieChart.dispose();
    };
  }, [state]);

  const promptCount = state.prompts?.length || 0;
  const skillCount = state.skills?.length || 0;
  const workflowCount = state.workflows?.length || 0;
  const githubCount = state.githubProjects?.length || 0;
  const totalAssets = promptCount + skillCount + workflowCount + githubCount;

  // Mini sparkline calculation for the right accent card
  const recentCosts = (state.dailyTrends || []).slice(-10);
  const maxCost = recentCosts.length > 0 ? Math.max(...recentCosts.map(d => d.cost)) : 1;
  const minCost = recentCosts.length > 0 ? Math.min(...recentCosts.map(d => d.cost)) : 0;
  const sparklinePoints = recentCosts.length > 1
    ? recentCosts
        .map((d, i) => {
          const x = (i / (recentCosts.length - 1)) * 140;
          const y = 35 - ((d.cost - minCost) / (maxCost - minCost || 1)) * 25;
          return `${x},${y}`;
        })
        .join(" ")
    : "0,20 140,20";

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24">
      {/* 1. Hero Bento Section (Matching uploaded reference image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Bento: Asset Overview */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI ASSETS TOTAL</span>
              <span className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                <Icons.Layers size={14} />
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {totalAssets}
              <span className="text-sm font-normal text-slate-400 ml-1.5">项资源</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">包含 Prompt、Skill、工作流与代码库</p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Icons.MessageSquare size={13} className="text-blue-500" /> Prompts</span>
              <span className="font-semibold">{promptCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Icons.Wrench size={13} className="text-amber-500" /> Skills</span>
              <span className="font-semibold">{skillCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Icons.Workflow size={13} className="text-purple-500" /> Workflows</span>
              <span className="font-semibold">{workflowCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><Icons.Github size={13} className="text-emerald-500" /> GitHub</span>
              <span className="font-semibold">{githubCount}</span>
            </div>
          </div>
        </div>

        {/* Center Bento: Vibrant Accent Gradient Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white rounded-3xl p-7 shadow-xl shadow-blue-500/20 relative overflow-hidden flex flex-col justify-between">
          {/* Subtle Background Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium mb-4">
              <Icons.Sparkles size={12} />
              <span>AI 资源与模型管理工作台</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white leading-snug">
              你的专属 AI 资产管理中枢
            </h3>
            <p className="text-blue-100 text-xs mt-2 leading-relaxed opacity-90 max-w-md">
              集中管理 Prompt 提示词、工程规约、GitHub 收藏与模型 API，数据完整保存在你的浏览器本地，隐私安全。
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-medium text-white/90">工作空间在线 · 支持自由添加与编辑</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenReport}
                className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-medium text-xs border border-white/30 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm whitespace-nowrap shrink-0"
                title="导出 AI 资产全景评估报告"
              >
                <Icons.FileText size={13} className="shrink-0" />
                <span className="whitespace-nowrap">资产评估报告</span>
              </button>
              <button
                onClick={() => setCurrentView("workflows")}
                className="px-3.5 py-1.5 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap shrink-0"
              >
                <span className="whitespace-nowrap">工作流编排</span>
                <Icons.ArrowUpRight size={13} className="shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Bento: Month Token & Cost Analytics (Sparkline card matching reference) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider">MONTHLY EXPENSES</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <Icons.TrendingUp size={11} /> +4.2% MoM
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                ${stats.monthlyCost.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-normal">/ 月度预算 $100</span>
            </div>

            {/* Clear distinction of real vs estimated cost */}
            <div className="mt-3 flex items-center gap-2 text-[11px] flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 whitespace-nowrap shrink-0">
                真实账单: ${stats.actualBilledCost.toFixed(2)}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 whitespace-nowrap shrink-0">
                Token 估算: ${stats.estimatedTokenCost.toFixed(2)}
              </span>
            </div>
          </div>

          {/* SVG Mini Sparkline Curve */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
              <span>近期支出速率</span>
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {stats.monthlyTokens > 500000 ? (stats.monthlyTokens / 1000000).toFixed(1) + "M" : (stats.monthlyTokens / 1000).toFixed(0) + "K"} Tokens
              </span>
            </div>
            <div className="h-10 w-full overflow-hidden">
              <svg viewBox="0 0 140 40" className="w-full h-full overflow-visible">
                <path
                  d={`M 0,38 L ${sparklinePoints} L 140,38 Z`}
                  fill="url(#sparklineGrad)"
                  opacity="0.25"
                />
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={sparklinePoints}
                />
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick KPI 6-Grid Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Prompt 提示词", value: promptCount, unit: "条", icon: Icons.MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10", view: "prompts" },
          { label: "Skill 技能库", value: skillCount, unit: "项", icon: Icons.Wrench, color: "text-amber-500", bg: "bg-amber-500/10", view: "skills" },
          { label: "Workflow 工作流", value: workflowCount, unit: "条", icon: Icons.Workflow, color: "text-purple-500", bg: "bg-purple-500/10", view: "workflows" },
          { label: "GitHub 收藏", value: githubCount, unit: "个", icon: Icons.Github, color: "text-emerald-500", bg: "bg-emerald-500/10", view: "github" },
          { label: "本月 Token 消耗", value: stats.monthlyTokens > 500000 ? (stats.monthlyTokens / 1000000).toFixed(1) : (stats.monthlyTokens / 1000).toFixed(0), unit: stats.monthlyTokens > 500000 ? "M" : "K", icon: Icons.Activity, color: "text-indigo-500", bg: "bg-indigo-500/10", view: "usage-analytics" },
          { label: "API 预估费用", value: `$${stats.monthlyCost.toFixed(2)}`, unit: "", icon: Icons.DollarSign, color: "text-rose-500", bg: "bg-rose-500/10", view: "budgets" }
        ].map((kpi, idx) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => setCurrentView(kpi.view)}
              className="cursor-pointer bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate whitespace-nowrap">{kpi.label}</span>
                <span className={`p-1.5 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                  <IconComp size={14} />
                </span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
                {kpi.value}
                <span className="text-xs font-normal text-slate-400">{kpi.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Deep Charts Section (Trend + Model Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Trend Line Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Activity size={16} className="text-blue-500" />
                <span>30 天模型用量与费用趋势</span>
              </h4>
              <p className="text-[11px] text-slate-400">每日 Token 消耗吞吐与折合费用走势</p>
            </div>
            <button
              onClick={() => setCurrentView("usage-analytics")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>查看细粒度报告</span>
              <Icons.ChevronRight size={13} />
            </button>
          </div>
          <div ref={chartRef} className="h-64 w-full"></div>
        </div>

        {/* Model Share Donut Chart (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Coins size={16} className="text-indigo-500" />
                <span>模型费用占比排行</span>
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">各模型累计消费份额与主要提供商</p>
          </div>
          <div ref={pieRef} className="h-60 w-full my-auto"></div>
        </div>
      </div>

      {/* 4. Bottom Double Columns: Recent Resources & Recent Call Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Added Dev Resources & Prompts */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Bookmark size={16} className="text-emerald-500" />
                <span>最近添加的资源</span>
              </h4>
              <p className="text-[11px] text-slate-400">新收录的开源项目与最新迭代的 Prompt 模版</p>
            </div>
            <button
              onClick={() => setCurrentView("github")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>全部资源</span>
              <Icons.ChevronRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Top 3 GitHub Repos */}
            {(state.githubProjects || []).slice(0, 3).map((repo) => (
              <div
                key={repo.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start justify-between gap-3"
              >
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Icons.Github size={15} className="text-slate-700 dark:text-slate-300 shrink-0" />
                    <a
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-xs text-slate-900 dark:text-slate-100 hover:text-blue-600 truncate flex items-center gap-1"
                    >
                      <span>{repo.fullName}</span>
                      <Icons.ExternalLink size={11} className="opacity-60" />
                    </a>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                      ★ {(repo.stars / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    {repo.description}
                  </p>
                </div>

                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  repo.studyStatus === "已掌握"
                    ? "bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300"
                    : repo.studyStatus === "研究中"
                    ? "bg-amber-100/70 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300"
                    : "bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}>
                  {repo.studyStatus}
                </span>
              </div>
            ))}

            {/* Recent 1 Prompt */}
            {(state.prompts || []).slice(0, 1).map((prompt) => (
              <div
                key={prompt.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start justify-between gap-3"
              >
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <Icons.MessageSquare size={15} className="text-blue-500 shrink-0" />
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                      {prompt.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100/70 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                      {prompt.currentVersion}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    {prompt.description}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView("prompts")}
                  className="shrink-0 text-[11px] text-blue-600 hover:underline"
                >
                  去使用
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Model Call Logs (LiteLLM Invocations) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Activity size={16} className="text-purple-500" />
                <span>最近模型调用记录</span>
              </h4>
              <p className="text-[11px] text-slate-400">实时请求吞吐、延迟表现与 Token 扣减流水</p>
            </div>
            <button
              onClick={() => setCurrentView("usage-analytics")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>实时日志流</span>
              <Icons.ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {(state.recentModelLogs || state.callLogs || []).slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[11px] text-slate-400 shrink-0">{log.time || log.timestamp}</span>
                  <div className="truncate min-w-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{log.model}</span>
                    <span className="text-[11px] text-slate-400 ml-1.5">({log.promptTitle || log.caller || "API 调用"})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
                  <span className="font-mono text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                    {(log.tokens || log.totalTokens || 0).toLocaleString()} tokens
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono whitespace-nowrap">
                    {log.latency || log.latencyMs || 0}ms
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 whitespace-nowrap shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="whitespace-nowrap">调用成功</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
