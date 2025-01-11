import { RestClientV5, WebsocketClient } from "bybit-api";
import { BybitExchange } from "./exchange";

export type { BybitExchange } from "./exchange";

export const newBybitExchange = (): BybitExchange => {
  const restClient = new RestClientV5()
  const wsClient = new WebsocketClient({ market: 'v5' });

  return new BybitExchange(restClient, wsClient)
}
