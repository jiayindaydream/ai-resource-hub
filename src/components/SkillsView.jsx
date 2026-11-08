// Skills View Component - AI Skills Center (Self-created & Downloaded Skills Management)
window.SkillsView = function SkillsView({ state, setCurrentView }) {
  const Icons = window.Icons;
  const [selectedSkillId, setSelectedSkillId] = useState(state.skills[0]?.id || null);
  const [activeSourceTab, setActiveSourceTab] = useState("all"); // "all" | "custom" | "downloaded"
  const [searchQuery, setSearchQuery] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isNotesEditing, setIsNotesEditing] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");

  const fileInputRef = useRef(null);

  // Form state for creating a new skill
  const [createForm, setCreateForm] = useState({
    title: "",
    name: "",
    source: "custom",
    author: "我 (自建原创)",
    sourceUrl: "",
    category: "Code & Standards",
    version: "1.0.0",
    tags: "TypeScript, Standards",
    description: "",
    notes: "",
    markdownContent: `# 技能名称与核心指令

## 1. 触发场景 (When to use)
在需要 ... 时激活此技能。

## 2. 执行规范与步骤
1. 第一步：分析上下文与输入
2. 第二步：执行核心逻辑
3. 第三步：输出结构化结果

## 3. 负面约束 (Negative Constraints)
- 禁止 ...
- 避免 ...`
  });

  // Form state for editing an existing skill
  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    name: "",
    source: "custom",
    author: "",
    sourceUrl: "",
    category: "",
    version: "",
    tags: "",
    description: "",
    notes: "",
    markdownContent: ""
  });

  const selectedSkill = state.skills.find(s => s.id === selectedSkillId) || state.skills[0];

  // Keep notesDraft in sync when selecting a skill
  useEffect(() => {
    if (selectedSkill) {
      setNotesDraft(selectedSkill.notes || "");
      setIsNotesEditing(false);
    }
  }, [selectedSkillId]);

  // Counts for tabs
  const customCount = (state.skills || []).filter(s => s.source === "custom").length;
  const downloadedCount = (state.skills || []).filter(s => s.source === "downloaded").length;

  // Filter skills by tab and search
  const filteredSkills = (state.skills || []).filter(skill => {
    if (activeSourceTab === "custom" && skill.source !== "custom") return false;
    if (activeSourceTab === "downloaded" && skill.source !== "downloaded") return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (skill.title || "").toLowerCase().includes(q) ||
      (skill.name || "").toLowerCase().includes(q) ||
      (skill.description || "").toLowerCase().includes(q) ||
      (skill.notes || "").toLowerCase().includes(q) ||
      (skill.author || "").toLowerCase().includes(q) ||
      (skill.tags || []).some(t => t.toLowerCase().includes(q))
    );
  });

  // Copy Markdown content
  const handleCopyMarkdown = () => {
    if (selectedSkill) {
      navigator.clipboard.writeText(selectedSkill.markdownContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Export as .md file
  const handleExportMd = () => {
    if (!selectedSkill) return;
    const blob = new Blob([selectedSkill.markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSkill.name || "skill"}_${selectedSkill.version || "1.0.0"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete skill
  const handleDeleteSkill = (id, title) => {
    if (confirm(`确定要删除技能「${title}」吗？`)) {
      window.StorageEngine.deleteSkill(id);
      if (selectedSkillId === id) {
        const remaining = state.skills.filter(s => s.id !== id);
        setSelectedSkillId(remaining[0]?.id || null);
      }
    }
  };

  // Quick save notes inline
  const handleSaveNotesInline = () => {
    if (selectedSkill) {
      window.StorageEngine.updateSkill(selectedSkill.id, { notes: notesDraft });
      setIsNotesEditing(false);
    }
  };

  // Open edit modal
  const handleOpenEdit = () => {
    if (!selectedSkill) return;
    setEditForm({
      id: selectedSkill.id,
      title: selectedSkill.title,
      name: selectedSkill.name,
      source: selectedSkill.source || "custom",
      author: selectedSkill.author || "",
      sourceUrl: selectedSkill.sourceUrl || "",
      category: selectedSkill.category || "",
      version: selectedSkill.version || "1.0.0",
      tags: (selectedSkill.tags || []).join(", "),
      description: selectedSkill.description || "",
      notes: selectedSkill.notes || "",
      markdownContent: selectedSkill.markdownContent || ""
    });
    setShowEditModal(true);
  };

  // Submit edit form
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;
    const tagsArr = editForm.tags
      .split(/[,，\s]+/)
      .map(t => t.trim())
      .filter(Boolean);

    window.StorageEngine.updateSkill(editForm.id, {
      title: editForm.title.trim(),
      name: editForm.name.trim() || editForm.title.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
      source: editForm.source,
      author: editForm.author.trim() || (editForm.source === "downloaded" ? "开源社区" : "我 (自建原创)"),
      sourceUrl: editForm.sourceUrl.trim(),
      category: editForm.category.trim() || "General",
      version: editForm.version.trim() || "1.0.0",
      tags: tagsArr.length > 0 ? tagsArr : ["Skill"],
      description: editForm.description.trim(),
      notes: editForm.notes.trim(),
      markdownContent: editForm.markdownContent
    });
    setShowEditModal(false);
  };

  // Submit create form
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) return;
    const tagsArr = createForm.tags
      .split(/[,，\s]+/)
      .map(t => t.trim())
      .filter(Boolean);

    const slug = createForm.name.trim() || createForm.title.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const newSkill = {
      title: createForm.title.trim(),
      name: slug,
      source: createForm.source,
      author: createForm.author.trim() || (createForm.source === "downloaded" ? "开源社区" : "我 (自建原创)"),
      sourceUrl: createForm.sourceUrl.trim(),
      category: createForm.category.trim() || "Custom Skills",
      version: createForm.version.trim() || "1.0.0",
      tags: tagsArr.length > 0 ? tagsArr : ["Custom"],
      description: createForm.description.trim() || "个人自建技能规范说明",
      notes: createForm.notes.trim(),
      markdownContent: createForm.markdownContent
    };

    const created = window.StorageEngine.addSkill(newSkill);
    setSelectedSkillId(created.id);
    setShowCreateModal(false);
    // Reset form
    setCreateForm({
      title: "",
      name: "",
      source: "custom",
      author: "我 (自建原创)",
      sourceUrl: "",
      category: "Code & Standards",
      version: "1.0.0",
      tags: "TypeScript, Standards",
      description: "",
      notes: "",
      markdownContent: `# 技能名称与核心指令\n\n## 1. 触发场景\n...`
    });
  };

  // Smart file importer (parses YAML Frontmatter or Markdown)
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = event.target.result;
      const fileNameNoExt = file.name.replace(/\.(md|txt|markdown)$/i, "");

      let parsedTitle = fileNameNoExt;
      let parsedDesc = `从外部文件 ${file.name} 导入的技能包`;
      let parsedCategory = "外部导入";
      let parsedTags = ["Imported", "Markdown"];
      let parsedAuthor = "外部开源社区";
      let parsedUrl = "";

      // Try parsing simple YAML frontmatter (--- ... ---)
      const fmMatch = rawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      let contentBody = rawText;

      if (fmMatch) {
        const yamlBlock = fmMatch[1];
        contentBody = fmMatch[2];
        const lines = yamlBlock.split(/\r?\n/);
        lines.forEach(line => {
          const colonIdx = line.indexOf(":");
          if (colonIdx > 0) {
            const key = line.slice(0, colonIdx).trim().toLowerCase();
            const val = line.slice(colonIdx + 1).trim().replace(/^['"]|['"]$/g, "");
            if (key === "title" || key === "name") parsedTitle = val;
            if (key === "description") parsedDesc = val;
            if (key === "category") parsedCategory = val;
            if (key === "author") parsedAuthor = val;
            if (key === "url" || key === "source") parsedUrl = val;
          }
        });
      } else {
        // Fallback: check first heading
        const headingMatch = rawText.match(/^#\s+(.+)$/m);
        if (headingMatch) {
          parsedTitle = headingMatch[1].trim();
        }
      }

      const slug = fileNameNoExt.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
      const importedSkill = {
        name: slug,
        title: parsedTitle,
        source: "downloaded",
        author: parsedAuthor,
        sourceUrl: parsedUrl,
        category: parsedCategory,
        version: "1.0.0",
        tags: parsedTags,
        description: parsedDesc,
        notes: `从本地文件 ${file.name} 导入收录。`,
        markdownContent: rawText
      };

      const created = window.StorageEngine.addSkill(importedSkill);
      setSelectedSkillId(created.id);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-28 md:pb-24">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Skills 技能库</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              {state.skills.length} 项技能已收录
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            统一归档个人自建技能与从 GitHub / 外部渠道下载的技能包，支持在线编辑、心得备注、一键复制与 .md 导出
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".md,.txt,.markdown"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-all shrink-0"
            title="选择本地从 GitHub 或其他平台下载的 .md 技能文件"
          >
            <Icons.Upload size={14} className="text-blue-500" />
            <span className="whitespace-nowrap">导入 .md 文件</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
          >
            <Icons.Plus size={14} />
            <span className="whitespace-nowrap">新建自建技能</span>
          </button>
        </div>
      </div>

      {/* 2. Source Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Origin Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 self-start">
          <button
            onClick={() => setActiveSourceTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSourceTab === "all"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            全部 ({state.skills.length})
          </button>
          <button
            onClick={() => setActiveSourceTab("custom")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSourceTab === "custom"
                ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>🛠️ 个人自建</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              {customCount}
            </span>
          </button>
          <button
            onClick={() => setActiveSourceTab("downloaded")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeSourceTab === "downloaded"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <span>🌐 外部下载</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              {downloadedCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索技能名称、标识、心得或标签..."
            className="w-full pl-9 pr-8 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <Icons.X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Split Layout or Empty State */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Icons.Wrench size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {searchQuery ? "未找到匹配的技能" : "当前分类暂无技能"}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            你可以点击下方按钮新建属于你的自建技能，或者直接导入从 GitHub 或其他渠道下载的 .md 技能文件。
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-semibold transition-all"
            >
              <Icons.Upload size={14} />
              <span>导入 .md 文件</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              <Icons.Plus size={14} />
              <span>新建自建技能</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Skill Cards List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredSkills.map(skill => {
              const isSelected = selectedSkill?.id === skill.id;
              const isCustom = skill.source === "custom";

              return (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`cursor-pointer p-4 rounded-3xl border transition-all text-left ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/20"
                      : "bg-white/70 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  {/* Top Metadata Row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 truncate">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        v{skill.version || "1.0.0"}
                      </span>
                    </div>

                    {/* Source Badge */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap flex items-center gap-1 ${
                        isCustom
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                          : "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                      }`}
                    >
                      <span>{isCustom ? "🛠️ 自建原创" : "🌐 外部下载"}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {skill.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Footer Row: Tags + Notes Indicator */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <div className="flex items-center gap-1 flex-wrap">
                      {(skill.tags || []).slice(0, 3).map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 whitespace-nowrap">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {skill.notes && (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-0.5 shrink-0 whitespace-nowrap" title="包含个人实测心得">
                        <span>💡</span>
                        <span className="font-medium whitespace-nowrap">有实测心得</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Skill Detail Inspector */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-5">
            {selectedSkill ? (
              <div>
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${
                        selectedSkill.source === "custom"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                          : "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                      }`}>
                        {selectedSkill.source === "custom" ? "🛠️ 个人自建原创" : "🌐 外部下载 / 开源社区"}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 whitespace-nowrap shrink-0">
                        标识: {selectedSkill.name}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                        更新: {selectedSkill.updatedAt}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pt-1">
                      <Icons.Wrench size={18} className="text-amber-500 shrink-0" />
                      <span>{selectedSkill.title}</span>
                    </h4>

                    {/* Source detail attribution */}
                    <div className="text-xs text-slate-500 flex items-center gap-3 pt-0.5 flex-wrap">
                      <span>作者/贡献者: <strong className="text-slate-700 dark:text-slate-300">{selectedSkill.author || (selectedSkill.source === "custom" ? "我" : "开源社区")}</strong></span>
                      {selectedSkill.sourceUrl && (
                        <a
                          href={selectedSkill.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                          title="访问原始 GitHub 仓库或下载来源"
                        >
                          <span>查看原始来源 ↗</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Actions toolbar */}
                  <div className="flex items-center gap-2 shrink-0 whitespace-nowrap self-start">
                    <button
                      onClick={handleCopyMarkdown}
                      className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
                      title="一键复制技能 Markdown 全文，粘贴进 ChatGPT / Claude / Cursor"
                    >
                      {copySuccess ? <Icons.Check size={14} className="text-emerald-500" /> : <Icons.Copy size={14} />}
                      <span>{copySuccess ? "已复制！" : "复制内容"}</span>
                    </button>

                    <button
                      onClick={handleExportMd}
                      className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="导出为本地 .md 文件"
                    >
                      <Icons.Download size={15} />
                    </button>

                    <button
                      onClick={handleOpenEdit}
                      className="p-1.5 rounded-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                      title="编辑技能信息或说明文档"
                    >
                      <Icons.Edit size={15} />
                    </button>

                    <button
                      onClick={() => handleDeleteSkill(selectedSkill.id, selectedSkill.title)}
                      className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                      title="删除技能"
                    >
                      <Icons.Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* 2. Personal Usage Notes Card (实测心得与个人备注) */}
                <div className="mt-4 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <span>💡 我的使用心得与实测备注</span>
                    </div>

                    {!isNotesEditing ? (
                      <button
                        onClick={() => setIsNotesEditing(true)}
                        className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Icons.Edit size={11} />
                        <span>{selectedSkill.notes ? "编辑心得" : "+ 添加实测心得"}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveNotesInline}
                          className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[11px] font-semibold hover:bg-amber-700"
                        >
                          保存心得
                        </button>
                        <button
                          onClick={() => { setIsNotesEditing(false); setNotesDraft(selectedSkill.notes || ""); }}
                          className="text-[11px] text-slate-400 hover:text-slate-600"
                        >
                          取消
                        </button>
                      </div>
                    )}
                  </div>

                  {isNotesEditing ? (
                    <textarea
                      rows={3}
                      value={notesDraft}
                      onChange={(e) => setNotesDraft(e.target.value)}
                      placeholder="记录此技能在哪些场景最好用、推荐搭配什么模型、或者注意事项..."
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-900/50 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  ) : (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedSkill.notes || (
                        <span className="text-slate-400 italic">暂无实测心得。点击右上方可随时记录对此技能的使用评价或避坑经验。</span>
                      )}
                    </p>
                  )}
                </div>

                {/* 3. Cross-Asset Workflow Linkage Banner (if bound) */}
                {(() => {
                  const linkedWfs = window.StorageEngine.getWorkflowsBySkillId(selectedSkill.id);
                  if (!linkedWfs || linkedWfs.length === 0) return null;
                  return (
                    <div
                      onClick={() => setCurrentView && setCurrentView("workflows")}
                      role="button"
                      tabIndex={0}
                      className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 cursor-pointer hover:border-blue-400 transition-colors flex items-center justify-between text-xs"
                      title="点击直接穿透跳转至编排流水线"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icons.Workflow size={14} className="text-blue-500 shrink-0" />
                        <span className="text-slate-500 dark:text-slate-400">已关联流水线:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {linkedWfs.map(w => w.name).join("、")}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 shrink-0">
                        <span>查看流水线</span>
                        <Icons.ArrowUpRight size={12} />
                      </span>
                    </div>
                  );
                })()}

                {/* 4. Skill Markdown Documentation Content */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                      技能说明与规约正文 (MARKDOWN INSTRUCTIONS)
                    </span>
                    <span>{selectedSkill.markdownContent?.length || 0} 字符</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 max-h-[460px] overflow-y-auto">
                    <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed select-text">
                      {selectedSkill.markdownContent}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                请在左侧选择一项技能进行查看与管理
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Modal: Create Custom Skill */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Plus size={16} className="text-blue-500" />
                <span>新建自建技能</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <Icons.X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    技能标题 *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    placeholder="如: 代码审查与边界防御指南"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    唯一标识 (Slug)
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="如: code-review-standards (留空自动生成)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    技能来源类型
                  </label>
                  <select
                    value={createForm.source}
                    onChange={(e) => setCreateForm({
                      ...createForm,
                      source: e.target.value,
                      author: e.target.value === "custom" ? "我 (自建原创)" : createForm.author
                    })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="custom">🛠️ 个人自建原创</option>
                    <option value="downloaded">🌐 外部渠道下载 / 开源</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    作者 / 署名
                  </label>
                  <input
                    type="text"
                    value={createForm.author}
                    onChange={(e) => setCreateForm({ ...createForm, author: e.target.value })}
                    placeholder="如: 我，或原作者名字"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {createForm.source === "downloaded" && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    原始下载链接 / GitHub 仓库 URL
                  </label>
                  <input
                    type="url"
                    value={createForm.sourceUrl}
                    onChange={(e) => setCreateForm({ ...createForm, sourceUrl: e.target.value })}
                    placeholder="https://github.com/owner/repo"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    分类 (Category)
                  </label>
                  <input
                    type="text"
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    placeholder="如: Git, Code, Standards"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    标签 (逗号分隔)
                  </label>
                  <input
                    type="text"
                    value={createForm.tags}
                    onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
                    placeholder="TypeScript, Quality, BestPractice"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  简要说明 (Description)
                </label>
                <input
                  type="text"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="一句话说明该技能的作用与用途"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  💡 个人使用心得 / 实测备注
                </label>
                <textarea
                  rows={2}
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
                  placeholder="记录自己的避坑经验、搭配哪个模型效果最好等..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  技能正文 (Markdown Content) *
                </label>
                <textarea
                  rows={10}
                  required
                  value={createForm.markdownContent}
                  onChange={(e) => setCreateForm({ ...createForm, markdownContent: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  保存并收纳
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal: Edit Existing Skill */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Edit size={16} className="text-blue-500" />
                <span>编辑技能信息与正文</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <Icons.X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    技能标题 *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    唯一标识 (Slug)
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    来源分类
                  </label>
                  <select
                    value={editForm.source}
                    onChange={(e) => setEditForm({ ...editForm, source: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="custom">🛠️ 个人自建原创</option>
                    <option value="downloaded">🌐 外部渠道下载 / 开源</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    作者 / 贡献者
                  </label>
                  <input
                    type="text"
                    value={editForm.author}
                    onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {editForm.source === "downloaded" && (
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    原始下载链接 / GitHub 仓库 URL
                  </label>
                  <input
                    type="url"
                    value={editForm.sourceUrl}
                    onChange={(e) => setEditForm({ ...editForm, sourceUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    分类 (Category)
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                    版本号 (Version)
                  </label>
                  <input
                    type="text"
                    value={editForm.version}
                    onChange={(e) => setEditForm({ ...editForm, version: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  简要说明 (Description)
                </label>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  💡 我的使用心得与实测备注
                </label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  placeholder="记录避坑经验、推荐搭配什么模型等..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  技能正文 (Markdown Content) *
                </label>
                <textarea
                  rows={10}
                  required
                  value={editForm.markdownContent}
                  onChange={(e) => setEditForm({ ...editForm, markdownContent: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  更新保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
