import React, { useMemo } from 'react';
import styled from 'styled-components';
import Chart from './Chart';
import { $currencySymbol } from '../Utils/Helpers';

const Container = styled.div`
  padding: 20px;
`;

const Metrics = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Metric = styled.div`
  background: #303032;
  color: white;
  padding: 12px;
  border-radius: 8px;
  min-width: 180px;
`;

const PortfolioAnalytics = ({ coinz, marketData, exchangeRate, currency }) => {
  const curSymbol = $currencySymbol(currency || 'USD');

  const metrics = useMemo(() => {
    const items = [];
    let totalValue = 0;
    let totalBasis = 0;
    for (const coin in coinz) {
      const hodl = coinz[coin].hodl;
      const basis = coinz[coin].cost_basis * hodl * exchangeRate;
      const price = marketData[coin] && marketData[coin].ticker ? marketData[coin].ticker.price * exchangeRate : 0;
      const value = price * hodl;
      totalValue += value;
      totalBasis += basis;
      items.push({ coin, hodl, price, value, basis });
    }
    const performance = totalBasis > 0 ? ((totalValue - totalBasis) / totalBasis) * 100 : 0;
    const sortedByPerf = items.slice().sort((a, b) => ((a.value - a.basis) / (a.basis || 1)) - ((b.value - b.basis) / (b.basis || 1)));
    const best = sortedByPerf[sortedByPerf.length - 1] || null;
    const worst = sortedByPerf[0] || null;

    return { totalValue, totalBasis, performance, best, worst, items };
  }, [coinz, marketData, exchangeRate]);

  return (
    <Container>
      <h2>Portfolio Analytics</h2>
      <Metrics>
        <Metric>
          <div>Total Value</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{curSymbol}{Number(metrics.totalValue).toFixed(2)}</div>
        </Metric>
        <Metric>
          <div>Cost Basis</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{curSymbol}{Number(metrics.totalBasis).toFixed(2)}</div>
        </Metric>
        <Metric>
          <div>Return</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{metrics.performance.toFixed(2)}%</div>
        </Metric>
        <Metric>
          <div>Best Performer</div>
          <div style={{ fontSize: 16 }}>{metrics.best ? `${metrics.best.coin} (${((metrics.best.value - metrics.best.basis) / (metrics.best.basis || 1) * 100).toFixed(2)}%)` : 'N/A'}</div>
        </Metric>
        <Metric>
          <div>Worst Performer</div>
          <div style={{ fontSize: 16 }}>{metrics.worst ? `${metrics.worst.coin} (${((metrics.worst.value - metrics.worst.basis) / (metrics.worst.basis || 1) * 100).toFixed(2)}%)` : 'N/A'}</div>
        </Metric>
      </Metrics>

      <div style={{ marginTop: 20 }}>
        <h3>Portfolio Value Over Time</h3>
        {/* reuse Chart component with a placeholder ticker 'BTC' to show chart UI; ideally would use aggregated portfolio time series */}
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
          <Chart ticker={'BTC'} chartColor={'#21ce99'} exchangeRate={exchangeRate} />
        </div>
      </div>
    </Container>
  );
};

export default PortfolioAnalytics;
