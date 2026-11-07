// Header Component
window.Header = function Header({ currentView, setCurrentView, dataMode, onOpenSearch, onQuickAdd, onOpenAbout, onOpenReport }) {
  const Icons = window.Icons;
  const [showAddMenu, setShowAddMenu] = useState(false);

  const viewTitles = {
    "dashboard": { title: "Overview 核心看板" },
    "prompts": { title: "Prompts 提示词库" },
    "skills": { title: "Skills 技能库" },
    "workflows": { title: "Workflows 编排流水线" },
    "github": { title: "GitHub 开源项目" },
    "api-connections": { title: "API Connections 服务商连接" },
    "usage-analytics": { title: "Usage 用量与成本分析" },
    "budgets": { title: "Budgets 预算与消费防护" }
  };

  const currentInfo = viewTitles[currentView] || viewTitles["dashboard"];

  return (
    <header className="h-16 px-6 md:px-8 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-[#0B0F17]/70 backdrop-blur-md sticky top-0 z-20">
      {/* Title */}
      <div className="shrink-0 mr-3">
        <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 whitespace-nowrap">
          {currentInfo.title}
        </h2>
      </div>

      {/* Right Actions: Never wrap into multiple lines */}
      <div className="flex items-center gap-2 md:gap-2.5 shrink-0 whitespace-nowrap">
        {/* Report Export Pill */}
        <button
          onClick={onOpenReport}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all text-xs font-semibold whitespace-nowrap shrink-0"
          title="导出 AI 资产全景评估报告 Markdown"
        >
          <Icons.FileText size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap">资产报告导出</span>
        </button>

        {/* Global Search Pill */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs whitespace-nowrap shrink-0"
        >
          <Icons.Search size={14} className="text-slate-400 shrink-0" />
          <span className="hidden xl:inline whitespace-nowrap">全局检索 (Prompts / Repos)...</span>
          <span className="inline xl:hidden whitespace-nowrap">全局检索...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Quick Add Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Icons.Plus size={15} className="shrink-0" />
            <span className="whitespace-nowrap">新建资产</span>
            <Icons.ChevronDown size={13} className={`shrink-0 transition-transform duration-200 ${showAddMenu ? "rotate-180" : ""}`} />
          </button>

          {showAddMenu && (
            <div 
              className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1.5 z-50 text-xs space-y-0.5"
              onMouseLeave={() => setShowAddMenu(false)}
            >
              <button
                onClick={() => { setShowAddMenu(false); onQuickAdd("prompt"); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-left transition-colors whitespace-nowrap"
              >
                <Icons.MessageSquare size={14} className="text-blue-500 shrink-0" />
                <span>新建 Prompt 提示词</span>
              </button>
              <button
                onClick={() => { setShowAddMenu(false); onQuickAdd("github"); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-left transition-colors whitespace-nowrap"
              >
                <Icons.Github size={14} className="text-emerald-500 shrink-0" />
                <span>收藏 GitHub 仓库</span>
              </button>
              <button
                onClick={() => { setShowAddMenu(false); onQuickAdd("skill"); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-left transition-colors whitespace-nowrap"
              >
                <Icons.Wrench size={14} className="text-amber-500 shrink-0" />
                <span>新建 Skill 技能</span>
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
              <button
                onClick={() => { setShowAddMenu(false); onQuickAdd("api-key"); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-left transition-colors whitespace-nowrap"
              >
                <Icons.Key size={14} className="text-purple-500 shrink-0" />
                <span>接入 API Key 连接</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
