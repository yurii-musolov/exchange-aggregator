import { SymbolPrice, KlineInterval, Kline } from 'binance';

import { Candle, Interval, Schema, Ticker } from "./../../def";

export const fromSymbolPrice = (v: SymbolPrice | Array<SymbolPrice>): Array<Ticker> => {
  if (Array.isArray(v)) return v.map(sp => ({
    symbol: sp.symbol,
    lastPrice: +sp.price,
  }))

  return [{
    symbol: v.symbol,
    lastPrice: +v.price,
  }]

}

export const toKlineInterval = (interval: Interval): KlineInterval => {
  switch (interval) {
    case Interval.Minute1:
      return '1m'

    case Interval.Minute3:
      return '3m'

    case Interval.Minute5:
      return '5m'

    case Interval.Minute15:
      return '15m'

    case Interval.Minute30:
      return '30m'

    case Interval.Hour1:
      return '1h'

    case Interval.Hour2:
      return '2h'

    case Interval.Hour4:
      return '4h'

    case Interval.Hour6:
      return '6h'

    case Interval.Hour12:
      return '12h'

    case Interval.Day1:
      return '1d'

    case Interval.Week1:
      return '1w'

    case Interval.Month1:
      return '1M'

    default:
      throw new Error('unexpected case')
  }
}

export const fromKline = (kline: Kline): Candle => ({
  time: kline[0],
  hight: +kline[2],
  close: +kline[4],
  open: +kline[1],
  low: +kline[3],
  volume: +kline[5],
})

export const toMarket = (schema: Schema): 'spot' | 'usdm' | 'coinm' => {
  switch (schema) {
    case 'spot':
      return 'spot'
    case 'margin':
      return 'spot'
    case 'futures_usdt':
      return 'usdm'
    case 'futures_coin':
      return 'coinm'

    default:
      throw new Error(`unreachable case: schema: ${schema}`)
  }
}
