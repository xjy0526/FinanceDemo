/**
 * PortfolioPilot i18n — Bilingual Translation System (ZH + EN)
 * Usage: t('key') returns the string for the current language
 * Language is stored in localStorage and defaults to browser language
 */

const savedLang = localStorage.getItem('financebro-lang');
let currentLang = savedLang === 'de'
    ? 'zh'
    : (savedLang || (navigator.language.startsWith('zh') ? 'zh' : 'en'));

const i18n = {
    zh: {
        // Header
        portfolioValue: '组合市值',
        today: '今日:',
        toggleTheme: '切换主题',
        toggleCurrency: '切换货币',
        actions: '操作',
        updateParqet: '更新 Parqet',
        telegramReport: 'Telegram Report',
        fullAnalysis: '完整分析',
        demoMode: '演示模式',
        demoBanner: '🎭 演示模式 — 当前为演示用模拟数据',
        uploadCsv: 'CSV Import',

        // Navigation
        overview: '概览',
        analysis: '分析',
        history: '历史',
        rebalancing: '再平衡',
        techPicks: 'Tech Picks',
        aiAdvisor: 'AI Advisor',

        // Stats
        positions: '持仓数',

        // Movers
        dailyWinners: '🟢 今日涨幅榜',
        dailyLosers: '🔴 今日跌幅榜',

        // Heatmap
        portfolioHeatmap: '🗺️ 组合热力图',

        // Table
        portfolioPositions: '组合持仓',
        sortBy: '排序:',
        name: 'Name',
        price: '价格',
        costBasis: '成本',
        todayShort: '今日',
        shares: '份额',
        value: '市值',
        score: 'Score',
        rating: 'Rating',
        details: 'Details',
        all: '全部',

        // Analysis Tab
        sectorAllocation: '🏗️ 行业分布',
        riskProfile: '🛡️ 风险画像',
        performanceBenchmark: '📈 组合 vs 基准',
        dividends: '💰 分红',
        correlationMatrix: '🔗 相关性矩阵',
        earningsCalendar: '📅 财报日历',
        months3: '3个月',
        months6: '6个月',
        year1: '1年',

        // History Tab
        totalValue: '📊 总市值',
        unrealized: '📈 未实现盈亏',
        realized: '💰 已实现盈亏',
        dividendsKpi: '🪙 分红',
        taxes: '🏛️ 税费',
        fees: '💳 手续费',
        allPositions: '📋 全部持仓',
        active: '持有中',
        sold: '已卖出',

        // Rebalancing Tab
        rebalancingRecommendations: '⚖️ 再平衡建议',
        calculating: '计算中...',

        // Tech Picks Tab
        dailyTechPicks: '🚀 每日科技股推荐',
        techPicksSubtitle: '从科技板块中筛选的高潜力标的',

        // AI Advisor Tab
        tradeAnalysis: '交易分析',
        chat: 'Chat',
        aiTradeAdvisor: '🧠 AI Trade Advisor',
        advisorSubtitle: '使用 AI 结合组合上下文评估买入、卖出与加仓决策',
        ticker: 'Ticker',
        tickerPlaceholder: '例如 NVDA',
        action: '操作',
        buy: '买入',
        increase: '加仓',
        sell: '卖出',
        amountEur: '金额 (EUR)',
        amountPlaceholder: '例如 2000',
        externalSources: '📎 外部信息',
        optional: '(可选)',
        contextPlaceholder: '可粘贴分析师观点、文章摘要或你的个人笔记...',
        startAnalysis: '开始分析',
        aiAnalyzing: '⏳ AI 分析中...',

        // Chat
        portfolioChat: '💬 组合聊天',
        newChat: '🗑️ 新对话',
        chatSubtitle: '提问、讨论假设、分析情景变化，AI 会结合你的完整组合上下文回答',
        chatWelcome1: '👋 你好，我是你的组合顾问。',
        chatWelcome2: '你可以问我任何和组合相关的问题，例如：',
        chatSuggestion1: '我的组合分散度如何？',
        chatSuggestion2: '如果美元下跌 10% 会怎样？',
        chatSuggestion3: '哪只股票的风险收益比最好？',
        chatSuggestion4: '我的科技板块集中度高吗？',
        chatInputPlaceholder: '输入你的问题...',
        send: '发送',

        // Stock Panel
        stockOverview: '概览',
        fundamentals: '基本面',
        technical: '技术面',
        news: 'News',

        // Mobile Nav
        rebalance: '再平衡',
        picks: 'Picks',
        ai: 'AI',

        // Dynamic content (app.js)
        priority: '优先级',
        quality: '质量',
        scoreBreakdown: '评分拆解',
        insiderBuys: '内部人买入',
        insiderSells: '内部人卖出',
        insiderBuysPct: '买入',
        annualPerShare: '每股年度',
        overbought: '⚠️ 超买',
        oversold: '⚠️ 超卖',
        normal: '✅ 正常',
        noTechData: '暂无技术面数据',
        noFundData: '暂无基本面数据',
        switchToReal: '切换回真实组合数据',
        fullAnalysisRunning: '🔬 正在执行完整分析...',
        volatilityPa: '年化波动率',
        varDaily: 'VaR 95%（日）',
        annualIncome: '年度收入',
        calcRunning: '计算中...（需要价格数据）',
        newsUnavailable: '暂无新闻',
        noHistoryData: '暂无历史数据，请先执行一次数据更新。',
        sellRatingHint: '个卖出评级，是否查看再平衡建议？',
        position: '个持仓',
        positionPlural: '个持仓',

        // CSV Upload
        csvUploadTitle: 'CSV Portfolio Import',
        csvUploadDesc: '从 CSV 文件导入你的组合',
        csvSelectFile: '选择文件',
        csvImporting: '导入中...',
        csvSuccess: '组合导入成功！',
        csvError: 'CSV 导入失败',
        csvFormatHint: '格式: ticker, shares, buy_price, current_price, buy_date, currency, asset_type, market',

        // Shadow Portfolio Agent
        shadowAgent: 'Shadow Agent',
        shadowTitle: '🤖 Shadow Portfolio Agent',
        shadowSubtitle: '自动管理模拟投资组合的 AI Agent',
        shadowStartAgent: '启动 Agent',
        shadowRunning: '⏳ 运行中...',
        shadowResetTitle: '重置组合',
        shadowKpiTotal: '总市值',
        shadowKpiPnl: '总盈亏',
        shadowKpiCash: 'Cash',
        shadowKpiPositions: '持仓数',
        shadowChartTitle: '📈 Shadow vs. 真实组合',
        shadowTableTitle: '📋 Shadow 持仓',
        shadowTableHeaderStock: '标的',
        shadowTableHeaderShares: '份额',
        shadowTableHeaderPrice: '价格 (EUR)',
        shadowTableHeaderValue: '市值',
        shadowTableHeaderWeight: '权重',
        shadowTableHeaderPnl: 'P&L',
        shadowTableHeaderSector: '行业',
        shadowEmptyPositions: '当前还没有持仓，启动 Agent 后会自动初始化。',
        shadowLastDecision: '最近一次 AI 决策',
        shadowTransactions: '🔄 交易记录',
        shadowLoading: '加载中...',
        shadowConfigTitle: '⚙️ Agent 配置',
        shadowConfigBadge: '默认',
        shadowConfigDesc: '重置后仍会保留配置',
        shadowStrategyMode: '🎯 策略模式',
        shadowStratConsLabel: '保守',
        shadowStratConsDesc: '保留更多现金，仅买入分数高于 70 的稳定行业标的',
        shadowStratBalLabel: '均衡',
        shadowStratBalDesc: '兼顾成长与稳健，严格执行规则',
        shadowStratAggLabel: '激进',
        shadowStratAggDesc: '更高风险偏好，更少现金，更高集中度',
        shadowRulesTitle: '📏 组合规则',
        shadowRuleMaxPos: '最大持仓数',
        shadowRuleMaxPosDesc: '组合允许持有的最大股票数量',
        shadowRuleMaxWeight: '单一持仓最大权重',
        shadowRuleMaxWeightDesc: '单个持仓占总组合的最大比例',
        shadowRuleMinCash: '最低现金保留',
        shadowRuleMinCashDesc: '这部分现金将始终保留作为安全垫',
        shadowRuleMinTrade: '最小交易额',
        shadowRuleMinTradeDesc: '过小交易会被忽略，用于模拟交易成本',
        shadowRuleMaxTrades: '每轮最大交易数',
        shadowRuleMaxTradesDesc: '限制 Agent 每天最多执行多少笔交易',
        shadowRuleMaxSector: '行业最大集中度',
        shadowRuleMaxSectorDesc: '避免单一行业过度集中',
        shadowRuleMinScore: '买入最低分数',
        shadowRuleMinScoreDesc: '新开仓所需达到的最低质量分数',
        shadowRestoreDefaults: '恢复默认设置',
        shadowSaveConfig: '保存配置',

        // Shadow Agent JS Strings
        shadowAgentRunningToast: '🤖 Shadow Agent 运行中...（约 30-90 秒）',
        shadowAgentErrorToast: '❌ Agent 错误: ',
        shadowAgentSuccessToast: '✅ Shadow Agent:',
        shadowAgentFailToast: '❌ Agent 调用失败',
        shadowResetConfirm: '确定重置 Shadow 组合吗？所有持仓和交易记录都会被删除。\n\n💡 Agent 规则配置会保留。',
        shadowResetSuccess: '🗑️ Shadow 组合已重置',
        shadowResetFail: '❌ 重置失败',
        shadowEmptyTransactions: '暂无交易记录。',
        shadowModeCons: '保守',
        shadowModeBal: '均衡',
        shadowModeAgg: '激进',
        shadowModeDefault: '默认',
        shadowSaveSaving: '保存中...',
        shadowSaveSuccess: '✅ 配置已保存，将在下一轮生效',
        shadowSaveFail: '❌ 保存失败',
        shadowSaveNetFail: '❌ 保存时网络错误',
        shadowResetConfigConfirm: '确定恢复默认配置吗？',
        shadowResetConfigSuccess: '🔄 配置已恢复',
        shadowResetConfigFail: '❌ 恢复失败',
        shadowEmptyChart: '暂无表现数据，启动 Agent 后开始记录。',
    },
    en: {
        // Header
        portfolioValue: 'Portfolio Value',
        today: 'Today:',
        toggleTheme: 'Toggle theme',
        toggleCurrency: 'Toggle currency',
        actions: 'Actions',
        updateParqet: 'Update Parqet',
        telegramReport: 'Telegram Report',
        fullAnalysis: 'Full Analysis',
        demoMode: 'Demo Mode',
        demoBanner: '🎭 Demo Mode — Fictitious data for demonstration purposes',
        uploadCsv: 'CSV Import',

        // Navigation
        overview: 'Overview',
        analysis: 'Analysis',
        history: 'History',
        rebalancing: 'Rebalancing',
        techPicks: 'Tech Picks',
        aiAdvisor: 'AI Advisor',

        // Stats
        positions: 'Positions',

        // Movers
        dailyWinners: '🟢 Top Gainers',
        dailyLosers: '🔴 Top Losers',

        // Heatmap
        portfolioHeatmap: '🗺️ Portfolio Heatmap',

        // Table
        portfolioPositions: 'Portfolio Positions',
        sortBy: 'Sort:',
        name: 'Name',
        price: 'Price',
        costBasis: 'Cost',
        todayShort: 'Today',
        shares: 'Shares',
        value: 'Value',
        score: 'Score',
        rating: 'Rating',
        details: 'Details',
        all: 'All',

        // Analysis Tab
        sectorAllocation: '🏗️ Sector Allocation',
        riskProfile: '🛡️ Risk Profile',
        performanceBenchmark: '📈 Performance vs. Benchmark',
        dividends: '💰 Dividends',
        correlationMatrix: '🔗 Correlation Matrix',
        earningsCalendar: '📅 Earnings Calendar',
        months3: '3 Months',
        months6: '6 Months',
        year1: '1 Year',

        // History Tab
        totalValue: '📊 Total Value',
        unrealized: '📈 Unrealized',
        realized: '💰 Realized',
        dividendsKpi: '🪙 Dividends',
        taxes: '🏛️ Taxes',
        fees: '💳 Fees',
        allPositions: '📋 All Positions',
        active: 'Active',
        sold: 'Sold',

        // Rebalancing Tab
        rebalancingRecommendations: '⚖️ Rebalancing Recommendations',
        calculating: 'Calculating...',

        // Tech Picks Tab
        dailyTechPicks: '🚀 Daily Tech Picks',
        techPicksSubtitle: 'High-potential stocks from the technology sector',

        // AI Advisor Tab
        tradeAnalysis: 'Trade Analysis',
        chat: 'Chat',
        aiTradeAdvisor: '🧠 AI Trade Advisor',
        advisorSubtitle: 'Evaluate buy and sell decisions with AI-powered portfolio analysis',
        ticker: 'Ticker',
        tickerPlaceholder: 'e.g. NVDA',
        action: 'Action',
        buy: 'Buy',
        increase: 'Add to Position',
        sell: 'Sell',
        amountEur: 'Amount (EUR)',
        amountPlaceholder: 'e.g. 2000',
        externalSources: '📎 External Sources',
        optional: '(optional)',
        contextPlaceholder: 'Paste analyst comments, article excerpts, or your own notes here...',
        startAnalysis: 'Start Analysis',
        aiAnalyzing: '⏳ AI analyzing...',

        // Chat
        portfolioChat: '💬 Portfolio Chat',
        newChat: '🗑️ New',
        chatSubtitle: 'Ask questions, discuss hypotheses, analyze scenarios — with full portfolio context',
        chatWelcome1: '👋 Hi! I\'m your portfolio advisor.',
        chatWelcome2: 'Ask me anything about your portfolio. Examples:',
        chatSuggestion1: 'How diversified is my portfolio?',
        chatSuggestion2: 'What happens if the USD drops 10%?',
        chatSuggestion3: 'Which stock has the best risk/reward ratio?',
        chatSuggestion4: 'How concentrated is my tech sector exposure?',
        chatInputPlaceholder: 'Your question...',
        send: 'Send',

        // Stock Panel
        stockOverview: 'Overview',
        fundamentals: 'Fundamentals',
        technical: 'Technical',
        news: 'News',

        // Mobile Nav
        rebalance: 'Rebalance',
        picks: 'Picks',
        ai: 'AI',

        // Dynamic content (app.js)
        priority: 'Priority',
        quality: 'Quality',
        scoreBreakdown: 'Score Breakdown',
        insiderBuys: 'Insider Buys',
        insiderSells: 'Insider Sales',
        insiderBuysPct: 'Buys',
        annualPerShare: 'Annual/Share',
        overbought: '⚠️ Overbought',
        oversold: '⚠️ Oversold',
        normal: '✅ Normal',
        noTechData: 'No technical data available',
        noFundData: 'No fundamental data available',
        switchToReal: 'Switch to real portfolio data',
        fullAnalysisRunning: '🔬 Full analysis running...',
        volatilityPa: 'Volatility (p.a.)',
        varDaily: 'VaR 95% (daily)',
        annualIncome: 'Annual Income',
        calcRunning: 'Calculating... (requires price data)',
        newsUnavailable: 'News unavailable',
        noHistoryData: 'No historical data available. Please run a data update first.',
        sellRatingHint: 'with Sell rating — check rebalancing?',
        position: 'position',
        positionPlural: 'positions',

        // CSV Upload
        csvUploadTitle: 'CSV Portfolio Import',
        csvUploadDesc: 'Import your portfolio from a CSV file',
        csvSelectFile: 'Select File',
        csvImporting: 'Importing...',
        csvSuccess: 'Portfolio imported successfully!',
        csvError: 'CSV import error',
        csvFormatHint: 'Format: ticker, shares, buy_price, current_price, buy_date, currency, asset_type, market',

        // Shadow Portfolio Agent
        shadowAgent: 'Shadow Agent',
        shadowTitle: '🤖 Shadow Portfolio Agent',
        shadowSubtitle: 'Autonomous AI agent independently managing a fictitious portfolio',
        shadowStartAgent: 'Start Agent',
        shadowRunning: '⏳ Running...',
        shadowResetTitle: 'Reset portfolio',
        shadowKpiTotal: 'Total Value',
        shadowKpiPnl: 'Total P&L',
        shadowKpiCash: 'Cash',
        shadowKpiPositions: 'Positions',
        shadowChartTitle: '📈 Shadow vs. Real Portfolio',
        shadowTableTitle: '📋 Shadow Positions',
        shadowTableHeaderStock: 'Stock',
        shadowTableHeaderShares: 'Shares',
        shadowTableHeaderPrice: 'Price (EUR)',
        shadowTableHeaderValue: 'Value',
        shadowTableHeaderWeight: 'Weight',
        shadowTableHeaderPnl: 'P&L',
        shadowTableHeaderSector: 'Sector',
        shadowEmptyPositions: 'No positions yet — Start the agent to initialize.',
        shadowLastDecision: 'Last AI Decision',
        shadowTransactions: '🔄 Transaction History',
        shadowLoading: 'Loading...',
        shadowConfigTitle: '⚙️ Agent Configuration',
        shadowConfigBadge: 'Default',
        shadowConfigDesc: 'Configuration is preserved after reset',
        shadowStrategyMode: '🎯 Strategy Mode',
        shadowStratConsLabel: 'Conservative',
        shadowStratConsDesc: 'High cash, only score >70, stable sectors',
        shadowStratBalLabel: 'Balanced',
        shadowStratBalDesc: 'Growth & Security, strict rules',
        shadowStratAggLabel: 'Aggressive',
        shadowStratAggDesc: 'Risk-seeking, less cash, high weights',
        shadowRulesTitle: '📏 Portfolio Rules',
        shadowRuleMaxPos: 'Max Positions',
        shadowRuleMaxPosDesc: 'Maximum number of stocks the portfolio may hold',
        shadowRuleMaxWeight: 'Max Weight / Position',
        shadowRuleMaxWeightDesc: 'Maximum percentage a single position can represent',
        shadowRuleMinCash: 'Min Cash Reserve',
        shadowRuleMinCashDesc: 'This cash ratio remains untouched (safety buffer)',
        shadowRuleMinTrade: 'Min Trade Volume',
        shadowRuleMinTradeDesc: 'Smaller trades are ignored (Transaction cost simulation)',
        shadowRuleMaxTrades: 'Max Trades per Cycle',
        shadowRuleMaxTradesDesc: 'Limits how many trades the agent can execute per day',
        shadowRuleMaxSector: 'Max Sector Concentration',
        shadowRuleMaxSectorDesc: 'Prevents cluster risks in a single sector',
        shadowRuleMinScore: 'Minimum Buy Score',
        shadowRuleMinScoreDesc: 'Stock quality threshold for new purchases',
        shadowRestoreDefaults: 'Restore defaults',
        shadowSaveConfig: 'Save configuration',

        // Shadow Agent JS Strings
        shadowAgentRunningToast: '🤖 Shadow Agent running... (30-90 seconds)',
        shadowAgentErrorToast: '❌ Agent Error: ',
        shadowAgentSuccessToast: '✅ Shadow Agent:', // {0} Trades executed appended dynamically
        shadowAgentFailToast: '❌ Agent execution failed',
        shadowResetConfirm: 'Really reset Shadow Portfolio? All positions and transactions will be deleted.\n\n💡 The configuration (Agent Rules) will be preserved.',
        shadowResetSuccess: '🗑️ Shadow Portfolio reset successfully',
        shadowResetFail: '❌ Reset failed',
        shadowEmptyTransactions: 'No transactions yet.',
        shadowModeCons: 'Conservative',
        shadowModeBal: 'Balanced',
        shadowModeAgg: 'Aggressive',
        shadowModeDefault: 'Default',
        shadowSaveSaving: 'Saving...',
        shadowSaveSuccess: '✅ Configuration saved — effective next cycle',
        shadowSaveFail: '❌ Save failed',
        shadowSaveNetFail: '❌ Network error while saving',
        shadowResetConfigConfirm: 'Reset configuration to default values?',
        shadowResetConfigSuccess: '🔄 Configuration reset',
        shadowResetConfigFail: '❌ Reset failed',
        shadowEmptyChart: 'No performance data yet — start the agent to begin.',
    }
};

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @returns {string} Translated string
 */
function t(key) {
    return (i18n[currentLang] && i18n[currentLang][key]) || (i18n.en && i18n.en[key]) || key;
}

/**
 * Switch language and re-render UI
 * @param {string} lang - 'zh' or 'en'
 */
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('financebro-lang', lang);
    applyTranslations();
    // Re-render dynamic content
    if (typeof renderDashboard === 'function') {
        renderDashboard();
    }
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translated = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translated;
        } else {
            // Preserve child elements (icons etc.)
            const icon = el.querySelector('[data-lucide]');
            if (icon) {
                el.innerHTML = '';
                el.appendChild(icon);
                el.appendChild(document.createTextNode(' ' + translated));
            } else {
                el.textContent = translated;
            }
        }
    });
    // Update title attribute translations
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.title = t(el.getAttribute('data-i18n-title'));
    });
    // Update html lang
    document.documentElement.lang = currentLang;
    // Update language toggle button
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = currentLang === 'zh' ? '中文' : 'EN';
}
