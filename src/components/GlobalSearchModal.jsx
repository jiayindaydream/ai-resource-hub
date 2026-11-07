// Global Command Search Modal (Ctrl + K)
window.GlobalSearchModal = function GlobalSearchModal({ isOpen, onClose, state, onNavigate }) {
  const Icons = window.Icons;
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onNavigate(null, "openSearch");
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Aggregate search results (Prompts, GitHub, Skills)
  const promptResults = (state.prompts || [])
    .filter(p => !q || p.title.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)))
    .slice(0, 5)
    .map(p => ({ type: "Prompt", icon: Icons.MessageSquare, title: p.title, sub: p.category, view: "prompts", id: p.id }));

  const githubResults = (state.githubProjects || [])
    .filter(g => !q || g.name.toLowerCase().includes(q) || g.fullName.toLowerCase().includes(q) || g.description.toLowerCase().includes(q))
    .slice(0, 5)
    .map(g => ({ type: "GitHub", icon: Icons.Github, title: g.fullName, sub: `★ ${g.stars} · ${g.language}`, view: "github", id: g.id }));

  const skillResults = (state.skills || [])
    .filter(s => !q || s.title.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
    .slice(0, 4)
    .map(s => ({ type: "Skill", icon: Icons.Wrench, title: s.title, sub: s.name, view: "skills", id: s.id }));

  const totalResults = [...promptResults, ...githubResults, ...skillResults];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="h-14 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Icons.Search size={18} className="text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="键入提示词、GitHub 项目、技能规范或文章关键字..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
            ESC 退出
          </kbd>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          {totalResults.length > 0 ? (
            totalResults.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <IconComp size={15} />
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {item.type}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              未找到匹配的资源，尝试更换搜索词
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>支持跨 Prompt、Skill 与 GitHub 开源库秒级聚合检索</span>
          <span>按回车快速跳转</span>
        </div>
      </div>
    </div>
  );
};
