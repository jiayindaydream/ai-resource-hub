// Architecture Spec & Design Whitepaper Modal
window.ArchitectureModal = function ArchitectureModal({ isOpen, onClose }) {
  const Icons = window.Icons;
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestAll = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult({
        pmLatency: 28,
        karaLatency: 22,
        liteLatency: 16
      });
      setTimeout(() => setTestResult(null), 4000);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Icons.ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white">
                AI Resource Hub 技术架构与设计方案说明
              </h3>
              <p className="text-[11px] text-slate-400">
                面向高可用、可落地、低开发成本的个人 AI 资产聚合工作台
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Icons.X size={17} />
          </button>
        </div>

        {/* Core Principles */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
            一、核心架构哲学：深度复用成熟开源，拒绝重复造轮子
          </h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            本项目采用 <strong>「自建统一工作台 + 三大独立开源微服务」</strong> 的松耦合架构。自建前端负责<strong>统一导航、综合 Dashboard 看板、跨模块资产索引与关系链编排</strong>，外部微服务独立部署各司其职，<strong>坚决不强行合并数据库</strong>，保持各项目的平滑升级能力：
          </p>
        </div>

        {/* 3 Open Source Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Icons.MessageSquare size={13} className="text-blue-500" />
                <span>PromptManager</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                {testResult ? `${testResult.pmLatency}ms` : "在线就绪"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              优先复用 <code>sidambili/prompt-manager</code>，负责 Prompt 语义版本追踪、变量模板提取与提示词分类管理。
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Icons.Github size={13} className="text-emerald-500" />
                <span>Karakeep (Hoarder)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                {testResult ? `${testResult.karaLatency}ms` : "在线就绪"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              优先复用 <code>karakeep-app/karakeep</code>，负责 GitHub 仓库 Stars/语言自动解析与网页元数据爬取。
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Icons.Key size={13} className="text-indigo-500" />
                <span>LiteLLM Proxy</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                {testResult ? `${testResult.liteLatency}ms` : "在线就绪"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              优先复用 <code>BerriAI/litellm</code>，负责统一各模型路由网关、真实 API Key 密文隔离与 Token/费用精准核算。
            </p>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400">
            二、关键工程技术亮点
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <strong>1. 真实账单 vs 理论估算分离</strong>：精确区分实际扣费发票与基于 Token 官方计费标准的理论估算。
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <strong>2. 双模平滑切换 (Live / Demo)</strong>：未接入后端时提供高保真交互演示，配置后一键接入真实微服务。
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <strong>3. 零后端极速部署</strong>：纯前端现代 SPA，支持直接托管在 GitHub Pages、Vercel 或 Netlify 上。
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <strong>4. 全局命令快捷键 (Ctrl+K)</strong>：支持在全量 Prompt、Skill 与 GitHub 开源库中毫秒级联想搜索。
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <button
            disabled={testing}
            onClick={handleTestAll}
            className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {testing ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Icons.RefreshCw size={12} />
            )}
            <span>模拟测试三大微服务健康状态</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};
