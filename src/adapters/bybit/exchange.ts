import { RestClientV5, CategoryV5, WebsocketClient } from 'bybit-api'

import { CandlesSubs, Cb, Exchanger, TikerSubs, UnsubCb } from "@/aggregator"
import { Candle, GetCandlesParams, Schema, Ticker } from "@/def"
import { fromTickerLinearInverse, fromTickerOption, fromTickerSpot, fromKline, toCategory, toKlineInterval } from './map'


export class BybitExchange implements Exchanger {
  private readonly restClient: RestClientV5
  private readonly wsClient: WebsocketClient
  private readonly handlers: Set<Cb>

  constructor(restClient: RestClientV5, wsClient: WebsocketClient) {
    this.restClient = restClient
    this.wsClient = wsClient
    this.handlers = new Set()

    this.wsClient.on('update', (data) => {
      this.handlers.forEach(cb => cb(data))
    })
    this.wsClient.on('open', (data) => {
      console.log('connection opened open:', data.wsKey)
    })
    this.wsClient.on('response', (data) => {
      console.log('log response: ', JSON.stringify(data, null, 2))
    })
    this.wsClient.on('reconnect', ({ wsKey }) => {
      console.log('ws automatically reconnecting.... ', wsKey)
    })
    this.wsClient.on('reconnected', (data) => {
      console.log('ws has reconnected ', data?.wsKey)
    })
    this.wsClient.on('error', (data) => {
      console.error('ws exception: ', data)
    })
  }

  async getTikers(schema: Schema): Promise<Array<Ticker>> {
    const category = (toCategory(schema) as CategoryV5)
    switch (category) {
      case 'spot':
        return this.restClient.getTickers({ category: 'spot' }).then(response => response.result.list.map(fromTickerSpot))

      case 'linear':
        return this.restClient.getTickers({ category: 'linear' }).then(response => response.result.list.map(fromTickerLinearInverse))

      case 'inverse':
        return this.restClient.getTickers({ category: 'inverse' }).then(response => response.result.list.map(fromTickerLinearInverse))

      case 'option':
        return this.restClient.getTickers({ category: 'option' }).then(response => response.result.list.map(fromTickerOption))

      default:
        throw new Error(`unreachable case: category: ${category}`)
    }
  }

  async getCandles(schema: Schema, params: GetCandlesParams): Promise<Array<Candle>> {
    const category = toCategory(schema)
    if (category === 'option') throw new Error(`unsupported parameter value: schema: ${schema}, category: ${category}`)

    return this.restClient.getKline({
      category,
      interval: toKlineInterval(params.interval),
      symbol: params.symbol,
      start: params.start,
      end: params.end,
      limit: params.limit,
    }).then(response => {
      return response.result.list.map(fromKline)
    })
  }

  async subscribeTiker(schema: Schema, sub: TikerSubs, cb: Cb): Promise<UnsubCb> {
    const category = toCategory(schema)
    const topic = toTikerTopic(sub)
    this.handlers.add(cb)
    this.wsClient.subscribeV5([topic], category)
    // TODO: inplement promisifacation
    return async () => this.unsubscribeTiker(schema, sub, cb)
  }

  async unsubscribeTiker(schema: Schema, sub: TikerSubs, cb: Cb): Promise<void> {
    const category = toCategory(schema)
    const topic = toTikerTopic(sub)
    this.handlers.delete(cb)
    this.wsClient.subscribeV5([topic], category)
    // TODO: inplement promisifacation
  }

  async subscribeCandles(schema: Schema, sub: CandlesSubs, cb: Cb): Promise<UnsubCb> {
    const category = toCategory(schema)
    const topic = toCandlesTopic(sub)
    this.handlers.add(cb)
    this.wsClient.subscribeV5([topic], category)
    // TODO: inplement promisifacation
    return async () => this.unsubscribeCandles(schema, sub, cb)
  }

  async unsubscribeCandles(schema: Schema, sub: CandlesSubs, cb: Cb): Promise<void> {
    const category = toCategory(schema)
    const topic = toCandlesTopic(sub)
    this.handlers.delete(cb)
    this.wsClient.subscribeV5([topic], category)
    // TODO: inplement promisifacation
  }
}

export const toTikerTopic = (sub: TikerSubs): string => {
  return `tickers.${sub.symbol}`
}

export const toCandlesTopic = (sub: CandlesSubs): string => {
  const interval = toKlineInterval(sub.interval)
  return `kline.${interval}.${sub.symbol}`
}
