# [Coinfox.co](http://coinfox.co) Crypto Coin Portfolio Tracker

Easily track all your crypto coin holdings with [Coinfox.co](http://coinfox.co)

## Features

*Charts:*

1 year price history


*Multi-currency support (let me know if you'd like others)*

   * AUD $
   * BGN лв
   * BRL R$
   * CAD $
   * CHF Fr.
   * CNY ¥
   * CZK Kč
   * DKK kr
   * EUR €
   * GBP £
   * HKD $
   * HRK kn
   * HUF Ft
   * IDR Rp
   * ILS ₪
   * INR ₹
   * JPY ¥
   * KRW ₩
   * MXN $
   * MYR RM
   * NOK kr
   * NZD $
   * PHP ₱
   * PLN zł
   * RON lei
   * SEK kr
   * SGD $
   * THB ฿
   * TRY ₺
   * USD $
   * ZAR R


*Individual coin pages:*

* Coin holding total
* Coin holding $ value
* Percentage of Portfolio
* Purchase price (Avg. Cost Basis)
* Remove from portfolio button


*Import/Export: *

* Save your holdings to transfer to another device
* Export: use the menu to download your Save File
* Import: copy the contents of the Save File into the menu a the (scroll to the very bottom) on the new device then save

## Adding Coins

Use the hamburger menu to open up the coin add form
Enter:
 - The coin ticker: BTC, LTC, ETC, DOGE, etc  
 - Your average cost basis, per coin price in $
 - The number of coins for this ticker you hold

## Holdings

After adding coins you will then see all your holdings:

```
               Total portfolio $value
               $gain/loss %gain/loss
 -----------------------------------------------------             
 Ticker                                 coin gain/loss
 # Coins                                Current price
```

              
              
## Check Back Daily on Your hodlings

![alt text](http://i.imgur.com/3QULYvh.png "CoinFox")

## TERMS of USE

Coinfox is licensed under [GNU](https://github.com/vinniejames/coinfox/blob/master/LICENSE.md) for entertainment purposes only. DO NOT execute trades based on price data. Coinfox makes no claims guaranteeing accuracy of price data, nor offers any financial advice.

## Work completed: Price Alerts & Analytics (summary)

I implemented and verified the core portfolio alerting features and extended the analytics dashboard with basic portfolio metrics. Below is what was added / confirmed in the code:

- Price alert system (create, store, trigger):
   - Alert creation component: `src/Components/PriceAlert.js` (supports "Above" / "Below" alert types, simple validation)
   - Storage helpers: `src/Utils/alertHelpers.js` (read/write to Gaia via Blockstack when signed in; falls back to `localStorage`)
   - Evaluation polling: `src/App.js` (polls alerts every 30s and triggers alerts when conditions are met)
   - Notifications & triggered UI: `src/Components/AlertNotification.js` (shows triggered alerts, actions: Acknowledge / Dismiss)
   - UI integration: `src/Pages/Coin.js` includes `PriceAlert` on the coin detail page; `src/Components/CoinList.js` shows per-coin alert counts.

- Analytics dashboard (basic):
   - `src/Components/PortfolioAnalytics.js` calculates total portfolio value, total cost-basis, overall return, and identifies best/worst performers. The chart currently reuses the `Chart` component as a placeholder and should be extended to display an aggregated portfolio time series.

## How to test locally

1. Install dependencies and start the app:

```bash
npm install
npm start
```

2. Test price alerts:
- Open a coin detail page: `http://localhost:3000/coin/<SYMBOL>` (e.g. `/coin/btc`).
- In the "Price Alerts" section enter a target price, select "Above" or "Below" and click "Set Alert".
- Alerts are saved to Gaia if the user is signed in with Blockstack (visit `/blockstack`), otherwise they are stored in `localStorage`.

3. Simulate / observe triggers:
- The app evaluates alerts every 30 seconds (polling). To test faster, temporarily change the `30000` interval in `src/App.js` (the `setInterval`) to `5000`.
- When an alert triggers a notification is dispatched and `AlertNotification` appears (bottom-left). Use Acknowledge or Dismiss to test status updates.

4. Verify storage:
- If signed in with Blockstack: check `coinfox_alerts.json` in Gaia (Blockstack dev tools).
- Otherwise: in DevTools check `localStorage.getItem('alerts')`.

## Key files changed / to review

- `src/Components/PriceAlert.js` — alert creation UI
- `src/Utils/alertHelpers.js` — storage and evaluation helpers
- `src/Components/AlertNotification.js` — triggered alert display
- `src/App.js` — polling, evaluation and notification dispatch
- `src/Components/PortfolioAnalytics.js` — base portfolio metrics

## Limitations and recommended improvements

- Alerts management UI: add a centralized "Manage Alerts" page to list/edit/delete alerts (active/triggered/dismissed).
- Aggregated time series: fetch historical prices (CoinGecko `market_chart`) to build a portfolio value time series for 24h/7d/30d metrics.
- Technical indicators: compute moving averages (MA) and RSI from historical data and overlay on charts.
- Diversification & risk: fetch market cap by coin and add diversification metrics and risk indicators (volatility, simple VaR).
- Polling strategy: make the polling interval configurable or switch to WebSocket if supported by data provider.
- Gaia robustness: add merge/retry logic to avoid overwriting data in multi-tab scenarios.

