/**
 * 한 메세지에 임베드 총 5개 가능
 */
export const maxEmbedNumber = 10;
/**
 * 한 메세지에 총 6000자 가능 (임베드에있는 모든 글자도 포함)
 */
export const maxEmbedTextLength = 1000;

/**
 * 숫자 자릿수 맞춤
 * @param digit 1 2 3 중 하나
 * @param num 숫자
 * @returns 0을 넣어서 3자리로 만들어줌
 */
export const fixNumber = (digit: 1 | 2 | 3, num: number): string => {
  let addzero = "";
  if (digit <= 3 && num < 100) addzero += "0";
  if (digit <= 2 && num < 10) addzero += "0";
  return addzero + num;
}

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
