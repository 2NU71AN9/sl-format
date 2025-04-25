module.exports = {
    header: '# 更新记录\n',
    types: [
        { type: 'feat', section: '✨ Features | 新功能' },
        { type: 'fix', section: '🐛 Bug Fixes | Bug 修复' },
        { type: 'init', section: '🎉 Init | 初始化' },
        { type: 'docs', section: '📝 Documentation | 文档', hidden: true },
        { type: 'style', section: '💄 Styles | 风格', hidden: true },
        { type: 'refactor', section: '♻️ Code Refactoring | 代码重构' },
        { type: 'perf', section: '⚡ Performance Improvements | 性能优化' },
        { type: 'test', section: '✅ Tests | 测试', hidden: true },
        { type: 'revert', section: '⏪ Revert | 回退', hidden: true },
        { type: 'build', section: '📦‍ Build System | 打包构建', hidden: true },
        { type: 'chore', section: '🚀 Chore | 部署相关', hidden: true },
        { type: 'ci', section: '👷 Continuous Integration | CI/CD 配置', hidden: true },
    ],
    skip: {
        bump: false, // 是否跳过更改版本
        changelog: false, // 是否跳过生产changelog
        commit: false, // 是否跳过自动commit
        tag: false, // 是否跳过打tag
    },
};