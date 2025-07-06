# eslint-health-check

> 🩺 一站式 ESLint 健康检测与配置分析工具  
> 🩺 All-in-one ESLint Health Check & Config Analyzer

---

## ⚠️ 版本要求 / Version Requirements

- **ESLint**: 必须安装且版本为 `>=8.0.0`（仅支持 ESLint 8.x 及以上版本）
- **Node.js**: 必须为 `>=18.18.0`（建议使用最新版 LTS）

---

## 项目简介 / Introduction

`eslint-health-check` 是一个现代化的 CLI 工具，自动检测并输出项目的 ESLint 配置健康状况，涵盖 Node 环境、IDE 插件、依赖版本、规则聚合与冲突、格式化配置、AI 智能建议等，助力团队规范与自动化治理。

---

## 主要功能 / Features

- 🛠️ **环境检测**: 检测 Node 环境、平台、架构
- 🛠️ **IDE 插件检查**: 检查 VSCode/WebStorm/Cursor 等 IDE 插件（ESLint/Prettier/EditorConfig 等）状态与版本
- 📝 **配置分析**: 检查并解析项目 `.editorconfig`、Prettier 配置及其生效性
- ⚙️ **ESLint 配置**: 检查 ESLint 配置文件类型、兼容性与潜在问题
- 🔗 **依赖兼容性**: 递归分析所有 ESLint 相关依赖的版本兼容性
- 📊 **规则聚合**: 聚合所有继承/插件/overrides 后的最终 ESLint 规则，支持多文件类型
- 🤖 **AI 智能建议**: 基于检查结果生成智能配置建议
- 📄 **结构化输出**: 输出结构化 Markdown 健康报告，支持 AI Agent 解析

---


## 配置

### AI 功能配置

如需使用 AI 分析功能，请在项目根目录创建 `.env` 文件：

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

**获取 API Key：**
- Gemini: [Google AI Studio](https://makersuite.google.com/app/apikey)
- OpenAI: [OpenAI Platform](https://platform.openai.com/api-keys)

---

## 使用方法 / Usage

在你的项目根目录下运行：

```bash
npx eslint-health-check
```

### 支持的参数

| 参数                | 说明                                         | 默认值      |
|---------------------|----------------------------------------------|-------------|
| `--ai-analysis` 或 `-a` | 启用 AI 分析，生成智能建议                    | false       |
| `--json` 或 `-j`   | 输出 JSON 格式的原始数据                      | false       |

### 使用示例

```bash
# 基础健康检查
npx eslint-health-check

# 启用 AI 分析
npx eslint-health-check --ai-analysis

# 输出 JSON 数据
npx eslint-health-check --json

# 同时启用 AI 分析和 JSON 输出
npx eslint-health-check -a -j
```

---

## 输出说明 / Output

### 默认输出
- **健康报告（Markdown）**: `eslint-health-check-report.md`
- **AI 分析报告**: 当启用 `--ai-analysis` 时，AI 建议会追加到 Markdown 报告中

### JSON 输出（使用 `--json` 参数）
- **原始数据**: `eslint-health-check-report.json`
- 包含所有检查结果的原始数据结构

### 报告内容
- Node.js 环境信息
- IDE 插件检测结果
- ESLint 依赖版本兼容性分析
- 配置文件格式检查
- Eslint 规则聚合
- Prettier 配置分析
- EditorConfig 配置分析
- IDE 设置检查
- AI 智能建议（可选）

---

## License

MIT