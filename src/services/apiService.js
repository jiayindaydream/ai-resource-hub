// API Service Layer for AI Resource Hub
// Bridges with external open source services (LiteLLM, Karakeep, PromptManager) and public GitHub API

window.ApiService = {
  // Test connection to LiteLLM Proxy
  async testLiteLLM(url, masterKey) {
    try {
      const endpoint = (url || "http://localhost:4000").replace(/\/$/, "");
      const res = await fetch(`${endpoint}/health`, {
        headers: masterKey ? { Authorization: `Bearer ${masterKey}` } : {}
      });
      if (res.ok) {
        return { success: true, message: "LiteLLM Proxy 服务连通正常" };
      }
      return { success: false, message: `LiteLLM 响应异常状态: ${res.status}` };
    } catch (e) {
      return { success: false, message: `连接超时或网络未达: ${e.message}` };
    }
  },

  // Test connection to Karakeep
  async testKarakeep(url, apiKey) {
    try {
      const endpoint = (url || "http://localhost:8080").replace(/\/$/, "");
      const res = await fetch(`${endpoint}/api/v1/tags`, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
      });
      if (res.ok) {
        return { success: true, message: "Karakeep 服务连通正常" };
      }
      return { success: false, message: `Karakeep 响应异常状态: ${res.status}` };
    } catch (e) {
      return { success: false, message: `连接超时或网络未达: ${e.message}` };
    }
  },

  // Test connection to PromptManager
  async testPromptManager(url, apiKey) {
    try {
      const endpoint = (url || "http://localhost:3000").replace(/\/$/, "");
      const res = await fetch(`${endpoint}/api/health`, {
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
      });
      if (res.ok) {
        return { success: true, message: "PromptManager 服务连通正常" };
      }
      return { success: false, message: `PromptManager 响应异常状态: ${res.status}` };
    } catch (e) {
      return { success: false, message: `连接超时或网络未达: ${e.message}` };
    }
  },

  // Fetch GitHub Repository info automatically
  async fetchGithubRepoMetadata(repoInput) {
    try {
      // Clean input to get owner/repo
      let clean = repoInput.trim();
      clean = clean.replace(/^(https?:\/\/)?(www\.)?github\.com\//, "");
      clean = clean.replace(/\.git$/, "").replace(/\/$/, "");
      const parts = clean.split("/");
      if (parts.length < 2) {
        throw new Error("请输入有效的 GitHub 仓库格式 (例如: owner/repo 或完整链接)");
      }
      const owner = parts[0];
      const repo = parts[1];

      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("未找到该 GitHub 仓库，请检查拼写");
        if (res.status === 403) throw new Error("GitHub API 调用频次达上限，请稍后再试");
        throw new Error(`GitHub 响应错误: ${res.status}`);
      }
      const data = await res.json();
      return {
        success: true,
        data: {
          name: data.name,
          owner: data.owner?.login || owner,
          fullName: data.full_name,
          repoUrl: data.html_url,
          description: data.description || "暂无描述",
          stars: data.stargazers_count || 0,
          forks: data.forks_count || 0,
          language: data.language || "Other",
          license: data.license?.spdx_id || data.license?.name || "None",
          topics: data.topics || []
        }
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
