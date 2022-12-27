import axios from "axios";
import { Logger } from "../utils/Logger";
import { marketType, stockType } from "./stockConfig";
// import { writeFileSync } from "fs";

export var STOCK: {
  KOSPI: stockType[];
  KOSDAQ: stockType[];
  NASDAQ: stockType[];
} = {
  KOSPI: [],
  KOSDAQ: [],
  NASDAQ: []
};

const getData = (market: marketType) => new Promise<stockType[]>(async (res, rej) => {
  const url = market == "NASDAQ" ? "https://api.stock.naver.com/stock/exchange/NASDAQ/marketValue"
    : `https://m.stock.naver.com/api/stocks/marketValue/${market}`;
  const data = await axios.get(`${url}?page=1&pageSize=60`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Encoding": "gzip,deflate,compress",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }
  }).catch(() => {
    return {
      status: 404,
      data: undefined
    }
  });
  let stocklist: stockType[] = [];
  if (data.status == 200 && data.data) {
    stocklist.push(...(data.data.stocks || []));
    let pcount = Math.ceil(data.data.totalCount/60);
    if (pcount > 1) {
      for (let i=2; i<=pcount; i++) {
        const data2 = await axios.get(`${url}?page=${i}&pageSize=60`, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Encoding": "gzip,deflate,compress",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
          }
        }).catch(() => {
          return {
            status: 404,
            data: undefined
          }
        });
        if (data2.status == 200 && data2.data) {
          stocklist.push(...(data2.data.stocks || []));
        }
      }
    }
  }
  if (stocklist.length == 0) return rej(`${market} 주식 오류발생`);
  STOCK[market] = stocklist;
  Logger.info(`${market} 주식 새로고침 완료`);
  return res(stocklist);
});

(() => {
  const market: marketType[] = [ "KOSPI", "KOSDAQ", "NASDAQ" ];
  for (let i of market) {
    getData(i).then((val) => {
      Logger.info(`${i} 주식 초기화완료 [${val.length}개]`);
      // writeFileSync(i+"_DATA.ts", `let t = ${JSON.stringify(val, undefined, 2)};`, "utf8");
    }).catch(Logger.error);
  }
  setInterval(() => {
    for (let i of market) {
      getData(i).then((val) => {
        Logger.info(`${i} 주식 초기화완료 [${val.length}개]`);
      }).catch(Logger.error);
    }
  }, 1000 * 60 * 10);
})();
