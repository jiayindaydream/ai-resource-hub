// Prompts Library View (Aligns with sidambili/prompt-manager)
window.PromptsView = function PromptsView({ state, setCurrentView }) {
  const Icons = window.Icons;
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRunModal, setShowRunModal] = useState(null);
  const [runVariables, setRunVariables] = useState({});
  const [copyFeedback, setCopyFeedback] = useState(null);

  // New prompt form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Code Review");
  const [newTemplate, setNewTemplate] = useState("");
  const [newVersion, setNewVersion] = useState("v1.0.0");
  const [newTags, setNewTags] = useState("");

  const categories = ["全部", "Code Review", "Data Analysis", "Dev Tools", "Prompt Engineering"];

  const filteredPrompts = state.prompts.filter(p => {
    const matchCat = activeCategory === "全部" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleCopy = (prompt) => {
    navigator.clipboard.writeText(prompt.templateContent);
    setCopyFeedback(prompt.id);
    window.StorageEngine.updatePrompt(prompt.id, { copyCount: (prompt.copyCount || 0) + 1 });
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleCreatePrompt = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTemplate.trim()) return;

    // Detect variables like {{var}}
    const varRegex = /\{\{([^}]+)\}\}/g;
    const detectedVars = [];
    let match;
    while ((match = varRegex.exec(newTemplate)) !== null) {
      if (!detectedVars.includes(match[1].trim())) {
        detectedVars.push(match[1].trim());
      }
    }

    const promptObj = {
      title: newTitle.trim(),
      description: newDesc.trim() || "暂无描述",
      category: newCategory,
      currentVersion: newVersion.trim() || "v1.0.0",
      templateContent: newTemplate,
      variables: detectedVars,
      tags: newTags.split(/[,， ]+/).filter(Boolean),
      author: "Alex Lin"
    };

    window.StorageEngine.addPrompt(promptObj);
    setShowAddModal(false);
    setNewTitle("");
    setNewDesc("");
    setNewTemplate("");
    setNewTags("");
  };

  const handleOpenRun = (prompt) => {
    setShowRunModal(prompt);
    const initialVars = {};
    (prompt.variables || []).forEach(v => {
      initialVars[v] = "";
    });
    setRunVariables(initialVars);
  };

  const getComputedPrompt = () => {
    if (!showRunModal) return "";
    let content = showRunModal.templateContent;
    Object.keys(runVariables).forEach(k => {
      const val = runVariables[k] || `{{${k}}}`;
      content = content.replaceAll(`{{${k}}}`, val);
    });
    return content;
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Prompts 提示词库</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {state.prompts.length} 条已收录
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">支持变量插槽、版本比对、一键复制与本地测试</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all"
        >
          <Icons.Plus size={15} />
          <span>新建 Prompt</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 shrink-0">
          <Icons.Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索提示词名称/标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-transparent"
          />
        </div>
      </div>

      {/* Prompts Cards Grid or Empty State */}
      {filteredPrompts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Icons.MessageSquare size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">暂无提示词</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || activeCategory !== "全部" ? "未找到符合当前筛选条件的提示词" : "当前工作区暂无提示词模板，点击下方按钮开始创建属于你的第一个 Prompt。"}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all mt-2"
          >
            <Icons.Plus size={14} />
            <span>新建第一个 Prompt</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrompts.map(prompt => (
            <div
              key={prompt.id}
              className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:border-blue-500/30 hover:shadow-md transition-all flex flex-col justify-between group"
            >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40">
                  {prompt.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {prompt.currentVersion}
                  </span>
                  <button
                    onClick={() => window.StorageEngine.updatePrompt(prompt.id, { favorite: !prompt.favorite })}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Icons.Star size={14} fill={prompt.favorite ? "#F59E0B" : "none"} className={prompt.favorite ? "text-amber-500" : ""} />
                  </button>
                </div>
              </div>

              {/* Title & Desc */}
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-1">
                {prompt.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {prompt.description}
              </p>

              {/* Variables detected */}
              {prompt.variables && prompt.variables.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400">参数插槽:</span>
                  {prompt.variables.map(v => (
                    <span key={v} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-800/50">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              )}

              {/* Template Snippet Box */}
              <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed whitespace-pre-wrap select-all">
                {prompt.templateContent}
              </div>

              {/* Phase 3: Cross-Asset Relational Link */}
              {(() => {
                const linkedWfs = window.StorageEngine.getWorkflowsByPromptId(prompt.id);
                if (!linkedWfs || linkedWfs.length === 0) return null;
                return (
                  <div
                    onClick={() => setCurrentView && setCurrentView("workflows")}
                    role="button"
                    tabIndex={0}
                    className="mt-3 p-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 cursor-pointer hover:bg-blue-100/70 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-300"
                    title="点击直接穿透跳转至编排流水线"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <Icons.Workflow size={12} className="text-blue-500 shrink-0" />
                      <span className="text-slate-500 dark:text-slate-400">已编排至流水线:</span>
                      <span className="font-semibold truncate">{linkedWfs.map(w => w.name).join("、")}</span>
                    </span>
                    <Icons.ArrowUpRight size={12} className="shrink-0 text-blue-500" />
                  </div>
                );
              })()}
            </div>

            {/* Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 truncate">
                调用 {prompt.copyCount || 0} 次 · {prompt.updatedAt}
              </span>

              <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <button
                  onClick={() => handleOpenRun(prompt)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 whitespace-nowrap shrink-0"
                  title="填入变量测试运行"
                >
                  <Icons.Play size={12} className="text-purple-500 shrink-0" />
                  <span className="whitespace-nowrap">测试</span>
                </button>

                <button
                  onClick={() => handleCopy(prompt)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                    copyFeedback === prompt.id
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20"
                  }`}
                >
                  {copyFeedback === prompt.id ? <Icons.Check size={12} className="shrink-0" /> : <Icons.Copy size={12} className="shrink-0" />}
                  <span className="whitespace-nowrap">{copyFeedback === prompt.id ? "已复制" : "复制"}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add Prompt Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.MessageSquare size={16} className="text-blue-500" />
                <span>新建 Prompt 提示词模版</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Icons.X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePrompt} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">提示词名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 资深分布式架构 Review 专家"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">所属分类</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Code Review">Code Review</option>
                    <option value="Data Analysis">Data Analysis</option>
                    <option value="Dev Tools">Dev Tools</option>
                    <option value="Prompt Engineering">Prompt Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">语义版本号</label>
                  <input
                    type="text"
                    value={newVersion}
                    onChange={(e) => setNewVersion(e.target.value)}
                    placeholder="v1.0.0"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">功能描述</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="简要说明适用场景与预期效果..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-slate-700 dark:text-slate-300">Prompt 正文模版 *</label>
                  <span className="text-[11px] text-slate-400">支持 {`{{变量}}`} 自动识别插槽</span>
                </div>
                <textarea
                  required
                  rows={6}
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="例如: 你是一位架构师，请对以下代码进行审查: {{code}}"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">标签 (空格或逗号分隔)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="TypeScript, Security, Optimization"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
                >
                  保存并同步
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test / Run Variables Drawer Modal */}
      {showRunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Icons.Play size={16} className="text-purple-500" />
                  <span>测试运行 Prompt: {showRunModal.title}</span>
                </h3>
                <p className="text-[11px] text-slate-400">填入变量实时预览替换后的完整提示词</p>
              </div>
              <button onClick={() => setShowRunModal(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Icons.X size={16} />
              </button>
            </div>

            {/* Variable Inputs */}
            {showRunModal.variables && showRunModal.variables.length > 0 ? (
              <div className="space-y-2 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">参数插槽输入:</span>
                <div className="grid grid-cols-1 gap-2">
                  {showRunModal.variables.map(v => (
                    <div key={v} className="flex items-center gap-2">
                      <span className="w-24 shrink-0 font-mono text-[11px] text-purple-600 dark:text-purple-400 truncate">
                        {`{{${v}}}`}:
                      </span>
                      <input
                        type="text"
                        placeholder={`输入 ${v} 的具体内容...`}
                        value={runVariables[v] || ""}
                        onChange={(e) => setRunVariables({ ...runVariables, [v]: e.target.value })}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">该提示词无动态参数插槽，可直接全量复制。</p>
            )}

            {/* Computed Output Preview */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">生成后 Prompt 完整预览:</span>
              <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {getComputedPrompt()}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                预估 Token 占用: ~{Math.round(getComputedPrompt().length / 2.5)} Tokens
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRunModal(null)}
                  className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(getComputedPrompt());
                    alert("已成功复制组装后的提示词！可直接粘贴至模型客户端或工作流。");
                  }}
                  className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <Icons.Copy size={13} />
                  <span>一键复制组装结果</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
