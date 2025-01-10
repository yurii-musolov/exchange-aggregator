import { Candle, Exchange, GetCandlesParams, Schema, Ticker } from "./def"

export interface Exchanger {
  getTikers(schema: Schema): Promise<Array<Ticker>>
  getCandles(schema: Schema, params: GetCandlesParams): Promise<Array<Candle>>
}

export class ExchangeAggregator {
  private binance: Exchanger
  private bybit: Exchanger

  constructor(binance: Exchanger, bybit: Exchanger) {
    this.binance = binance
    this.bybit = bybit
  }

  private current(exchange: Exchange): Exchanger {
    switch (exchange) {
      case 'bybit':
        return this.bybit

      case 'binance':
        return this.binance

      default:
        throw new Error('unreachable case')
    }
  }

  public async getTikers(exchange: Exchange, schema: Schema): Promise<Array<Ticker>> {
    return this.current(exchange).getTikers(schema)
  }

  public async getCandles(exchange: Exchange, schema: Schema, params: GetCandlesParams): Promise<Array<Candle>> {
    return this.current(exchange).getCandles(schema, params)
  }
}