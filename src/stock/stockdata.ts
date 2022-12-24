import axios from "axios";
import { Logger } from "../utils/Logger";
// import { writeFileSync } from "fs";

export interface stockType {
  stockEndType: string; // "stock",
  itemCode: string; // "005930",
  reutersCode: string; // "005930",
  stockName: string; // "삼성전자",
  sosok: string; // "0",
  closePrice: string; // "58,100",
  compareToPreviousClosePrice: string; // "-1,000",
  compareToPreviousPrice: {
    code: string; // "5",
    text: string; // "하락",
    name: string; // "FALLING"
  }
  fluctuationsRatio: string; // "-1.69",
  accumulatedTradingVolume: string; // "9,789,898",
  accumulatedTradingValue: string; // "568,107",
  accumulatedTradingValueKrwHangeul: string; // "5,681억원",
  localTradedAt: string; // "2022-12-23T15:39:42+09:00",
  marketValue: string; // "3,468,444",
  marketValueHangeul: string; // "346조 8,444억원",
  nav: string; // "N/A",
  threeMonthEarningRate: string; // "N/A",
  marketStatus: string; // "CLOSE",
  tradeStopType: {
    code: string; // "1",
    text: string; // "운영.Trading",
    name: string; // "TRADING"
  }
  stockExchangeType: {
    code: string; // "KS",
    zoneId: string; // "Asia/Seoul",
    nationType: string; // "KOR",
    delayTime: number; // 0,
    startTime: string; // "0900",
    endTime: string; // "1530",
    closePriceSendTime: string; // "1630",
    nameKor: string; // "코스피",
    nameEng: string; // "KOSPI",
    nationCode: string; // "KOR",
    nationName: string; // "대한민국",
    name: string; // "KOSPI"
  }
}

export type marketType = "KOSPI" | "KOSDAQ" | "NASDAQ";

export var STOCK: {
  KOSPI: stockType[];
  KOSDAQ: stockType[];
  NASDAQ: stockType[];
} = {
  KOSPI: [],
  KOSDAQ: [],
  NASDAQ: []
};

const getdata = (market: marketType) => new Promise<stockType[]>(async (res, rej) => {
  const url = market == "NASDAQ" ? "https://api.stock.naver.com/stock/exchange/NASDAQ/marketValue"
    : `https://m.stock.naver.com/api/stocks/marketValue/${market}`;
  const data = await axios.get(`${url}?page=1&pageSize=60`).catch(() => {
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
        const data2 = await axios.get(`${url}?page=${i}&pageSize=60`).catch(() => {
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
  Logger.log(`${market} 주식 새로고침 완료`);
  return res(stocklist);
});

(() => {
  const market: marketType[] = [ "KOSPI", "KOSDAQ", "NASDAQ" ];
  for (let i of market) {
    getdata(i).then((val) => {
      Logger.log(`${i} 주식 초기화완료 [${val.length}개]`);
      // writeFileSync(i+"_DATA.ts", `let t = [\n  "${val.map(s => s.stockName).join('",\n  "')}"\n];\n`, "utf8");
    }).catch(Logger.error);
  }
  setInterval(() => {
    for (let i of market) {
      getdata(i).then((val) => {
        Logger.log(`${i} 주식 초기화완료 [${val.length}개]`);
      }).catch(Logger.error);
    }
  }, 1000 * 60 * 60);
})();
