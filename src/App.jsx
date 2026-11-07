// Root App Component for AI Resource Hub (Phase 3 Completed)
function App() {
  const [state, setState] = useState(() => window.StorageEngine.getState());
  const [currentView, setCurrentViewState] = useState(() => {
    const hash = window.location.hash.replace("#", "").trim();
    const validViews = ["dashboard", "prompts", "skills", "workflows", "github", "api-connections", "usage-analytics", "budgets"];
    return validViews.includes(hash) ? hash : "dashboard";
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <window.Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          dataMode={state.serviceConfig?.mode || "demo"}
          onOpenSearch={() => setIsSearchOpen(true)}
          onQuickAdd={handleQuickAdd}
          onOpenReport={() => setIsReportOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

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
