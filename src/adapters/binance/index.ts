import { CoinMClient, MainClient, USDMClient, WebsocketClient } from 'binance';
import { BinanceExchange } from './exchange';

export type { BinanceExchange } from './exchange'

export const newBinanceExchange = (): BinanceExchange => {
  const mainClient = new MainClient({ beautifyResponses: true });
  const usdmClient = new USDMClient({ beautifyResponses: true });
  const coinmClient = new CoinMClient({ beautifyResponses: true });
  const wsClient = new WebsocketClient({ beautify: true })

  return new BinanceExchange(mainClient, usdmClient, coinmClient, wsClient)
}
