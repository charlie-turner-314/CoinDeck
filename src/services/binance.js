import dotenv from "dotenv";
import Binance from "node-binance-api";
dotenv.config();
export const binance = new Binance().options({
  APIKEY: "VQo1I0HomDXP97g2iNdrr0hrFVIo115HVIiRu9hBF8XURLPJUEF1nJFSgloFZFhI",
  APISECRET: "eUJSBiUGA07hqh8zJK8nbpV402Re2iy6R6YigfVSSNwAKikLMzVzuO7AGyB2JxsC",
});
