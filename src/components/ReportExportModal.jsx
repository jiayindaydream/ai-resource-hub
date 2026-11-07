// Report Export Modal for AI Resource Hub (Phase 3: Portfolio Summary & Markdown Export)
window.ReportExportModal = function ReportExportModal({ isOpen, onClose, state }) {
  const Icons = window.Icons;
  const [activeTab, setActiveTab] = useState("preview"); // "preview" | "markdown"
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const stats = state.dashboardStats;
  const mdReport = window.StorageEngine.generateMarkdownReport();

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(mdReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([mdReport], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI_Resource_Hub_Portfolio_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Icons.FileText size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                  AI 资产全景评估报告
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                包含跨模块资产依赖图、开源复用技术矩阵与 LiteLLM 多模型账单核算
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icons.X size={18} />
          </button>
        </div>

        {/* Tab & Action Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {/* Tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 w-fit">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "preview"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              📄 排版高保真预览
            </button>
            <button
              onClick={() => setActiveTab("markdown")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "markdown"
                  ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              📝 Markdown 源码
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all active:scale-95"
            >
              {copied ? <Icons.Check size={13} /> : <Icons.Copy size={13} />}
              <span>{copied ? "已复制到剪贴板！" : "一键复制 Markdown"}</span>
            </button>

            <button
              onClick={handleDownloadMd}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60 transition-all"
            >
              <Icons.Download size={13} />
              <span>下载 .md</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200/60 dark:border-slate-700/60 transition-all"
              title="打印或另存为 PDF"
            >
              <Icons.Zap size={13} />
              <span>打印 / 另存为 PDF</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === "preview" ? (
            <div className="space-y-6 text-slate-800 dark:text-slate-200">
              {/* Executive Metrics Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40">
                  <div className="text-[11px] text-slate-400 font-medium">Prompts 提示词</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {state.prompts.length} 条
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">语义版本化与插槽</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40">
                  <div className="text-[11px] text-slate-400 font-medium">Skills 规约规范</div>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                    {state.skills.length} 项
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">智能体系统协议</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-900/40">
                  <div className="text-[11px] text-slate-400 font-medium">编排自动化管线</div>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                    {state.workflows.length} 条
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">跨模块资产端到端</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40">
                  <div className="text-[11px] text-slate-400 font-medium">本月真实账单</div>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ${stats.actualBilledCost.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Token: {stats.monthlyTokens >= 500000 ? (stats.monthlyTokens / 1000000).toFixed(2) + "M" : (stats.monthlyTokens / 1000).toFixed(0) + "K"}
                  </div>
                </div>
              </div>

              {/* Section 1: Decoupled Architecture Spec */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Icons.ShieldCheck size={15} className="text-blue-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    核心工程准则：自建统一前端 + 三大成熟开源微服务
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  拒绝低水平从零造轮子，自建统一工作台负责综合 Dashboard、跨模块资产关联编排与搜索索引；底层深度集成成熟开源项目：
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">sidambili/prompt-manager</span>
                    <p className="text-[11px] text-slate-500 mt-1">负责 Prompt 语义版本控制与参数插槽</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">karakeep-app/karakeep</span>
                    <p className="text-[11px] text-slate-500 mt-1">负责 GitHub 仓库元数据自动抓取与研读生命周期</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">BerriAI/litellm</span>
                    <p className="text-[11px] text-slate-500 mt-1">统一模型路由代理，API Key 服务端隔离与账单核对</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Cross-Asset Relational Graph Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Icons.Workflow size={15} className="text-purple-500" />
                    <span>跨模块资产依赖关系链编排矩阵 (Workflows 4-Asset Chain)</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">已形成闭环工程实践</span>
                </div>

                <div className="space-y-3">
                  {state.workflows.map((wf, idx) => {
                    const prompt = state.prompts.find(p => p.id === wf.linkedPromptId);
                    const skill = state.skills.find(s => s.id === wf.linkedSkillId);
                    const repo = state.githubProjects.find(r => r.id === wf.linkedGithubRepoId);

                    return (
                      <div
                        key={wf.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-sm space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {wf.name}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            执行 {wf.executionCount} 次 · 延迟 {wf.avgLatencyMs}ms
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {wf.description}
                        </p>

                        {/* 4 Dependency Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-xs">
                          <div className="p-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/40 dark:border-blue-900/30 flex items-center gap-2">
                            <Icons.MessageSquare size={13} className="text-blue-500 shrink-0" />
                            <div className="overflow-hidden">
                              <div className="text-[10px] text-slate-400 leading-none">依赖 Prompt</div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                                {prompt ? prompt.title : "未绑定"}
                              </div>
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/40 dark:border-amber-900/30 flex items-center gap-2">
                            <Icons.Wrench size={13} className="text-amber-500 shrink-0" />
                            <div className="overflow-hidden">
                              <div className="text-[10px] text-slate-400 leading-none">执行规约 Skill</div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                                {skill ? skill.name : "未绑定"}
                              </div>
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/40 dark:border-emerald-900/30 flex items-center gap-2">
                            <Icons.Github size={13} className="text-emerald-500 shrink-0" />
                            <div className="overflow-hidden">
                              <div className="text-[10px] text-slate-400 leading-none">技术开源依据</div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                                {repo ? repo.fullName : "未指定"}
                              </div>
                            </div>
                          </div>

                          <div className="p-2 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/40 dark:border-purple-900/30 flex items-center gap-2">
                            <Icons.Cpu size={13} className="text-purple-500 shrink-0" />
                            <div className="overflow-hidden">
                              <div className="text-[10px] text-slate-400 leading-none">基座大模型</div>
                              <div className="font-mono font-semibold text-purple-600 dark:text-purple-400 truncate mt-0.5">
                                {wf.recommendedModel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Cost Accounting Standard */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Icons.DollarSign size={15} className="text-emerald-500" />
                    <span>费用与审计口径规范 (Cost & Audit Compliance)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">已核对无违约调用</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200">真实扣减账单发票 (${stats.actualBilledCost.toFixed(2)})</div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      严格对应 OpenAI、Anthropic、DeepSeek 等服务商后台月度结算发票扣款，属于财务实际支出。
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                    <div className="font-bold text-slate-800 dark:text-slate-200">Token 理论估算模型 (${stats.estimatedTokenCost.toFixed(2)})</div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      基于 LiteLLM 捕获的 Input/Output Token 精确计费，用于排查模型缓存命中率与提示词压缩空间。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Raw Markdown View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>标准 GitHub Flavored Markdown 格式，可直接导出与技术归档</span>
                <span>{mdReport.length} 字符</span>
              </div>
              <textarea
                readOnly
                value={mdReport}
                className="w-full h-[480px] p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 select-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
