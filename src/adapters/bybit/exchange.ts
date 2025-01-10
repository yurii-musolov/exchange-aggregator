import { RestClientV5, CategoryV5 } from 'bybit-api'

import { Exchanger } from "@/aggregator";
import { Candle, GetCandlesParams, Schema, Ticker } from "@/def";
import { fromTickerLinearInverse, fromTickerOption, fromTickerSpot, fromKline, toCategory, toKlineInterval } from './map';

export class BybitExchange implements Exchanger {
  private restClient: RestClientV5

  constructor(restClient: RestClientV5) {
    this.restClient = restClient
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
}
