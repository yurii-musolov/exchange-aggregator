import { Candle, Exchange, GetCandlesParams, Interval, Schema, Ticker } from "./def"

export type TikerSubs = {
  symbol: string,
}

export type CandlesSubs = {
  symbol: string,
  interval: Interval,
}

export type Cb = (data: any) => void
export type UnsubCb = () => Promise<void>

export interface Exchanger {
  getTikers(schema: Schema): Promise<Array<Ticker>>
  getCandles(schema: Schema, params: GetCandlesParams): Promise<Array<Candle>>
  subscribeTiker(schema: Schema, sub: TikerSubs, cb: Cb): Promise<UnsubCb>
  unsubscribeTiker(schema: Schema, sub: TikerSubs, cb: Cb): Promise<void>
  subscribeCandles(schema: Schema, sub: CandlesSubs, cb: Cb): Promise<UnsubCb>
  unsubscribeCandles(schema: Schema, sub: CandlesSubs, cb: Cb): Promise<void>
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

  async subscribeTiker(exchange: Exchange, schema: Schema, sub: TikerSubs, cb: Cb): Promise<UnsubCb> {
    return this.current(exchange).subscribeTiker(schema, sub, cb)
  }

  async unsubscribeTiker(exchange: Exchange, schema: Schema, sub: TikerSubs, cb: Cb): Promise<void> {
    return this.current(exchange).unsubscribeTiker(schema, sub, cb)
  }

  async subscribeCandles(exchange: Exchange, schema: Schema, sub: CandlesSubs, cb: Cb): Promise<UnsubCb> {
    return this.current(exchange).subscribeCandles(schema, sub, cb)
  }

  async unsubscribeCandles(exchange: Exchange, schema: Schema, sub: CandlesSubs, cb: Cb): Promise<void> {
    return this.current(exchange).unsubscribeCandles(schema, sub, cb)
  }
}