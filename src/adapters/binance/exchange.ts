import { MainClient, USDMClient, CoinMClient, WebsocketClient } from 'binance'

import { CandlesSubs, Cb, Exchanger, TikerSubs, UnsubCb } from "@/aggregator"
import { Candle, GetCandlesParams, Schema, Ticker } from "./../../def"
import { fromKline, fromSymbolPrice, toKlineInterval, toMarket } from './map'

export class BinanceExchange implements Exchanger {
  private readonly mainClient: MainClient
  private readonly usdmClient: USDMClient
  private readonly coinmClient: CoinMClient
  private readonly wsClient: WebsocketClient
  private readonly handlers: Set<Cb>

  constructor(mainClient: MainClient, usdmClient: USDMClient, coinmClient: CoinMClient, wsClient: WebsocketClient) {
    this.mainClient = mainClient
    this.usdmClient = usdmClient
    this.coinmClient = coinmClient
    this.wsClient = wsClient
    this.handlers = new Set()

    this.wsClient.on('message', (data) => {
      this.handlers.forEach(cb => cb(data))
    })
    this.wsClient.on('formattedMessage', (data) => {
      this.handlers.forEach(cb => cb(data))
    })
    this.wsClient.on('open', (data) => {
      console.log('connection opened open:', data.wsKey, data.ws.target.url)
    })
    this.wsClient.on('reply', (data) => {
      console.log('log reply: ', JSON.stringify(data, null, 2))
    })
    this.wsClient.on('reconnecting', (data) => {
      console.log('ws automatically reconnecting.... ', data?.wsKey)
    })
    this.wsClient.on('reconnected', (data) => {
      console.log('ws has reconnected ', data?.wsKey)
    })
    this.wsClient.on('error', (data) => {
      console.log('ws saw error ', data?.wsKey)
    })
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
        return this.coinmClient.getSymbolPriceTicker().then(fromSymbolPrice)

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
        return this.coinmClient.getKlines(kLinesParams).then(klines => klines.map(fromKline))

      default:
        throw new Error(`unreachable case: schema: ${schema}`)
    }
  }

  async subscribeTiker(schema: Schema, sub: TikerSubs, cb: Cb): Promise<UnsubCb> {
    this.handlers.add(cb)
    const w = this.wsClient.subscribeSymbol24hrTicker(sub.symbol, toMarket(schema))
    w.wsKey
    // TODO: implement promisification
    return async () => this.unsubscribeTiker(schema, sub, cb)
  }

  async unsubscribeTiker(schema: Schema, sub: TikerSubs, cb: Cb): Promise<void> {
    this.handlers.delete(cb)
    // TODO: implement promisification
    // TODO: use unsubscribe method
  }

  async subscribeCandles(schema: Schema, sub: CandlesSubs, cb: Cb): Promise<UnsubCb> {
    this.handlers.add(cb)
    this.wsClient.subscribeKlines(sub.symbol, toKlineInterval(sub.interval), toMarket(schema))
    // TODO: implement promisification
    return async () => this.unsubscribeCandles(schema, sub, cb)
  }

  async unsubscribeCandles(schema: Schema, sub: CandlesSubs, cb: Cb): Promise<void> {
    this.handlers.delete(cb)
    // TODO: implement promisification
    // TODO: use unsubscribe method
  }
}
