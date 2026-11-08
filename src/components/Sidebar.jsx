// Sidebar Navigation Component (Dynamic Data Sync & Multi-User Workspace Controls)
window.Sidebar = function Sidebar({ state, currentView, setCurrentView, isCollapsed, setIsCollapsed, onOpenAbout, onOpenReport, isMobileOpen, onCloseMobile }) {
  const Icons = window.Icons;
  const [theme, setTheme] = useState(document.documentElement.classList.contains("dark") ? "dark" : "light");
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const fileInputRef = useRef(null);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleExportData = () => {
    window.StorageEngine.exportData();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const res = window.StorageEngine.importData(event.target.result);
      if (res.success) {
        alert("工作区数据导入恢复成功！");
        setShowWorkspaceModal(false);
      } else {
        alert(res.error || "导入失败，请检查文件格式");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResetData = () => {
    if (confirm("确定要恢复精选初始示例模板吗？当前修改将会被覆盖。")) {
      window.StorageEngine.resetData();
      setShowWorkspaceModal(false);
    }
  };

  const handleClearAll = () => {
    if (confirm("确定要清空工作区全部数据吗？清空后你将拥有一个 100% 空白的专属工作台。建议在清空前先导出备份。")) {
      window.StorageEngine.clearAllData();
      setShowWorkspaceModal(false);
    }
  };

  const navGroups = [
    {
      group: null,
      items: [
        { id: "dashboard", label: "Overview 看板", icon: Icons.LayoutDashboard }
      ]
    },
    {
      group: "AI ASSET LIBRARY",
      items: [
        { id: "prompts", label: "Prompts 提示词", icon: Icons.MessageSquare, badge: state?.prompts?.length || 0 },
        { id: "skills", label: "Skills 技能库", icon: Icons.Wrench, badge: state?.skills?.length || 0 },
        { id: "workflows", label: "Workflows 工作流", icon: Icons.Workflow, badge: state?.workflows?.length || 0 }
      ]
    },
    {
      group: "DEV RESOURCES",
      items: [
        { id: "github", label: "GitHub 开源库", icon: Icons.Github, badge: state?.githubProjects?.length || 0 }
      ]
    },
    {
      group: "API & MODEL CENTER",
      items: [
        { id: "api-connections", label: "API Connections", icon: Icons.Key, badge: state?.apiConnections?.length || 0 },
        { id: "usage-analytics", label: "Usage 用量分析", icon: Icons.Activity },
        { id: "budgets", label: "Budgets 预算防护", icon: Icons.Coins }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 md:hidden transition-opacity" 
          onClick={onCloseMobile}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 flex flex-col select-none ${
        isMobileOpen ? "translate-x-0 shadow-2xl w-72 max-w-[85vw]" : "-translate-x-full md:translate-x-0"
      } ${isCollapsed ? "md:w-20" : "md:w-64"}`}>
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => { setCurrentView("dashboard"); onCloseMobile && onCloseMobile(); }}>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Icons.Sparkles size={19} />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="truncate">
                <h1 className="font-bold text-slate-900 dark:text-white text-sm tracking-tight leading-none">AI RESOURCE HUB</h1>
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wider mt-1 uppercase">AI WORKBENCH</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
              title="关闭菜单"
            >
              <Icons.X size={18} />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
            >
              <Icons.ChevronRight size={16} className={`transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`} />
            </button>
          </div>
        </div>

      {/* Workspace Status & Action Pill */}
      {!isCollapsed && (
        <div className="px-4 pt-3.5 pb-1 shrink-0">
          <div 
            onClick={() => setShowWorkspaceModal(true)}
            className="cursor-pointer rounded-2xl p-2.5 flex items-center justify-between border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/15 transition-all text-xs"
            title="管理个人工作区数据与导入导出"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold">个人工作区 (本地私有)</span>
            </div>
            <Icons.Settings size={13} className="opacity-70 hover:opacity-100" />
          </div>
        </div>
      )}

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {group.group && !isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const active = currentView === item.id;
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); onCloseMobile && onCloseMobile(); }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all group relative ${
                    active
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
                >
                  <IconComp size={18} className={`shrink-0 transition-transform ${active ? "" : "group-hover:scale-105"}`} />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && typeof item.badge !== "undefined" && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap shrink-0 ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Controls: Report Button & User Profile */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2 shrink-0">
        {!isCollapsed && (
          <button
            onClick={onOpenReport}
            className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-all border border-emerald-200/50 dark:border-emerald-900/50"
            title="生成 AI 资产全景评估报告导出"
          >
            <span className="flex items-center gap-2">
              <Icons.FileText size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>AI 资产全景报告导出</span>
            </span>
            <Icons.Download size={13} className="text-emerald-500" />
          </button>
        )}

        <div className={`flex items-center gap-2 ${isCollapsed ? "flex-col" : "justify-between"}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 dark:ring-blue-950 shrink-0">
                AI
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">我的工作空间</div>
                <div className="text-[10px] text-slate-400 truncate">本地私有存储</div>
              </div>
            </div>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title={theme === "dark" ? "切换至浅色模式" : "切换至深色模式"}
          >
            {theme === "dark" ? <Icons.Sun size={17} /> : <Icons.Moon size={17} />}
          </button>
        </div>
      </div>

      {/* Hidden File Input for Data Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* Workspace Settings & Data Management Modal */}
      {showWorkspaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Icons.Settings size={18} className="text-blue-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">工作区数据与备份管理</h3>
              </div>
              <button onClick={() => setShowWorkspaceModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Icons.X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              本工作台的所有 Prompt、Skill、工作流与 GitHub 收藏数据均保存在当前浏览器的本地存储中，不上传任何第三方云端，隐私完全可控。
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors text-left"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">📥 导出数据备份 (JSON)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">将当前所有提示词与配置下载到本地电脑</div>
                </div>
                <Icons.Download size={14} className="text-blue-500 shrink-0" />
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors text-left"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">📤 导入数据备份 (JSON)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">一键恢复之前导出的 JSON 备份文件</div>
                </div>
                <Icons.Upload size={14} className="text-emerald-500 shrink-0" />
              </button>

              <button
                onClick={handleResetData}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 transition-colors text-left"
              >
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">🔄 恢复精选示例模板</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">重新载入 2 个 Prompt + 2 个 Skill + 1 个工作流</div>
                </div>
                <Icons.RefreshCw size={14} className="text-amber-500 shrink-0" />
              </button>

              <button
                onClick={handleClearAll}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-900/30 border border-rose-200/50 dark:border-rose-900/40 transition-colors text-left text-rose-600 dark:text-rose-400"
              >
                <div>
                  <div className="font-bold">🗑️ 清空所有数据 (从零开始)</div>
                  <div className="text-[11px] text-rose-500/80 mt-0.5">清空全部预设，享受完全空白的个人专属工作台</div>
                </div>
                <Icons.Trash2 size={14} className="shrink-0" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  </>
  );
};
