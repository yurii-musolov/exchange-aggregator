import { newAggregator, Interval } from '../src'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const main = async () => {
  const aggregator = newAggregator()

  const unsubsTickers = await aggregator.subscribeTiker('bybit', 'linear', { symbol: 'BTCUSDT' }, (data) => console.log('DEBUG (bybit, linear, BTCUSDT, tickers):', data))

  await delay(3000)
  await unsubsTickers()

  await delay(3000)
  const unsubCandles = await aggregator.subscribeCandles('bybit', 'linear', { symbol: 'BTCUSDT', interval: Interval.Minute1 }, (data) => console.log('DEBUG (bybit, linear, BTCUSDT, 1m, candles):', data))

  await delay(3000)
  await unsubCandles()

  await delay(3000)
}

main()
