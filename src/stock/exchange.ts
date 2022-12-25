import "dotenv/config";
import axios from "axios";
import { Logger } from "../utils/Logger";

export var exmoney = -1;

const getexchange = async () => {
  const get = await axios.get(`https://api.exchangerate.host/latest?base=USD&symbols=KRW&amount=1`, {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "*",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
  },
  responseType: "json"
  }).catch(() => {
    return { data: { success: false, rates: { KRW: 0.0 } } };
  });
  if (get.data.success) {
    if (get.data.rates?.KRW) {
      exmoney = get.data.rates.KRW;
      Logger.info("환율 : " + exmoney.toFixed(2) + "원");
      return;
    }
  }
  Logger.error("환율 정보를 가져올수 없음");
}

export const exchange = (getmoney: string) => new Promise<string>(async (res, _rej) => {
  const money = Number(getmoney.replace(/\,/g,""));
  if (exmoney == -1) await getexchange();
  if (exmoney == -1) return res(money.toLocaleString("ko-KR"));
  return res(Number(Math.floor(money * exmoney)).toLocaleString("ko-KR"));
});


(() => {
  getexchange();
  setInterval(() => {
    getexchange();
  }, 1000 * 60 * 60);
})();
