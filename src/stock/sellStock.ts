import { GuildMember, EmbedBuilder, Guild } from "discord.js";
import { client } from "../index";
import { QDB, stocksType } from "../databases/Quickdb";
import { searchStock } from "./searchStock";
import { marketType } from "./stockConfig";

export const sellStock = async (guild: Guild, member: GuildMember, market: marketType, name: string, count: number): Promise<EmbedBuilder> => {
  const findstock = await searchStock(member, market, name);
  if (!findstock[0]) return findstock[1];
  const stock = findstock[0];
  const stockPrice = Number(stock.closePrice.replace(/\,/g,""));
  const UDB = await QDB.user.get(guild, member);
  let stocks: stocksType[] = [];
  let lastcount = count;
  let hascount = 0;
  let getmoney = 0;
  for (let dbstock of UDB.stocks) {
    if (stock.reutersCode == dbstock.code) {
      if (dbstock.count > lastcount) {
        getmoney += stockPrice * lastcount;
        stocks.push({
          ...dbstock,
          count: dbstock.count-lastcount
        });
        lastcount = -1;
      } else if (dbstock.count == lastcount) {
        getmoney += stockPrice * lastcount;
        lastcount = -1;
      } else if (dbstock.count < lastcount) {
        getmoney += stockPrice * dbstock.count;
        lastcount -= dbstock.count;
        hascount += dbstock.count;
      }
    } else {
      stocks.push(dbstock);
    }
  }
  if (lastcount > 0) return client.mkembed({
    author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
    title: `** 주식 매도 오류 **`,
    description: `보유하고있는 ${stock.stockName} 주식이 부족합니다.\n보유 : ${hascount}개\n부족 : ${count-hascount}개`,
    color: "DarkRed"
  });
  const check = await QDB.user.set(guild.id, member.id, { stocks: stocks, money: UDB.money + getmoney });
  if (!check) return client.mkembed({
    author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
    title: `** ${name} 주식 매도 오류 **`,
    description: `주식 매도중 오류발생`,
    color: "DarkRed"
  });
  return client.mkembed({
    author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
    title: `** ${name} 주식 매도 성공 **`,
    description: `
      주식이름 : ${stock.stockName}
      매도수량 : ${count}개
      총받은금액 : ${(getmoney).toLocaleString("ko-KR")}원
      현재 보유금액 : ${(UDB.money + getmoney).toLocaleString("ko-KR")}원
    `
  });
}