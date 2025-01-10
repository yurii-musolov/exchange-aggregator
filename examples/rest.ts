import { newAggregator, Interval } from '../src'

export const main = async () => {
  const aggregator = newAggregator()

  const tickers = await aggregator.getTikers('binance', 'spot')
  console.log('DEBUG (binance, spot, tickers):', tickers.slice(0, 3))
  const candles = await aggregator.getCandles('bybit', 'linear', { symbol: 'BTCUSDT', interval: Interval.Minute1, limit: 2 })
  console.log('DEBUG (binance, spot, BTCUSDT, Interval.Minute1, candles):', candles)
}

main()
