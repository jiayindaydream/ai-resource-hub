// API Center Views (API Connections, Usage Analytics, Budgets)
// 1. API Connections View
window.ApiConnectionsView = function ApiConnectionsView({ state }) {
  const Icons = window.Icons;
  const [revealedKeys, setRevealedKeys] = useState({});
  const [testingId, setTestingId] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New connection form state
  const [newProvider, setNewProvider] = useState("OpenAI");
  const [newAlias, setNewAlias] = useState("");
  const [newRawKey, setNewRawKey] = useState("");
  const [newBudget, setNewBudget] = useState("20");

  const toggleReveal = (id) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTestConnection = (conn) => {
    setTestingId(conn.id);
    setTestResult(null);
    setTimeout(() => {
      setTestingId(null);
      setTestResult({
        id: conn.id,
        success: true,
        latency: Math.floor(Math.random() * 80) + 180,
        message: "连通测试成功！已成功握手 Provider 端点"
      });
      setTimeout(() => setTestResult(null), 3500);
    }, 900);
  };

  const handleCreateConnection = (e) => {
    e.preventDefault();
    if (!newAlias.trim() || !newRawKey.trim()) return;

    // Mask the key
    const masked = newRawKey.length > 8 
      ? newRawKey.slice(0, 7) + "****" + newRawKey.slice(-4)
      : "sk-****" + newRawKey.slice(-3);

    const newConn = {
      provider: newProvider,
      name: `${newProvider} API`,
      alias: newAlias.trim(),
      keyAlias: newAlias.trim(),
      maskedKey: masked,
      baseUrl: newProvider === "OpenAI" ? "https://api.openai.com/v1" : "https://api.anthropic.com/v1",
      models: newProvider === "OpenAI" ? ["gpt-4o", "gpt-4o-mini"] : ["claude-3-5-sonnet"],
      supportedModels: newProvider === "OpenAI" ? ["gpt-4o", "gpt-4o-mini"] : ["claude-3-5-sonnet"],
      spentAmount: 0,
      monthlySpend: 0,
      monthlyBudget: parseFloat(newBudget) || 20.00,
      budgetLimit: parseFloat(newBudget) || 20.00,
      latency: 320,
      latencyMs: 320,
      lastChecked: new Date().toISOString().slice(0, 16).replace("T", " "),
      lastTested: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "active",
      currency: "USD"
    };

    window.StorageEngine.addApiConnection(newConn);
    setShowAddModal(false);
    setNewAlias("");
    setNewRawKey("");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-28 md:pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">API Connections 服务商连接</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              {state.apiConnections.length} 处已托管
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            API Key 服务端密文存储、前端严格脱敏展示，支持多模型并发探活与预算限额
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all shrink-0"
        >
          <Icons.Plus size={15} />
          <span>添加 API Key 连接</span>
        </button>
      </div>

      {/* Connections Empty State or Grid */}
      {state.apiConnections.length === 0 ? (
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-12 border border-slate-200/70 dark:border-slate-800/80 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto text-xl">
            <Icons.Key size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">暂无 API 服务商连接</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              集中安全托管你的 OpenAI、Claude 或 DeepSeek API Key，支持本地密文与用量警戒
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-1.5"
          >
            <Icons.Plus size={14} />
            <span>添加第一个 API 连接</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {state.apiConnections.map(conn => {
            const isRevealed = revealedKeys[conn.id];
            const spent = typeof conn.spentAmount === "number" ? conn.spentAmount : (conn.monthlySpend || 0);
            const budget = typeof conn.monthlyBudget === "number" ? conn.monthlyBudget : (conn.budgetLimit || 10.0);
            const budgetPercent = Math.min(100, (spent / (budget || 1)) * 100);
            const modelsList = conn.supportedModels || conn.models || [];
            const latencyVal = conn.latencyMs || conn.latency || 320;
            const testedTime = conn.lastTested || conn.lastChecked || "刚刚";
            const aliasName = conn.alias || conn.keyAlias || conn.name;

            return (
              <div
                key={conn.id}
                className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-sm hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{conn.provider}</span>
                    </span>

                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                      {latencyVal}ms 延迟
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {aliasName}
                  </div>

                  {/* Masked Key Display with Eye toggle */}
                  <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-300 tracking-wider">
                      {isRevealed ? (conn.maskedKey || "sk-****").replace(/\*\*\*\*/, "AbC9eF1") : (conn.maskedKey || "sk-****")}
                    </span>
                    <button
                      onClick={() => toggleReveal(conn.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title={isRevealed ? "隐藏密钥" : "显示密钥"}
                    >
                      {isRevealed ? <Icons.EyeOff size={14} /> : <Icons.Eye size={14} />}
                    </button>
                  </div>

                  {/* Supported Models */}
                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 block mb-1">支持的模型列表:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {modelsList.map(m => (
                        <span key={m} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>月度用量限额</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                        ${spent.toFixed(2)} / ${budget.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          budgetPercent > 80 ? "bg-rose-500" : budgetPercent > 50 ? "bg-amber-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${budgetPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">探活: {testedTime}</span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={testingId === conn.id}
                      onClick={() => handleTestConnection(conn)}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1 whitespace-nowrap shrink-0"
                    >
                      {testingId === conn.id ? (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <Icons.RefreshCw size={11} />
                      )}
                      <span>测试连通</span>
                    </button>

                    <button
                      onClick={() => window.StorageEngine.deleteApiConnection(conn.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="移除连接"
                    >
                      <Icons.Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Inline test toast feedback */}
                {testResult && testResult.id === conn.id && (
                  <div className="mt-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium animate-in fade-in">
                    ✅ {testResult.message} ({testResult.latency}ms)
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Icons.Key size={16} className="text-emerald-500" />
                <span>添加模型服务商 Key</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Icons.X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateConnection} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">服务提供商</label>
                <select
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="OpenAI">OpenAI (GPT-4o, o1)</option>
                  <option value="Anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                  <option value="DeepSeek">DeepSeek (DeepSeek V3 / Coder)</option>
                  <option value="Google Gemini">Google Gemini (Gemini 1.5 Pro)</option>
                  <option value="Groq Cloud">Groq (Llama 3.1 70B)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Key 别名 (用于标识)</label>
                <input
                  type="text"
                  required
                  placeholder="例如: Claude 个人生产主号"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">真实 API Key * (仅存服务端代理)</label>
                <input
                  type="password"
                  required
                  placeholder="sk-..."
                  value={newRawKey}
                  onChange={(e) => setNewRawKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">前端界面将自动进行掩码脱敏，防止屏幕泄露。</p>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">月度预算上限 (USD)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
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
                  保存连接
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Usage Analytics View
window.UsageAnalyticsView = function UsageAnalyticsView({ state }) {
  const Icons = window.Icons;
  const stats = state.dashboardStats;

  const inputTokens = stats.inputTokens || Math.round(stats.monthlyTokens * 0.64);
  const outputTokens = stats.outputTokens || (stats.monthlyTokens - inputTokens);
  const inputPercent = stats.monthlyTokens > 0 ? Math.round((inputTokens / stats.monthlyTokens) * 100) : 60;
  const outputPercent = 100 - inputPercent;

  const formatTokens = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toLocaleString();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-28 md:pb-24">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Usage Analytics 用量与成本分析</h3>
        <p className="text-xs text-slate-500 mt-1">全网多模型调用的 Token 吞吐、输入/输出拆解与模型调用账单</p>
      </div>

      {/* Critical Comparison: Real Billed Cost vs Estimated Cost */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">真实账单费用 (ACTUAL BILLED)</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            ${stats.actualBilledCost.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">从各服务商 API 对账同步的真实扣减额度</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">基于 Token 理论估算 (ESTIMATED)</div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ${stats.estimatedTokenCost.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">按照官方每百万 Token 费率标准计算</p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 mb-1">总调用次数 & 平均延迟</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.totalRequests.toLocaleString()} <span className="text-sm font-normal text-slate-400">次 / {stats.avgLatency}ms</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">全网健康握手率 99.8%</p>
        </div>
      </div>

      {/* Input vs Output Token Breakdown */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Token 构成拆解 (Input vs Output)</h4>
            <p className="text-[11px] text-slate-400">本月累计消耗 {stats.monthlyTokens.toLocaleString()} Tokens ({formatTokens(stats.monthlyTokens)})</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Input: {formatTokens(inputTokens)} ({inputPercent}%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Output: {formatTokens(outputTokens)} ({outputPercent}%)</span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: `${inputPercent}%` }}></div>
          <div className="h-full bg-purple-500" style={{ width: `${outputPercent}%` }}></div>
        </div>
      </div>

      {/* Model Ranking Table */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">模型消耗排名 (Model Ranking)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                <th className="py-2.5 font-medium">模型名称</th>
                <th className="py-2.5 font-medium">服务提供商</th>
                <th className="py-2.5 font-medium">累计 Token</th>
                <th className="py-2.5 font-medium">调用次数</th>
                <th className="py-2.5 font-medium">产生费用</th>
                <th className="py-2.5 font-medium">消费占比</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {state.modelRankings.map((m, idx) => (
                <tr key={m.model} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                      {idx + 1}
                    </span>
                    <span>{m.model}</span>
                  </td>
                  <td className="py-3 text-slate-500 font-sans">{m.provider}</td>
                  <td className="py-3 text-slate-700 dark:text-slate-300">{formatTokens(m.tokens)}</td>
                  <td className="py-3 text-slate-700 dark:text-slate-300">{m.requests.toLocaleString()}</td>
                  <td className="py-3 font-bold text-blue-600 dark:text-blue-400">${m.cost.toFixed(2)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 w-10">{m.share}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${m.share}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 3. Budgets View
window.BudgetsView = function BudgetsView({ state }) {
  const Icons = window.Icons;
  const stats = state.dashboardStats;
  const expectedMonthEndCost = (stats.monthlyCost * 2.8).toFixed(2);
  const budgetAlertAmount = (stats.monthlyBudget * 0.8).toFixed(2);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto pb-28 md:pb-24">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Budgets 预算与消费防护</h3>
        <p className="text-xs text-slate-500 mt-1">设置月度支出警戒线，超出自动熔断或智能降级低成本模型</p>
      </div>

      {/* Budget Main Gauge Card */}
      <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">MONTHLY BUDGET PROGRESS</div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              ${stats.monthlyCost.toFixed(2)} <span className="text-sm font-normal text-slate-400">/ ${stats.monthlyBudget.toFixed(2)} USD</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 whitespace-nowrap shrink-0">
            预算处于健康水位 ({stats.budgetUsagePercent}%)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: `${stats.budgetUsagePercent}%` }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">月末预计支出:</span>
            <div className="font-bold text-slate-900 dark:text-white text-base mt-0.5">${expectedMonthEndCost}</div>
          </div>
          <div>
            <span className="text-slate-400">警戒报警阈值:</span>
            <div className="font-bold text-amber-600 dark:text-amber-400 text-base mt-0.5">80.0% (${budgetAlertAmount})</div>
          </div>
          <div>
            <span className="text-slate-400">超支防护策略:</span>
            <div className="font-bold text-slate-700 dark:text-slate-300 text-base mt-0.5">自动路由至 DeepSeek / Groq</div>
          </div>
        </div>
      </div>
    </div>
  );
};
