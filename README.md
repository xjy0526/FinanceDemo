# PortfolioPilot

PortfolioPilot 是一个基于 FastAPI 的 AI 投资组合看板项目，适合个人部署和二次开发。这一版已经按个人仓库发布场景做过整理，默认接入千问兼容接口，并支持展示全球股票、中国 A 股和 Polymarket 持仓。

## 项目特点

- 基于 FastAPI + 原生前端脚本，部署简单，启动直接
- 支持通过 CSV 导入投资组合
- 默认使用千问兼容接口进行 AI 分析与交易建议
- 支持投资组合分析、调仓建议、历史记录、Telegram 推送
- 支持混合资产展示：
  - 美股及其他全球股票
  - 中国 A 股，如 `600519.SS`、`300750.SZ`
  - Polymarket 预测市场持仓
- 前端支持中英文切换

## 适用场景

这个项目适合以下用途：

- 作为你自己的投资组合分析面板
- 作为接入千问模型的个人 AI 金融助手原型
- 作为一个可继续扩展的 GitHub 开源项目基础版本

## 本地运行

推荐使用 Python 3.12。

macOS / Linux：

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 main.py
```

Windows：

```bat
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python main.py
```

启动后访问：

```text
http://localhost:8000
```

macOS 也可以直接运行 [start.sh](start.sh)：

```bash
chmod +x start.sh
./start.sh
```

如果你已经创建好虚拟环境，Windows 也可以直接运行 [start.bat](start.bat)。

## 千问配置

项目默认使用千问兼容模式。编辑 `.env`，至少配置以下参数：

```env
AI_PROVIDER=qwen
QWEN_API_KEY=你的千问API_KEY
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
```

如果需要调整推理模型或品牌信息，也可以继续补充：

```env
QWEN_REASONING_MODEL=qwen-plus
APP_NAME=PortfolioPilot
APP_TAGLINE=面向全球股票、中国A股与Polymarket的AI投资组合助手
```

说明：

- 未配置完整 API Key 时，项目仍可在演示模式下运行
- AI 分析、交易建议、部分自动化能力依赖千问接口配置

## Render 公网部署

项目已内置 [render.yaml](render.yaml)，适合通过 Render Blueprint 直接部署为公网 Web Service。

推荐配置：

- Runtime：Docker
- Region：Singapore
- Plan：Starter 或更高
- Persistent Disk：挂载到 `/app/cache`
- Portfolio CSV：`/app/cache/portfolio.csv`

部署步骤：

1. 将代码推送到 GitHub 仓库。
2. 打开 Render Dashboard，选择 `New` → `Blueprint`。
3. 连接这个 GitHub 仓库，Render 会自动读取 `render.yaml`。
4. 按提示填写 `sync: false` 的环境变量，至少建议设置：
   - `QWEN_API_KEY`
   - `FMP_API_KEY`
   - `DASHBOARD_USER`
   - `DASHBOARD_PASSWORD`
5. 创建服务后等待 Docker 构建完成。
6. 部署完成后访问 Render 提供的 `https://你的服务名.onrender.com`。

重要说明：

- `DASHBOARD_USER` 和 `DASHBOARD_PASSWORD` 强烈建议填写，否则公网地址会直接开放。
- Render 的普通文件系统是临时的，只有 `/app/cache` 下的数据会被 Persistent Disk 保留。
- 项目已将 `PARQET_PORTFOLIO_CSV` 指向 `/app/cache/portfolio.csv`，上传的 CSV 持仓会跟 SQLite 数据库一起保存在持久化磁盘里。
- 如果后续绑定自定义域名，可以在 Render 服务的 `Settings` → `Custom Domains` 中添加域名，再到 DNS 服务商处配置 CNAME。

## 支持的持仓类型

当前版本重点支持以下三类资产：

1. 全球股票
2. 中国 A 股
3. Polymarket 持仓

其中：

- 中国 A 股支持 `CNY` 币种
- A 股代码支持 `.SS` 和 `.SZ` 后缀
- Polymarket 持仓更适合通过 CSV 导入，并建议提供 `current_price`
- Polymarket 没有股票基本面数据，因此系统会使用轻量化评分逻辑分析其盈亏与价格变化

## CSV 导入格式

推荐使用以下表头：

```csv
ticker,shares,buy_price,current_price,buy_date,currency,sector,name,asset_type,market,exchange,country
AAPL,15,142.50,,2024-03-15,USD,Technology,Apple Inc.,equity,US,NASDAQ,US
600519.SS,3,1680.00,,2024-05-10,CNY,Consumer Defensive,Kweichow Moutai,cn_equity,CN-A,SSE,CN
POLY-BTC-150K-2026,80,0.31,0.36,2026-01-05,USD,Prediction Markets,BTC above 150k in 2026?,prediction_market,Polymarket,Polymarket,WEB3
```

字段说明：

- `ticker`：资产代码
- `shares`：持仓数量
- `buy_price`：买入价格
- `current_price`：当前价格，可选；Polymarket 建议填写
- `buy_date`：买入日期
- `currency`：币种，如 `USD`、`EUR`、`CNY`
- `sector`：行业
- `name`：资产名称
- `asset_type`：资产类型，如 `equity`、`cn_equity`、`prediction_market`
- `market`：市场标识
- `exchange`：交易所
- `country`：国家或来源标识

在 Dashboard 里通过 `CSV Import` 上传后，系统会把标准化后的持仓保存到项目目录下的 `portfolio.csv`（可通过 `.env` 里的 `PARQET_PORTFOLIO_CSV` 修改路径）。之后重启服务或执行刷新时，会优先读取这份本地 CSV，所以真实持仓可以长期保存在本地。`portfolio.csv` 已加入 `.gitignore`，避免误提交真实持仓。

## 后续可扩展方向

- 接入更多中国市场数据源
- 为 Polymarket 增加更细粒度的事件分析
- 补充千问语音或语音转写链路
- 增加 Docker / 容器化部署说明
- 增加更完整的多语言文档与截图
