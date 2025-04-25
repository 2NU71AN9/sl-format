#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
// import readline from "readline";

// 定义模板目录
const TEMPLATES_DIR = path.resolve(__dirname, "../templates");

// 执行命令的封装函数
const runCommand = (command, errorMessage) => {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`❌ ${errorMessage}`);
    console.error(`错误详情: ${error.stack}`);
    process.exit(1);
  }
};

// 写入配置文件（从模板文件读取内容，已存在时通过 `y/n` 询问）
const writeConfigFile = (filePath, templateName, callback) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const writeFile = () => {
    try {
      const templatePath = path.resolve(TEMPLATES_DIR, templateName);
      const content = fs.readFileSync(templatePath, "utf-8");
      fs.writeFileSync(filePath, content.trim(), "utf-8");
      console.log(`✅ 成功写入文件: ${filePath}`);
    } catch (error) {
      console.error(`❌ 写入文件失败: ${filePath}`);
      console.error(`错误详情: ${error.message}`);
      process.exit(1);
    }
  };

  if (fs.existsSync(filePath)) {
    rl.question(`⚠️ 文件 ${filePath} 已存在，是否替换？(y/n): `, (answer) => {
      if (answer.toLowerCase() === "y") {
        writeFile();
      } else {
        console.log(`⏩ 跳过文件: ${filePath}`);
      }
      rl.close();
      if (callback) callback();
    });
  } else {
    writeFile();
    if (callback) callback();
  }
};

// 配置 Husky
const setupHusky = () => {
  console.log("🔧 正在配置 Husky...");

  // 添加 pre-commit 钩子
  runCommand(
    'npx husky add .husky/pre-commit "npx lint-staged"',
    "添加 pre-commit 钩子失败"
  );

  // 添加 commit-msg 钩子
  runCommand(
    'npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"',
    "添加 commit-msg 钩子失败"
  );

  console.log("✅ Husky 配置完成！");
};

// 配置 Package.json
const setupPackageJson = () => {
  const packageJsonPath = path.resolve(process.cwd(), "package.json");

  try {
    // 读取 package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    console.log("✅ 成功读取 package.json 文件");

    // 添加 prepare 脚本
    packageJson["scripts"] = packageJson["scripts"] || {};
    packageJson["scripts"]["prepare"] = "husky install";

    // 添加 lint-staged 配置
    packageJson["lint-staged"] = {
      "*.{js,ts,vue}": "eslint --fix",
      "*.{json,md,html,css,scss}": "prettier --write",
    };

    // 添加 Standard-Version 配置
    packageJson["scripts"]["release"] = "standard-version";
    packageJson["scripts"]["release:test"] = "standard-version --prerelease";

    // 添加 lint 脚本
    packageJson["scripts"]["lint"] =
      "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .eslintignore";

    // 写入更新后的 package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf-8"
    );
    console.log(
      "✅ 已更新 package.json，添加 Husky、lint-staged 和 Standard-Version 配置"
    );
  } catch (error) {
    console.error(`❌ 更新 package.json 文件失败`);
    console.error(`错误详情: ${error.message}`);
    process.exit(1);
  }
};

// 主逻辑
const main = () => {
  console.log("👋 开始设置 ESLint 和相关工具...");

  // 安装依赖
  console.log("📦 正在安装依赖...");
  runCommand(
    "npm install eslint@8 @eslint/js globals typescript-eslint @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier eslint-plugin-import eslint-plugin-vue prettier husky@8 lint-staged standard-version @commitlint/{config-conventional,cli} --save-dev",
    "安装依赖失败"
  );

  // 写入配置文件（文件存在时提供 `y/n` 选项）
  writeConfigFile(".eslintrc.js", ".eslintrc.js", () => {
    writeConfigFile(".prettierrc.js", ".prettierrc.js", () => {
      writeConfigFile("commitlint.config.js", "commitlint.config.js", () => {
        writeConfigFile(".eslintignore", ".eslintignore", () => {
          writeConfigFile(".editorconfig", ".editorconfig", () => {
            writeConfigFile(".versionrc.js", ".versionrc.js", () => {
              // 配置 package.json 和 Husky
              setupPackageJson();
              runCommand("npx husky install", "运行 Husky install 命令失败");
              setupHusky();

              console.log("✅ 配置完成！请重启项目 🎉");
            });
          });
        });
      });
    });
  });
};

// 执行主逻辑
main();
