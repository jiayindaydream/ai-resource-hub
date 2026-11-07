// Workflows View Component (Phase 3: Chaining Prompts, Skills, GitHub Repos, and Models)
window.WorkflowsView = function WorkflowsView({ state, setCurrentView }) {
  const Icons = window.Icons;
  const [showAddModal, setShowAddModal] = useState(false);
  const [runningId, setRunningId] = useState(null);
  const [runLog, setRunLog] = useState(null);

  // New Workflow form state
  const [wfName, setWfName] = useState("");
  const [wfDesc, setWfDesc] = useState("");
  const [linkedPrompt, setLinkedPrompt] = useState(state.prompts[0]?.id || "");
  const [linkedSkill, setLinkedSkill] = useState(state.skills[0]?.id || "");
  const [linkedRepo, setLinkedRepo] = useState(state.githubProjects[0]?.id || "");
  const [recModel, setRecModel] = useState("claude-3-5-sonnet");

  const handleSimulateRun = (wf) => {
    const prompt = state.prompts.find(p => p.id === wf.linkedPromptId);
    const skill = state.skills.find(s => s.id === wf.linkedSkillId);
    const repo = state.githubProjects.find(r => r.id === wf.linkedGithubRepoId);

    setRunningId(wf.id);
    setRunLog({
      wfTitle: wf.name,
      status: "running",
      stepsCompleted: 0,
      totalSteps: 4,
      logs: [
        "🚀 启动端到端自动化编排工作流...",
        `📦 正在链接关联代码库: ${repo ? repo.fullName : "通用仓库"} (★ ${repo ? repo.stars.toLocaleString() : 0})`,
        `🛡️ 注入工程执行规约: ${skill ? skill.name : "默认标准"}`
      ]
    });

    setTimeout(() => {
      setRunLog(prev => ({
        ...prev,
        stepsCompleted: 1,
        logs: [...prev.logs, `✅ 步骤 1: 规则校验通过，规约标准 v${skill?.version || "1.0.0"} 注入上下文`]
      }));
    }, 700);

    setTimeout(() => {
      setRunLog(prev => ({
        ...prev,
        stepsCompleted: 2,
        logs: [...prev.logs, `🤖 步骤 2: 调用基座大模型 [${wf.recommendedModel}] 执行提示词评估...`]
      }));
    }, 1500);

    setTimeout(() => {
      setRunLog(prev => ({
        ...prev,
        stepsCompleted: 3,
        logs: [...prev.logs, `📊 步骤 3: 提示词模板 [${prompt?.title || "核心模版"}] 参数插槽替换完成`]
      }));
    }, 2200);

    setTimeout(() => {
      setRunLog(prev => ({
        ...prev,
        status: "completed",
        stepsCompleted: 4,
        logs: [
          ...prev.logs,
          "🎉 步骤 4: 执行成功并完成结构化归档！",
          "📈 耗时: 2,180ms | 消耗: 1,480 Tokens | 折合账单: $0.0092 USD | 状态: 200 OK"
        ]
      }));
      setRunningId(null);
    }, 2900);
  };

  const handleCreateWorkflow = (e) => {
    e.preventDefault();
    if (!wfName.trim()) return;

    const promptObj = state.prompts.find(p => p.id === linkedPrompt);
    const skillObj = state.skills.find(s => s.id === linkedSkill);
    const repoObj = state.githubProjects.find(r => r.id === linkedRepo);

    const newWf = {
      name: wfName.trim(),
      description: wfDesc.trim() || "自动化编排流水线",
      linkedPromptId: linkedPrompt,
      linkedSkillId: linkedSkill,
      linkedGithubRepoId: linkedRepo,
      recommendedModel: recModel,
      triggerType: "Git Hook / API Trigger",
      steps: [
        { step: 1, title: "代码库关联与规则注入", agent: "Knowledge Ingestion", repo: repoObj?.name || "开源库" },
        { step: 2, title: "工程规约静态分析", agent: "Skill Auditor", skill: skillObj?.name || "通用标准" },
        { step: 3, title: "提示词上下文合成与模型推理", agent: "LLM Runner", prompt: promptObj?.title || "核心提示词" }
      ]
    };

    window.StorageEngine.addWorkflow(newWf);
    setShowAddModal(false);
    setWfName("");
    setWfDesc("");
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Workflows 编排流水线</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
              {state.workflows.length} 条已激活
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            将 Prompt 提示词、Skill 规则标准、GitHub 开源库与底层大模型串联为端到端自动化处理流水线
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all"
        >
          <Icons.Plus size={15} />
          <span>新建编排工作流</span>
        </button>
      </div>

      {/* Workflow Cards or Empty State */}
      {state.workflows.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Icons.Workflow size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">暂无编排流水线</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            你可以将 Prompt 提示词、Skill 技能包、GitHub 开源库与基座大模型串联起来，创建自动化处理流水线。
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all mt-2"
          >
            <Icons.Plus size={14} />
            <span>创建第一条工作流</span>
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {state.workflows.map(wf => {
          const prompt = state.prompts.find(p => p.id === wf.linkedPromptId);
          const skill = state.skills.find(s => s.id === wf.linkedSkillId);
          const repo = state.githubProjects.find(r => r.id === wf.linkedGithubRepoId);

          return (
            <div
              key={wf.id}
              className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:border-purple-500/30 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
                    <Icons.Workflow size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <span>{wf.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0">
                        {wf.status === "active" ? "运行中" : "就绪"}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{wf.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 whitespace-nowrap self-start xl:self-auto">
                  <div className="text-right text-[11px] text-slate-400 hidden sm:block whitespace-nowrap leading-relaxed">
                    <div className="whitespace-nowrap">触发策略: {wf.triggerType}</div>
                    <div className="whitespace-nowrap">累计运行: {wf.executionCount || 0} 次 · 响应 {wf.avgLatencyMs}ms</div>
                  </div>

                  <button
                    disabled={runningId === wf.id}
                    onClick={() => handleSimulateRun(wf)}
                    className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
                  >
                    {runningId === wf.id ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                        <span className="whitespace-nowrap">流水线执行中...</span>
                      </>
                    ) : (
                      <>
                        <Icons.Play size={13} className="shrink-0" />
                        <span className="whitespace-nowrap">一键执行流水线</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Phase 3 Core Highlight: Cross-Asset Relational Chain */}
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    跨模块资产依赖关系图 (CROSS-ASSET DEPENDENCY GRAPH)
                  </span>
                  <span className="text-[10px] text-blue-500 font-medium">双向可穿透索引</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {/* Linked Prompt */}
                  <div
                    onClick={() => setCurrentView && setCurrentView("prompts")}
                    role="button"
                    tabIndex={0}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-sm transition-all group/p"
                    title="点击跳转查看对应 Prompt 模板"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                        <Icons.MessageSquare size={13} />
                      </span>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-slate-400 leading-none">关联 Prompt</div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-1">
                          {prompt ? prompt.title : "未绑定"}
                        </div>
                      </div>
                    </div>
                    <Icons.ArrowUpRight size={12} className="text-slate-300 group-hover/p:text-blue-500 transition-colors shrink-0" />
                  </div>

                  {/* Linked Skill */}
                  <div
                    onClick={() => setCurrentView && setCurrentView("skills")}
                    role="button"
                    tabIndex={0}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-sm transition-all group/s"
                    title="点击跳转查看对应 Skill 技能文档"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 shrink-0">
                        <Icons.Wrench size={13} />
                      </span>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-slate-400 leading-none">关联 Skill 技能</div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-1">
                          {skill ? skill.title : "未绑定"}
                        </div>
                      </div>
                    </div>
                    <Icons.ArrowUpRight size={12} className="text-slate-300 group-hover/s:text-amber-500 transition-colors shrink-0" />
                  </div>

                  {/* Linked GitHub Repo */}
                  <div
                    onClick={() => setCurrentView && setCurrentView("github")}
                    role="button"
                    tabIndex={0}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-sm transition-all group/g"
                    title="点击跳转查看对应 GitHub 开源库"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Icons.Github size={13} />
                      </span>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-slate-400 leading-none">关联开源代码库</div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate mt-1">
                          {repo ? repo.fullName : "未指定"}
                        </div>
                      </div>
                    </div>
                    <Icons.ArrowUpRight size={12} className="text-slate-300 group-hover/g:text-emerald-500 transition-colors shrink-0" />
                  </div>

                  {/* Linked Model */}
                  <div
                    onClick={() => setCurrentView && setCurrentView("usage-analytics")}
                    role="button"
                    tabIndex={0}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-sm transition-all group/m"
                    title="点击跳转查看模型用量与费用分析"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 shrink-0">
                        <Icons.Cpu size={13} />
                      </span>
                      <div className="overflow-hidden">
                        <div className="text-[10px] text-slate-400 leading-none">推荐执行模型</div>
                        <div className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 truncate mt-1">
                          {wf.recommendedModel}
                        </div>
                      </div>
                    </div>
                    <Icons.ArrowUpRight size={12} className="text-slate-300 group-hover/m:text-purple-500 transition-colors shrink-0" />
                  </div>
                </div>
              </div>

              {/* Pipeline Steps */}
              <div className="pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  执行编排步骤序列 (PIPELINE EXECUTION STEPS)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {wf.steps.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3 relative overflow-hidden"
                    >
                      <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {st.step}
                      </span>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {st.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {st.skill ? `技能: ${st.skill}` : st.prompt ? `提示词: ${st.prompt}` : st.repo ? `技术库: ${st.repo}` : st.target || st.action}
                        </div>
                        <span className="mt-1.5 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                          执行节点: {st.agent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => window.StorageEngine.deleteWorkflow(wf.id)}
                  className="text-slate-400 hover:text-rose-500 text-[11px] transition-colors"
                >
                  删除工作流
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Execution Run Log Modal */}
      {runLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Play size={16} className="text-purple-500" />
                <span>流水线执行状态: {runLog.wfTitle}</span>
              </h3>
              <button onClick={() => setRunLog(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Icons.X size={16} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-slate-200 space-y-2 max-h-64 overflow-y-auto">
              {runLog.logs.map((lg, i) => (
                <div key={i} className="leading-relaxed">
                  {lg}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                步骤进度: {runLog.stepsCompleted} / {runLog.totalSteps}
              </span>
              <button
                onClick={() => setRunLog(null)}
                className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Workflow Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Workflow size={16} className="text-purple-500" />
                <span>新建自动化编排工作流</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Icons.X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">工作流名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例如: 智能长文本研读与卡片提炼管线"
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">工作流目标描述</label>
                <input
                  type="text"
                  placeholder="描述其业务价值与自动化节点..."
                  value={wfDesc}
                  onChange={(e) => setWfDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">绑定提示词</label>
                  <select
                    value={linkedPrompt}
                    onChange={(e) => setLinkedPrompt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {state.prompts.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">绑定执行技能 (Skill)</label>
                  <select
                    value={linkedSkill}
                    onChange={(e) => setLinkedSkill(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {state.skills.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">绑定参考开源库</label>
                  <select
                    value={linkedRepo}
                    onChange={(e) => setLinkedRepo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {state.githubProjects.map(r => (
                      <option key={r.id} value={r.id}>{r.fullName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">推荐基座模型</label>
                  <select
                    value={recModel}
                    onChange={(e) => setRecModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  >
                    <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="deepseek-coder-v2">deepseek-coder-v2</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                  </select>
                </div>
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
                  className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md shadow-purple-500/20"
                >
                  创建工作流
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
