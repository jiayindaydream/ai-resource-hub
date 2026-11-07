// AI Resource Hub - Clean Starter Data (Designed for multi-user / public usage)
window.MockData = {
  // KPI Dashboard Baseline
  dashboardStats: {
    promptCount: 2,
    skillCount: 2,
    workflowCount: 1,
    githubBookmarkCount: 2,
    monthlyTokens: 184500,
    monthlyCost: 0.62,
    actualBilledCost: 0.58,
    estimatedTokenCost: 0.62,
    monthlyBudget: 20.00,
    budgetUsagePercent: 3.1,
    totalRequests: 42,
    avgLatency: 480
  },

  // Clean 7-day Usage Trend
  dailyTrends: [
    { date: "11-01", tokens: 18500, cost: 0.06, requests: 5 },
    { date: "11-02", tokens: 24200, cost: 0.08, requests: 6 },
    { date: "11-03", tokens: 19800, cost: 0.07, requests: 4 },
    { date: "11-04", tokens: 32100, cost: 0.11, requests: 8 },
    { date: "11-05", tokens: 28400, cost: 0.10, requests: 7 },
    { date: "11-06", tokens: 36500, cost: 0.12, requests: 8 },
    { date: "11-07", tokens: 25000, cost: 0.08, requests: 4 }
  ],

  // Model Rankings & Distribution
  modelRankings: [
    { model: "claude-3-5-sonnet", provider: "Anthropic", tokens: 88500, cost: 0.32, requests: 20, share: 48.0 },
    { model: "gpt-4o", provider: "OpenAI", tokens: 64000, cost: 0.22, requests: 14, share: 34.7 },
    { model: "deepseek-chat", provider: "DeepSeek", tokens: 32000, cost: 0.08, requests: 8, share: 17.3 }
  ],

  // 2 Curated Starter Prompts
  prompts: [
    {
      id: "pm-01",
      title: "代码审查与重构专家",
      description: "针对代码变更进行深度分析、潜在并发与边界 Bug 检测、性能排查及 Clean Code 重构建议。",
      category: "Code Review",
      tags: ["TypeScript", "Architecture", "CleanCode", "Optimization"],
      currentVersion: "v1.0.0",
      versions: [
        { version: "v1.0.0", date: "2026-11-01", note: "首个基础模板版本" }
      ],
      templateContent: `你是一位具备丰富架构经验的首席资深工程师。
请仔细阅读以下 {{language}} 代码或 Diff：
\`\`\`{{language}}
{{code}}
\`\`\`

请从以下 4 个维度进行专业评审：
1. **潜在风险与 Bug**：重点检查竞态条件、边界溢出、未处理异常及空指针。
2. **性能与伸缩性**：分析时间/空间复杂度，识别冗余计算或不必要的重渲染。
3. **安全隐患**：注入风险、未脱敏敏感数据、权限校验遗漏。
4. **重构代码建议**：给出更高内聚、低耦合的重构后完整代码方案。`,
      variables: ["language", "code"],
      author: "当前用户",
      favorite: true,
      copyCount: 14,
      updatedAt: "2026-11-05"
    },
    {
      id: "pm-02",
      title: "提示词优化与工程化蒸馏器",
      description: "将口语化、冗长模糊的原始 Prompt 重构为结构严谨、约束明确、低 Token 消耗的 System Prompt。",
      category: "Prompt Engineering",
      tags: ["PromptEngineering", "Optimization", "SystemPrompt"],
      currentVersion: "v1.0.0",
      versions: [
        { version: "v1.0.0", date: "2026-11-03", note: "支持变量插槽与约束生成" }
      ],
      templateContent: `你是一位专业 Prompt 工程师。请根据用户给出的粗略目标，重构为符合生产标准的结构化提示词。

【目标任务说明】：
{{target_task}}

【期望使用的模型】：
{{model_name}}

请按如下规范输出重构后的 System Prompt：
1. **Role & Identity**：精确定义模型定位与专业基调。
2. **Constraints**：强制约束与负面清单（避免幻觉与偏航）。
3. **Input / Output Format**：输入插槽及严谨的输出格式规范。
4. **Few-Shot Examples**：1-2 个高质量黄金示例。`,
      variables: ["target_task", "model_name"],
      author: "当前用户",
      favorite: true,
      copyCount: 8,
      updatedAt: "2026-11-06"
    }
  ],

  // 2 Curated Starter Skills (Custom Built & Downloaded from Community)
  skills: [
    {
      id: "sk-01",
      name: "conventional-commits",
      title: "Conventional Commits 语义化提交规范",
      category: "Git & Workflow",
      version: "1.0.0",
      source: "downloaded",
      author: "Conventional Commits Community",
      sourceUrl: "https://www.conventionalcommits.org",
      tags: ["Git", "Standard", "Commit"],
      description: "行业通用的规范化 Git Commit 提交消息约束，方便自动生成 Changelog 与语义化版本号。",
      notes: "行业公认的标准提交规范，已接入我自己的 Git CI 流程中，生成变更日志极快，推荐配合自动化审查流水线使用。",
      markdownContent: `# Conventional Commits 规范标准

## 1. 结构格式
\`<type>(<scope>): <subject>\`

## 2. 常用 Type 定义
- **feat**: 新增功能 (feature)
- **fix**: 修复 Bug
- **docs**: 仅涉及文档变动
- **style**: 格式变动（空格、格式化，不影响业务代码运行）
- **refactor**: 重构（既非新增功能亦非修复 bug）
- **perf**: 提升运行性能的代码优化
- **test**: 增补单元测试或端到端测试
- **chore**: 构建系统或外部依赖工具变动

## 3. 示例
- \`feat(auth): add OAuth2 login with GitHub\`
- \`fix(parser): resolve null pointer exception when payload is empty\`
- \`docs(readme): update deployment instructions for Vercel\``,
      updatedAt: "2026-11-02"
    },
    {
      id: "sk-02",
      name: "typescript-clean-code",
      title: "TypeScript 开发质量与规范指南",
      category: "Code Standards",
      version: "1.0.0",
      source: "custom",
      author: "我 (自建原创)",
      sourceUrl: "",
      tags: ["TypeScript", "CleanCode", "Quality"],
      description: "企业级 TypeScript 类型约束、错误防御与模块化设计标准，禁止滥用 any。",
      notes: "个人在大型 TypeScript 项目重构中提炼的心得，配合 Claude 3.5 Sonnet 做类型守卫与错误流排查很精准。",
      markdownContent: `# TypeScript 开发质量规范

## 1. 类型约束原则
- **严格禁止使用 \`any\`**：在未知类型时必须使用 \`unknown\`，并配合类型保护函数（Type Guard）。
- **显式函数返回类型**：所有公共模块导出的函数必须显式标注返回值类型。
- **不可变数据优先**：数组与复杂对象在入参中优先使用 \`readonly\` 修饰符。

## 2. 错误处理与防御性编程
- 所有异步请求必须包含针对网络异常与超时的主动捕获机制。
- 使用 Result 模式或自定义异常类明确错误语义，杜绝裸抛空异常。`,
      updatedAt: "2026-11-04"
    }
  ],

  // 1 Curated Starter Workflow
  workflows: [
    {
      id: "wf-01",
      name: "自动化代码提交与规范化审查流水线",
      description: "在代码提交时，自动注入 Conventional Commits 提交规范与代码审查提示词，交由基座大模型进行全方位质量评估。",
      linkedPromptId: "pm-01",
      linkedSkillId: "sk-01",
      linkedGithubRepoId: "gh-01",
      recommendedModel: "claude-3-5-sonnet",
      triggerType: "Git Hook / API Trigger",
      steps: [
        { step: 1, title: "工程规约检查", agent: "Commit Linter", skill: "Conventional Commits" },
        { step: 2, title: "代码深度评审", agent: "Code Reviewer", prompt: "代码审查与重构专家" },
        { step: 3, title: "格式化报告输出", agent: "Report Generator", action: "生成结构化审查结论" }
      ],
      executionCount: 16,
      avgLatencyMs: 1420,
      status: "active"
    }
  ],

  // 2 Curated Starter GitHub Repos
  githubProjects: [
    {
      id: "gh-01",
      name: "prompt-manager",
      owner: "sidambili",
      fullName: "sidambili/prompt-manager",
      repoUrl: "https://github.com/sidambili/prompt-manager",
      description: "An open-source, self-hostable platform designed for writing, organizing, versioning, and reusing AI prompts.",
      stars: 4850,
      forks: 390,
      language: "TypeScript",
      languageColor: "#3178c6",
      license: "MIT",
      studyStatus: "已掌握",
      notes: "优秀的开源提示词版本控制与管理平台，支持参数提取与分类沉淀。",
      topics: ["prompt-engineering", "nextjs", "supabase", "ai-tools"],
      addedAt: "2026-11-01",
      lastSyncedAt: "2026-11-07"
    },
    {
      id: "gh-02",
      name: "litellm",
      owner: "BerriAI",
      fullName: "BerriAI/litellm",
      repoUrl: "https://github.com/BerriAI/litellm",
      description: "Call all LLM APIs using the OpenAI format. Unified proxy, load balancing, cost tracking, and spend guardrails for 100+ LLMs.",
      stars: 21800,
      forks: 2600,
      language: "Python",
      languageColor: "#3572A5",
      license: "MIT",
      studyStatus: "研究中",
      notes: "高性能统一大模型网关代理，支持 100+ 模型的统一协议转换、高可用负载均衡与配额防护。",
      topics: ["llm", "proxy", "openai", "cost-tracking", "ai-gateway"],
      addedAt: "2026-11-02",
      lastSyncedAt: "2026-11-07"
    }
  ],

  // 3 Curated Starter API Connections
  apiConnections: [
    {
      id: "conn-01",
      name: "Anthropic Claude API",
      provider: "Anthropic",
      keyAlias: "anthropic-prod-workspace",
      maskedKey: "sk-ant-api03-****...9f8a",
      status: "active",
      latency: 420,
      models: ["claude-3-5-sonnet", "claude-3-opus", "claude-3-5-haiku"],
      monthlySpend: 0.32,
      budgetLimit: 10.00,
      lastChecked: "2026-11-07 17:30"
    },
    {
      id: "conn-02",
      name: "OpenAI Gateway",
      provider: "OpenAI",
      keyAlias: "openai-workspace-key",
      maskedKey: "sk-proj-****...b82c",
      status: "active",
      latency: 380,
      models: ["gpt-4o", "gpt-4o-mini", "o1-preview"],
      monthlySpend: 0.22,
      budgetLimit: 10.00,
      lastChecked: "2026-11-07 17:30"
    },
    {
      id: "conn-03",
      name: "DeepSeek API",
      provider: "DeepSeek",
      keyAlias: "deepseek-fast-key",
      maskedKey: "sk-ds-****...4a11",
      status: "active",
      latency: 290,
      models: ["deepseek-chat", "deepseek-coder"],
      monthlySpend: 0.08,
      budgetLimit: 5.00,
      lastChecked: "2026-11-07 17:30"
    }
  ],

  // Clean Starter Activities
  recentActivities: [
    {
      id: "act-01",
      type: "create",
      title: "工作空间初始化就绪",
      category: "System",
      timeAgo: "刚刚",
      detail: "已加载默认初始模板，可随时开始添加个人专属资产"
    },
    {
      id: "act-02",
      type: "prompt",
      title: "添加了代码审查与重构专家 Prompt",
      category: "Prompts",
      timeAgo: "10分钟前",
      detail: "版本 v1.0.0，包含 language 与 code 变量插槽"
    },
    {
      id: "act-03",
      type: "workflow",
      title: "编排了自动化代码提交与审查流水线",
      category: "Workflows",
      timeAgo: "25分钟前",
      detail: "串联 Conventional Commits 与 Claude 3.5 Sonnet"
    }
  ],

  // Clean Starter Model Logs
  recentModelLogs: [
    {
      id: "log-01",
      model: "claude-3-5-sonnet",
      tokens: 1240,
      cost: 0.0042,
      latency: 680,
      status: 200,
      time: "17:28:15",
      promptTitle: "代码审查与重构专家"
    },
    {
      id: "log-02",
      model: "gpt-4o",
      tokens: 950,
      cost: 0.0035,
      latency: 540,
      status: 200,
      time: "16:45:20",
      promptTitle: "提示词优化与工程化蒸馏器"
    },
    {
      id: "log-03",
      model: "deepseek-chat",
      tokens: 820,
      cost: 0.0012,
      latency: 380,
      status: 200,
      time: "15:12:08",
      promptTitle: "测试连通性探活"
    }
  ],

  // Service configuration
  serviceConfig: {
    mode: "live",
    endpoints: {
      litellm: "http://localhost:4000",
      karakeep: "http://localhost:3000",
      promptManager: "http://localhost:5000"
    }
  }
};
