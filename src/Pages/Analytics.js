import React from 'react';
import PortfolioAnalytics from '../Components/PortfolioAnalytics';

const Analytics = (props) => {
  return (
    <div className="Analytics">
      <PortfolioAnalytics
        coinz={props.coinz}
        marketData={props.marketData}
        exchangeRate={props.exchangeRate}
        currency={props.currency}
      />
    </div>
  )
}

export default Analytics;
