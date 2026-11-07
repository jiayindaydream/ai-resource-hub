// GitHub Projects View (Aligns with Karakeep bookmarks & GitHub API auto-metadata fetcher)
window.GithubProjectsView = function GithubProjectsView({ state, setCurrentView }) {
  const Icons = window.Icons;
  const [activeStatus, setActiveStatus] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [inputRepo, setInputRepo] = useState("");
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [fetchedMeta, setFetchedMeta] = useState(null);
  const [personalNotes, setPersonalNotes] = useState("");
  const [metaError, setMetaError] = useState("");

  const statuses = ["全部", "待研究", "研究中", "已掌握"];

  const filteredProjects = state.githubProjects.filter(p => {
    const matchStatus = activeStatus === "全部" || p.studyStatus === activeStatus;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchStatus && matchSearch;
  });

  // Auto fetch metadata from GitHub public API
  const handleFetchMetadata = async () => {
    if (!inputRepo.trim()) return;
    setIsFetchingMeta(true);
    setMetaError("");
    setFetchedMeta(null);

    const res = await window.ApiService.fetchGithubRepoMetadata(inputRepo);
    setIsFetchingMeta(false);

    if (res.success) {
      setFetchedMeta(res.data);
    } else {
      setMetaError(res.error || "获取元数据失败");
    }
  };

  const handleSaveProject = () => {
    if (!fetchedMeta) return;

    const newProject = {
      name: fetchedMeta.name,
      owner: fetchedMeta.owner,
      fullName: fetchedMeta.fullName,
      repoUrl: fetchedMeta.repoUrl,
      description: fetchedMeta.description,
      stars: fetchedMeta.stars,
      forks: fetchedMeta.forks,
      language: fetchedMeta.language,
      languageColor: "#3178c6",
      license: fetchedMeta.license,
      studyStatus: "待研究",
      notes: personalNotes.trim() || "暂无研读笔记",
      topics: fetchedMeta.topics || []
    };

    window.StorageEngine.addGithubProject(newProject);
    setShowAddModal(false);
    setInputRepo("");
    setFetchedMeta(null);
    setPersonalNotes("");
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">GitHub 开源项目库</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              {state.githubProjects.length} 个收藏
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">自动解析 Star 数、编程语言与开源 License，精细化管理研读进度</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all"
        >
          <Icons.Plus size={15} />
          <span>收藏 GitHub 仓库</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeStatus === st
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Icons.Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索仓库名称/描述/笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent"
          />
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Icons.Github size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">暂无收藏的 GitHub 仓库</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || activeStatus !== "全部" ? "未找到符合当前状态或关键词的开源项目" : "当前工作区暂无收藏代码库，输入 GitHub 链接即可自动解析 Star 与语言并加入工作台。"}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all mt-2"
          >
            <Icons.Plus size={14} />
            <span>收藏第一个仓库</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(repo => (
            <div
              key={repo.id}
              className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between group"
            >
            <div>
              {/* Card Header: Owner / Name & External link */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Icons.Github size={16} className="text-slate-700 dark:text-slate-300" />
                  </div>
                  <div className="truncate">
                    <a
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 truncate flex items-center gap-1 group-hover:underline"
                    >
                      <span>{repo.fullName}</span>
                      <Icons.ExternalLink size={12} className="opacity-60" />
                    </a>
                    <span className="text-[10px] text-slate-400">License: {repo.license}</span>
                  </div>
                </div>

                {/* Status Switcher Select */}
                <select
                  value={repo.studyStatus}
                  onChange={(e) => window.StorageEngine.updateStudyStatus("github", repo.id, e.target.value)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer whitespace-nowrap shrink-0 ${
                    repo.studyStatus === "已掌握"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                      : repo.studyStatus === "研究中"
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  }`}
                >
                  <option value="待研究">⏳ 待研究</option>
                  <option value="研究中">🔍 研究中</option>
                  <option value="已掌握">✅ 已掌握</option>
                </select>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                {repo.description}
              </p>

              {/* Personal Notes Box */}
              {repo.notes && (
                <div className="mt-3 p-2.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300">
                  <span className="font-semibold block mb-0.5">个人研读备忘:</span>
                  {repo.notes}
                </div>
              )}

              {/* Phase 3: Cross-Asset Workflow Linkage */}
              {(() => {
                const linkedWfs = window.StorageEngine.getWorkflowsByRepoId(repo.id);
                if (!linkedWfs || linkedWfs.length === 0) return null;
                return (
                  <div
                    onClick={() => setCurrentView && setCurrentView("workflows")}
                    role="button"
                    tabIndex={0}
                    className="mt-3 p-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 cursor-pointer hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50 transition-colors flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-200"
                    title="点击直接穿透跳转至编排流水线"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Icons.Workflow size={12} className="text-emerald-600 shrink-0" />
                      <span className="text-slate-500 dark:text-slate-400">已编排至流水线:</span>
                      <span className="font-semibold truncate">{linkedWfs.map(w => w.name).join("、")}</span>
                    </span>
                    <Icons.ArrowUpRight size={12} className="shrink-0 text-emerald-600" />
                  </div>
                );
              })()}
            </div>

            {/* Bottom Meta & Topics */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Icons.Star size={13} fill="#F59E0B" className="text-amber-500" />
                    <span>{repo.stars.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.languageColor || "#3178c6" }}></span>
                    <span className="font-medium text-slate-600 dark:text-slate-400">{repo.language}</span>
                  </span>
                </div>

                <button
                  onClick={() => window.StorageEngine.deleteGithubProject(repo.id)}
                  className="text-slate-400 hover:text-rose-500 text-[11px] transition-colors"
                  title="移除收藏"
                >
                  <Icons.Trash2 size={13} />
                </button>
              </div>

              {/* Topic Pills */}
              {repo.topics && repo.topics.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {repo.topics.slice(0, 3).map(top => (
                    <span key={top} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {top}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Collect Repo Modal (with auto-fetch metadata) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Github size={16} className="text-emerald-500" />
                <span>收藏 GitHub 仓库</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Icons.X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  GitHub 仓库链接或路径 *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="例如: vercel/ai 或完整链接"
                    value={inputRepo}
                    onChange={(e) => setInputRepo(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-xs"
                  />
                  <button
                    type="button"
                    disabled={isFetchingMeta || !inputRepo.trim()}
                    onClick={handleFetchMetadata}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold disabled:opacity-50 text-xs shrink-0 flex items-center gap-1.5"
                  >
                    {isFetchingMeta ? (
                      <>
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        <span>解析中...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Sparkles size={13} />
                        <span>自动解析</span>
                      </>
                    )}
                  </button>
                </div>
                {metaError && (
                  <p className="text-rose-500 text-[11px] mt-1">{metaError}</p>
                )}
              </div>

              {/* Fetched Preview Card */}
              {fetchedMeta && (
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{fetchedMeta.fullName}</span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ★ {fetchedMeta.stars.toLocaleString()} Stars
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs">{fetchedMeta.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>语言: {fetchedMeta.language}</span>
                    <span>License: {fetchedMeta.license}</span>
                    <span>Forks: {fetchedMeta.forks}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  个人研读备忘与笔记
                </label>
                <textarea
                  rows={3}
                  placeholder="写下关注此项目的核心特色、应用场景或研究要点..."
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  disabled={!fetchedMeta}
                  onClick={handleSaveProject}
                  className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 shadow-md shadow-emerald-500/20"
                >
                  确认加入收藏
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
