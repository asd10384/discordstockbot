import { STOCK } from "./stockData";
import { marketType } from "./stockConfig";
import { exchange } from "./exchange";

export const getStock = async (market: marketType, code: string): Promise<[ string | undefined, string ]> => {
  const stocklist = STOCK[market];
  if (stocklist.length == 0) return [ undefined, "주식 데이터를 찾을수 없음" ];
  const findstock = stocklist.filter(stock => stock.reutersCode == code);
  if (!findstock[0]) return [ undefined, `${code} 주식을 찾을수 없음` ];
  if (market === "NASDAQ") return [ exchange(findstock[0].closePrice), "" ];
  return [ findstock[0].closePrice, "" ];
}
