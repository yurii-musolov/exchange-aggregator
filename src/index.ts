import { RestClientV5 } from 'bybit-api'
import { MainClient, USDMClient, CoinMClient } from 'binance';

export type { Exchanger } from "./aggregator";

import { BinanceExchange } from "./adapters/binance";
import { BybitExchange } from "./adapters/bybit";
import { ExchangeAggregator } from "./aggregator";

export * from './def'
export type { ExchangeAggregator }

export const newAggregator = (): ExchangeAggregator => {
  const binanceMainRestClient = new MainClient({ beautifyResponses: true });
  const binanceUSDMRestClient = new USDMClient({ beautifyResponses: true });
  const binanceCoinMRestClient = new CoinMClient({ beautifyResponses: true });
  const binance = new BinanceExchange(binanceMainRestClient, binanceUSDMRestClient, binanceCoinMRestClient)

  const bybitRestClient = new RestClientV5()
  const bybit = new BybitExchange(bybitRestClient)

  return new ExchangeAggregator(binance, bybit)
}
