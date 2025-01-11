export type { Exchanger } from "./aggregator";

import { newBinanceExchange } from "./adapters/binance";
import { newBybitExchange } from "./adapters/bybit";
import { ExchangeAggregator } from "./aggregator";

export * from './def'
export type { ExchangeAggregator }

export const newAggregator = (): ExchangeAggregator => {
  const binance = newBinanceExchange()
  const bybit = newBybitExchange()

  return new ExchangeAggregator(binance, bybit)
}
