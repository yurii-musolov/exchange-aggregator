export type Exchange = 'bybit' | 'binance'
export type Schema = 'spot' | 'linear' | 'inverse' | 'option' | 'margin' | 'futures_usdt' | 'futures_coin'

export const is_valid_exchange = (exchange: Exchange): boolean => {
  switch (exchange) {
    case 'bybit':
      return true

    case 'binance':
      return true

    default:
      return false
  }
}

export const is_valid_schema = (exchange: Exchange, schema: Schema): boolean => {
  switch (exchange) {
    case 'bybit':
      switch (schema) {
        case 'spot':
          return true

        case 'linear':
          return true

        case 'inverse':
          return true

        case 'option':
          return true

        default:
          return false
      }

    case 'binance':
      switch (schema) {
        case 'spot':
          return true

        case 'margin':
          return true

        case 'futures_usdt':
          return true

        case 'futures_coin':
          return true

        default:
          return false
      }

    default:
      return false
  }
}

export type Price = number
export type Volume = number
export type Timestamp = number

export type Ticker = {
  symbol: string,
  lastPrice: Price,
}

export enum Interval {
  Minute1 = '1m',
  Minute3 = '3m',
  Minute5 = '5m',
  Minute15 = '15m',
  Minute30 = '30m',
  Hour1 = '1h',
  Hour2 = '2h',
  Hour4 = '4h',
  Hour6 = '6h',
  Hour12 = '12h',
  Day1 = '1D',
  Month1 = '1M',
  Week1 = '1W',
}

export type GetCandlesParams = {
  symbol: string,
  start?: Timestamp,
  end?: Timestamp,
  interval: Interval,
  limit?: number,
}

export type Candle = {
  time: Timestamp,
  hight: Price,
  close: Price,
  open: Price,
  low: Price,
  volume: Volume,
}
