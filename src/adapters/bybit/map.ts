import { KlineIntervalV3, OHLCVKlineV5, OHLCKlineV5, TickerSpotV5, TickerOptionV5, TickerLinearInverseV5, CategoryV5 } from 'bybit-api'

import { Candle, Interval, Schema, Ticker } from "./../../def";

export const toCategory = (schema: Schema): CategoryV5 => {
  switch (schema) {
    case 'spot':
      return 'spot'

    case 'linear':
      return 'linear'

    case 'inverse':
      return 'inverse'

    case 'option':
      return 'option'

    default:
      throw new Error('unreachable case')
  }
}

export const fromTickerLinearInverse = (ticker: TickerLinearInverseV5): Ticker => (
  {
    symbol: ticker.symbol,
    lastPrice: +ticker.lastPrice,
  })

export const fromTickerOption = (ticker: TickerOptionV5): Ticker => (
  {
    symbol: ticker.symbol,
    lastPrice: +ticker.lastPrice,
  })

export const fromTickerSpot = (ticker: TickerSpotV5): Ticker => (
  {
    symbol: ticker.symbol,
    lastPrice: +ticker.lastPrice,
  })


export const toKlineInterval = (interval: Interval): KlineIntervalV3 => {
  switch (interval) {
    case Interval.Minute1:
      return '1'

    case Interval.Minute3:
      return '3'

    case Interval.Minute5:
      return '5'

    case Interval.Minute15:
      return '15'

    case Interval.Minute30:
      return '30'

    case Interval.Hour1:
      return '60'

    case Interval.Hour2:
      return '120'

    case Interval.Hour4:
      return '240'

    case Interval.Hour6:
      return '360'

    case Interval.Hour12:
      return '720'

    case Interval.Day1:
      return 'D'

    case Interval.Week1:
      return 'W'

    case Interval.Month1:
      return 'M'

    default:
      throw new Error('unexpected case')
  }
}

export const fromKline = (kline: OHLCVKlineV5 | OHLCKlineV5): Candle =>
({
  time: +kline[0],
  open: +kline[1],
  hight: +kline[2],
  low: +kline[3],
  close: +kline[4],
  volume: +kline[4] || 0,
})
