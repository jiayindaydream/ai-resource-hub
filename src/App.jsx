// Root App Component for AI Resource Hub (Phase 3 Completed)
function App() {
  const [state, setState] = useState(() => window.StorageEngine.getState());
  const [currentView, setCurrentViewState] = useState(() => {
    const hash = window.location.hash.replace("#", "").trim();
    const validViews = ["dashboard", "prompts", "skills", "workflows", "github", "api-connections", "usage-analytics", "budgets"];
    return validViews.includes(hash) ? hash : "dashboard";
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const setCurrentView = useCallback((view) => {
    setCurrentViewState(view);
    if (window.location.hash.replace("#", "") !== view) {
      window.location.hash = view;
    }
  }, []);

  // Listen for browser forward/backward hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").trim();
      if (hash && hash !== currentView) {
        setCurrentViewState(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentView]);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = window.StorageEngine.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, []);

  // Sync theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleMode = () => {
    const nextMode = state.serviceConfig?.mode === "live" ? "demo" : "live";
    window.StorageEngine.toggleDataMode(nextMode);
  };

  const handleQuickAdd = (type) => {
    if (type === "prompt") setCurrentView("prompts");
    else if (type === "github") setCurrentView("github");
    else if (type === "skill") setCurrentView("skills");
    else if (type === "api-key") setCurrentView("api-connections");
  };

  // View Router (Decoupled, high-impact modules with cross-asset relations)
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <window.DashboardView
            state={state}
            setCurrentView={setCurrentView}
            onQuickAdd={handleQuickAdd}
            onOpenReport={() => setIsReportOpen(true)}
          />
        );
      case "prompts":
        return <window.PromptsView state={state} setCurrentView={setCurrentView} />;
      case "skills":
        return <window.SkillsView state={state} setCurrentView={setCurrentView} />;
      case "workflows":
        return <window.WorkflowsView state={state} setCurrentView={setCurrentView} />;
      case "github":
        return <window.GithubProjectsView state={state} setCurrentView={setCurrentView} />;
      case "api-connections":
        return <window.ApiConnectionsView state={state} setCurrentView={setCurrentView} />;
      case "usage-analytics":
        return <window.UsageAnalyticsView state={state} setCurrentView={setCurrentView} />;
      case "budgets":
        return <window.BudgetsView state={state} setCurrentView={setCurrentView} />;
      default:
        return (
          <window.DashboardView
            state={state}
            setCurrentView={setCurrentView}
            onQuickAdd={handleQuickAdd}
            onOpenReport={() => setIsReportOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#080C14] text-slate-800 dark:text-slate-100 flex transition-colors duration-200 font-sans">
      {/* Left Fixed Navigation Sidebar */}
      <window.Sidebar
        state={state}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenReport={() => setIsReportOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden pb-16 md:pb-0">
        <window.Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          dataMode={state.serviceConfig?.mode || "demo"}
          onOpenSearch={() => setIsSearchOpen(true)}
          onQuickAdd={handleQuickAdd}
          onOpenReport={() => setIsReportOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
        />

        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Mobile Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button
          onClick={() => setCurrentView("dashboard")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] transition-colors ${
            currentView === "dashboard" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500 dark:text-slate-400 font-medium"
          }`}
        >
          <window.Icons.LayoutDashboard size={19} className={currentView === "dashboard" ? "text-blue-600 dark:text-blue-400" : ""} />
          <span>看板</span>
        </button>

        <button
          onClick={() => setCurrentView("prompts")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] transition-colors ${
            currentView === "prompts" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500 dark:text-slate-400 font-medium"
          }`}
        >
          <window.Icons.MessageSquare size={19} className={currentView === "prompts" ? "text-blue-600 dark:text-blue-400" : ""} />
          <span>Prompts</span>
        </button>

        <button
          onClick={() => setCurrentView("workflows")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] transition-colors ${
            currentView === "workflows" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500 dark:text-slate-400 font-medium"
          }`}
        >
          <window.Icons.Workflow size={19} className={currentView === "workflows" ? "text-blue-600 dark:text-blue-400" : ""} />
          <span>工作流</span>
        </button>

        <button
          onClick={() => setCurrentView("api-connections")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] transition-colors ${
            currentView === "api-connections" || currentView === "usage-analytics" || currentView === "budgets" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500 dark:text-slate-400 font-medium"
          }`}
        >
          <window.Icons.Coins size={19} className={currentView === "api-connections" || currentView === "usage-analytics" || currentView === "budgets" ? "text-blue-600 dark:text-blue-400" : ""} />
          <span>成本/API</span>
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <window.Icons.Menu size={19} />
          <span>菜单</span>
        </button>
      </nav>

      {/* Global Search Dialog (Ctrl + K) */}
      <window.GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        state={state}
        onNavigate={(view, act) => {
          if (act === "openSearch") setIsSearchOpen(true);
          else if (view) setCurrentView(view);
        }}
      />

      {/* Phase 3: AI Portfolio Report Export Modal */}
      <window.ReportExportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        state={state}
      />
    </div>
  );
}

// Render root
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
