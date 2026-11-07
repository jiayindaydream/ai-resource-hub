// Storage Engine for AI Resource Hub (V7 with Enhanced Skills Hub & Dual Origin Support)
window.StorageEngine = {
  STORAGE_KEY: "AI_RESOURCE_HUB_DATA_V7",
  listeners: [],

  syncCounts(state) {
    if (!state) return state;
    if (!state.dashboardStats) state.dashboardStats = {};
    state.dashboardStats.promptCount = (state.prompts || []).length;
    state.dashboardStats.skillCount = (state.skills || []).length;
    state.dashboardStats.workflowCount = (state.workflows || []).length;
    state.dashboardStats.githubBookmarkCount = (state.githubProjects || []).length;
    return state;
  },

  getState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return this.syncCounts(parsed);
      }
    } catch (e) {
      console.warn("Failed to parse stored data, falling back to clean starter data", e);
    }
    const initial = JSON.parse(JSON.stringify(window.MockData));
    this.syncCounts(initial);
    this.saveState(initial);
    return initial;
  },

  saveState(state) {
    try {
      this.syncCounts(state);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
      this.notify(state);
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  },

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  },

  notify(state) {
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (e) {
        console.error("Listener error", e);
      }
    });
  },

  // Reset to default clean starter templates
  resetData() {
    const initial = JSON.parse(JSON.stringify(window.MockData));
    this.syncCounts(initial);
    this.saveState(initial);
    return initial;
  },

  // Clear all data for a completely blank personal workspace
  clearAllData() {
    const state = this.getState();
    const blankState = {
      ...state,
      prompts: [],
      skills: [],
      workflows: [],
      githubProjects: [],
      apiConnections: [],
      recentActivities: [
        {
          id: "act-blank",
          type: "create",
          title: "已清空工作区，开始全新构建",
          category: "System",
          timeAgo: "刚刚",
          detail: "当前没有包含任何预设数据，你可以点击右上角【新建资产】开始添加"
        }
      ],
      recentModelLogs: [],
      dashboardStats: {
        promptCount: 0,
        skillCount: 0,
        workflowCount: 0,
        githubBookmarkCount: 0,
        monthlyTokens: 0,
        monthlyCost: 0,
        actualBilledCost: 0,
        estimatedTokenCost: 0,
        monthlyBudget: 20.00,
        budgetUsagePercent: 0,
        totalRequests: 0,
        avgLatency: 0
      }
    };
    this.saveState(blankState);
    return blankState;
  },

  // Export JSON backup
  exportData() {
    const state = this.getState();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `ai_resource_hub_backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
  },

  // Import JSON backup
  importData(jsonContent) {
    try {
      const parsed = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
      if (parsed && typeof parsed === "object") {
        this.saveState(parsed);
        return { success: true, message: "数据恢复成功！" };
      }
    } catch (e) {
      return { success: false, error: "导入文件格式错误，请提供有效的 JSON 备份文件" };
    }
    return { success: false, error: "未知导入格式" };
  },

  // Cross-Asset Relational Graph Queries
  getWorkflowsByPromptId(promptId) {
    const state = this.getState();
    return (state.workflows || []).filter(w => w.linkedPromptId === promptId);
  },

  getWorkflowsBySkillId(skillId) {
    const state = this.getState();
    return (state.workflows || []).filter(w => w.linkedSkillId === skillId);
  },

  getWorkflowsByRepoId(repoId) {
    const state = this.getState();
    return (state.workflows || []).filter(w => w.linkedGithubRepoId === repoId);
  },

  // Generate Professional Portfolio Asset Summary Markdown Report
  generateMarkdownReport() {
    const state = this.getState();
    const stats = state.dashboardStats;
    const tokenDisplay = stats.monthlyTokens > 500000 
      ? `${(stats.monthlyTokens / 1000000).toFixed(2)}M Tokens`
      : `${(stats.monthlyTokens / 1000).toFixed(1)}K Tokens`;

    return `# 📊 AI RESOURCE HUB —— AI 资产与模型调用总览报告

> **生成时间**: ${new Date().toLocaleString()}  
> **报告类型**: 个人与团队 AI 资产总览、跨模块关系编排与模型用量清单

---

## 一、核心资产概览与业务指标

| 指标维度 | 数量 / 统计值 | 说明 |
| :--- | :--- | :--- |
| **Prompts 提示词库** | **${state.prompts.length} 条** | 语义版本控制、参数插槽解析、效果评测 |
| **Skills 技能库** | **${state.skills.length} 项** | 归档自建原创与开源社区下载技能包，支持一键复制与本地导出 |
| **Workflows 编排流水线** | **${state.workflows.length} 条** | 串联 Prompt + Skill + GitHub 库 + 底层模型的自动化管线 |
| **GitHub 开源库跟踪** | **${state.githubProjects.length} 个** | 追踪 Stars、语言、License 与研读进度 |
| **本期 Token 吞吐** | **${tokenDisplay}** | 模型请求与响应累计 Token 数 |
| **真实扣减账单** | **$${stats.actualBilledCost.toFixed(2)} USD** | 服务商真实发票扣费额度 |
| **Token 理论估算费用** | **$${stats.estimatedTokenCost.toFixed(2)} USD** | 按照官方 Token 标准单价计算 |
| **平均请求延迟** | **${stats.avgLatency}ms** | 模型调用与探活握手平均耗时 |

---

## 二、跨模块资产编排矩阵 (Workflows Dependency Chain)

${state.workflows.length === 0 ? "*(暂无编排流水线)*\n" : (state.workflows || []).map((wf, idx) => {
  const prompt = state.prompts.find(p => p.id === wf.linkedPromptId);
  const skill = state.skills.find(s => s.id === wf.linkedSkillId);
  const repo = state.githubProjects.find(r => r.id === wf.linkedGithubRepoId);

  return `### ${idx + 1}. ${wf.name}
- **流水线简介**: ${wf.description}
- **依赖提示词**: \`${prompt ? prompt.title : "未绑定"}\` (${prompt ? prompt.currentVersion : "N/A"})
- **执行规约规范**: \`${skill ? skill.title : "未绑定"}\` (${skill ? skill.name : "N/A"})
- **关联代码库**: \`${repo ? repo.fullName : "未指定"}\` (★ ${repo ? repo.stars.toLocaleString() : 0})
- **基座大模型**: \`${wf.recommendedModel}\`
- **运行表现**: 累计执行 ${wf.executionCount} 次 · 平均响应延迟 ${wf.avgLatencyMs}ms
`;
}).join("\n")}

---

## 三、当前已收录 Prompts 提示词清单

${state.prompts.length === 0 ? "*(暂无提示词)*\n" : state.prompts.map((p, idx) => `
### ${idx + 1}. ${p.title} (${p.currentVersion})
- **分类**: \`${p.category}\` | **标签**: ${p.tags.join(", ")}
- **说明**: ${p.description}
- **包含参数插槽**: ${p.variables && p.variables.length > 0 ? p.variables.map(v => `\`{{${v}}}\``).join(", ") : "无"}
\`\`\`markdown
${p.templateContent}
\`\`\`
`).join("\n")}
`;
  },

  // CRUD for Prompts
  addPrompt(prompt) {
    const state = this.getState();
    const newPrompt = {
      id: "pm-" + Date.now().toString(36),
      currentVersion: "v1.0.0",
      versions: [{ version: "v1.0.0", date: new Date().toISOString().slice(0, 10), note: "初始版本" }],
      favorite: false,
      copyCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      ...prompt
    };
    state.prompts.unshift(newPrompt);
    this.saveState(state);
    return newPrompt;
  },

  updatePrompt(id, updates) {
    const state = this.getState();
    const idx = state.prompts.findIndex(p => p.id === id);
    if (idx !== -1) {
      state.prompts[idx] = {
        ...state.prompts[idx],
        ...updates,
        updatedAt: new Date().toISOString().slice(0, 10)
      };
      this.saveState(state);
    }
  },

  deletePrompt(id) {
    const state = this.getState();
    state.prompts = state.prompts.filter(p => p.id !== id);
    this.saveState(state);
  },

  // CRUD for Skills (Custom Built & Downloaded from Community)
  addSkill(skill) {
    const state = this.getState();
    const newSkill = {
      id: "sk-" + Date.now().toString(36),
      source: skill.source || "custom",
      sourceUrl: skill.sourceUrl || "",
      author: skill.author || (skill.source === "downloaded" ? "开源社区" : "我 (自建原创)"),
      notes: skill.notes || "",
      version: skill.version || "1.0.0",
      tags: Array.isArray(skill.tags) ? skill.tags : ["Skill"],
      category: skill.category || "General",
      updatedAt: new Date().toISOString().slice(0, 10),
      ...skill
    };
    state.skills.unshift(newSkill);
    this.saveState(state);
    return newSkill;
  },

  updateSkill(id, updates) {
    const state = this.getState();
    const idx = state.skills.findIndex(s => s.id === id);
    if (idx !== -1) {
      state.skills[idx] = {
        ...state.skills[idx],
        ...updates,
        updatedAt: new Date().toISOString().slice(0, 10)
      };
      this.saveState(state);
    }
  },

  deleteSkill(id) {
    const state = this.getState();
    state.skills = state.skills.filter(s => s.id !== id);
    this.saveState(state);
  },

  // CRUD for Workflows
  addWorkflow(wf) {
    const state = this.getState();
    const newWf = {
      id: "wf-" + Date.now().toString(36),
      executionCount: 0,
      avgLatencyMs: 0,
      status: "active",
      createdAt: new Date().toISOString().slice(0, 10),
      ...wf
    };
    state.workflows.unshift(newWf);
    this.saveState(state);
    return newWf;
  },

  deleteWorkflow(id) {
    const state = this.getState();
    state.workflows = state.workflows.filter(w => w.id !== id);
    this.saveState(state);
  },

  // CRUD for GitHub Projects
  addGithubProject(project) {
    const state = this.getState();
    const newProject = {
      id: "gh-" + Date.now().toString(36),
      addedAt: new Date().toISOString().slice(0, 10),
      lastSyncedAt: new Date().toISOString().slice(0, 10),
      ...project
    };
    state.githubProjects.unshift(newProject);
    this.saveState(state);
    return newProject;
  },

  deleteGithubProject(id) {
    const state = this.getState();
    state.githubProjects = state.githubProjects.filter(p => p.id !== id);
    this.saveState(state);
  },

  updateGithubProject(id, updates) {
    const state = this.getState();
    const idx = state.githubProjects.findIndex(p => p.id === id);
    if (idx !== -1) {
      state.githubProjects[idx] = {
        ...state.githubProjects[idx],
        ...updates,
        lastSyncedAt: new Date().toISOString().slice(0, 10)
      };
      this.saveState(state);
    }
  },

  // CRUD for API Connections
  addApiConnection(conn) {
    const state = this.getState();
    const newConn = {
      id: "conn-" + Date.now().toString(36),
      monthlySpend: 0,
      status: "active",
      latency: 350,
      lastChecked: new Date().toISOString().slice(0, 16).replace("T", " "),
      ...conn
    };
    state.apiConnections.unshift(newConn);
    this.saveState(state);
    return newConn;
  },

  deleteApiConnection(id) {
    const state = this.getState();
    state.apiConnections = state.apiConnections.filter(c => c.id !== id);
    this.saveState(state);
  }
};
