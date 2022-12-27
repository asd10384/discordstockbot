import { client } from "..";
import { STOCK } from "./stockData";
import { GuildMember } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { exchange } from "./exchange";
import { marketType, stockType } from "./stockConfig";

export const searchStock = async (member: GuildMember, market: marketType, name: string): Promise<[ stockType | undefined, EmbedBuilder ]> => {
  const stocklist = STOCK[market];
  if (stocklist.length == 0) return [ undefined, client.mkembed({
    author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
    title: `** ${market} 주식 검색 오류 **`,
    description: "주식 데이터를 찾을수 없음",
    color: "DarkRed"
  }) ];
  const findstock = stocklist.filter(stock => stock.stockName.replace(/ +/g,"").toLocaleLowerCase().includes(name.replace(/ +/g,"").toLocaleLowerCase()));
  if (!findstock[0]) return [ undefined, client.mkembed({
    author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
    title: `** ${market} 주식 검색 오류 **`,
    description: `${name} 주식을 찾을수 없음`,
    color: "DarkRed"
  }) ];
  return [ findstock[0], client.mkembed({}) ];
}

export const searchStockEmbed = async (member: GuildMember, market: marketType, name: string): Promise<EmbedBuilder> => {
  const findstock = await searchStock(member, market, name);
  if (!findstock[0]) return findstock[1];
  const stock = findstock[0];
  let changevalue = "";
  let money = market === "NASDAQ" ? exchange(stock.compareToPreviousClosePrice.replace("-","")) : stock.compareToPreviousClosePrice;
  switch (stock.compareToPreviousPrice.code) {
    case "2": // 상승
      changevalue = "▲" + money;
      break;
    case "3": // 보합
      changevalue = "" + money;
      break;
    case "5": // 하락
      changevalue = "▼" + money;
      break;
  }
  return client.mkembed({
    author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
    url: market === "NASDAQ" ? `https://m.stock.naver.com/worldstock/stock/${stock.reutersCode}/total` : `https://m.stock.naver.com/domestic/stock/${stock.reutersCode}/total`,
    title: `${market} 주식 검색 : ${name}`,
    addFields: [
      {
        name: `코드`,
        value: `${stock.reutersCode}`,
        inline: true
      },
      {
        name: `이름`,
        value: `${stock.stockName}`,
        inline: true
      },
      {
        name: `현재가`,
        value: `${market === "NASDAQ" ? exchange(stock.closePrice) : stock.closePrice}원`,
        inline: true
      },
      {
        name: `전일대비`,
        value: `${changevalue}원  |  ${stock.fluctuationsRatio}%`,
        inline: true
      },
      {
        name: `거래량`,
        value: `${stock.accumulatedTradingVolume}`,
        inline: true
      },
      {
        name: `거래대금`,
        value: `${stock.accumulatedTradingValueKrwHangeul}`,
        inline: true
      },
      {
        name: `시가총액`,
        value: `${stock.marketValueHangeul}`,
        inline: true
      }
    ],
    image: market === "NASDAQ" ? `https://ssl.pstatic.net/imgfinance/chart/mobile/world/item/candle/day/${stock.reutersCode}_end.png` : `https://ssl.pstatic.net/imgfinance/chart/item/candle/day/${stock.reutersCode}.png`
  });
}
