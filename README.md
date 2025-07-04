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

- 检测 Node 环境、平台、架构
- 检查 VSCode/WebStorm/Cursor 等 IDE 插件（ESLint/Prettier/EditorConfig 等）状态与版本
- 检查并解析项目 `.editorconfig`、Prettier 配置及其生效性
- 检查 ESLint 配置文件类型、兼容性与潜在问题
- 递归分析所有 ESLint 相关依赖的版本兼容性
- 聚合所有继承/插件/overrides 后的最终 ESLint 规则，支持多文件类型
- 输出结构化 Markdown 健康报告，支持 AI Agent 解析

---

## 安装 / Installation

```bash
npm install eslint-health-check --save-dev
# 或
yarn add eslint-health-check --dev
```

---

## 使用方法 / Usage

在你的项目根目录下运行：

```bash
npx eslint-health-check
```

支持的参数：

| 参数                | 说明                                         | 默认值      |
|---------------------|----------------------------------------------|-------------|
| `--ide <ide>`       | 指定当前 IDE (vscode/webstorm/cursor)        | vscode      |

---

## 输出说明 / Output

- 健康报告（Markdown）：`eslint-health-check/report.md`
- 规则聚合产物（每种类型）：`eslint-health-check/eslint-rules-for-xx.json`
- Prettier 配置产物：`eslint-health-check/prettier-for-xx.json`
- 其它结构化产物：均集中在 `eslint-health-check/` 目录下

---

## 常见问题 / FAQ

- **Q: 运行时报 ESLintClass is not a constructor？**  
  A: 请确保你的项目已安装 ESLint 8.x 或 9.x，且未使用 7.x 及以下版本。


- **Q: Node 版本不符怎么办？**  
  A: 请升级 Node.js 至 18.18.0 或更高版本，建议使用最新版 LTS。

---


## License

MIT