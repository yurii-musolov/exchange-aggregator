import { MainClient, USDMClient, CoinMClient } from 'binance';

import { Exchanger } from "@/aggregator";
import { Candle, GetCandlesParams, Schema, Ticker } from "./../../def";
import { fromKline, fromSymbolPrice, toKlineInterval } from './map';

export class BinanceExchange implements Exchanger {
  private mainClient: MainClient
  private usdmClient: USDMClient
  private coinMClient: CoinMClient

  constructor(mainClient: MainClient, usdmClient: USDMClient, coinMClient: CoinMClient) {
    this.mainClient = mainClient
    this.usdmClient = usdmClient
    this.coinMClient = coinMClient
  }

  async getTikers(schema: Schema): Promise<Array<Ticker>> {
    switch (schema) {
      case 'spot':
        return this.mainClient.getSymbolPriceTicker().then(fromSymbolPrice)
      case 'margin':
        return this.mainClient.getSymbolPriceTicker().then(fromSymbolPrice)
      case 'futures_usdt':
        return this.usdmClient.getSymbolPriceTicker().then(fromSymbolPrice)
      case 'futures_coin':
        return this.coinMClient.getSymbolPriceTicker().then(fromSymbolPrice)

      default:
        throw new Error(`unreachable case: schema: ${schema}`)
    }
  }

  async getCandles(schema: Schema, params: GetCandlesParams): Promise<Array<Candle>> {
    const kLinesParams = {
      symbol: params.symbol,
      interval: toKlineInterval(params.interval),
      startTime: params.start,
      endTime: params.end,
      limit: params.limit
    }

    switch (schema) {
      case 'spot':
        return this.mainClient.getKlines(kLinesParams).then(klines => klines.map(fromKline))
      case 'margin':
        return this.mainClient.getKlines(kLinesParams).then(klines => klines.map(fromKline))
      case 'futures_usdt':
        return this.usdmClient.getKlines(kLinesParams).then(klines => klines.map(fromKline))
      case 'futures_coin':
        return this.coinMClient.getKlines(kLinesParams).then(klines => klines.map(fromKline))

      default:
        throw new Error(`unreachable case: schema: ${schema}`)
    }
  }
}
