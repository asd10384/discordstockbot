import { client } from "..";
import { marketType, STOCK } from "./stockdata";
import { GuildMember } from "discord.js";
import { EmbedBuilder } from "@discordjs/builders";
import { maxEmbedTextLength } from "./stockConfig";

const fixnumber = (num: number): string => {
  return num < 10 ? "00"+num
    : num < 100 ? "0"+num
    : ""+num;
}

export const searchMoney = async (member: GuildMember, market: marketType, num: number): Promise<[ EmbedBuilder[][], number, number ]> => {
  const stocklist = STOCK[market];
  if (stocklist.length == 0) return [[[ client.mkembed({
    author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
    title: `** ${market} 주식 가격검색 오류 **`,
    description: "주식 데이터를 찾을수 없음",
    color: "DarkRed"
  }) ]], 0, 0 ];
  let output: EmbedBuilder[][] = [];
  let text = "";
  let outputnumber = 0;
  let stocknumber = 1;
  const stockfilter = stocklist.filter(stock => Number(stock.closePrice.replace(/\,/g,"")) <= num);
  for (let stock of stockfilter) {
    let stocktext = `${fixnumber(stocknumber++)}. ${stock.stockName} [${stock.closePrice}원]\n`;
    if (text.length + stocktext.length > maxEmbedTextLength) {
      if (!output[outputnumber]) output[outputnumber] = [];
      output[outputnumber].push(client.mkembed({
        description: text
      }));
      text = "";
      if (output[outputnumber].length == 5) outputnumber++;
    }
    text += stocktext;
  }
  if (!output[outputnumber]) output[outputnumber] = [];
  output[outputnumber].push(client.mkembed({
    description: text
  }));
  if (stockfilter.length == 0) return [[[ client.mkembed({
    author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
    title: `** ${market} 주식 가격검색 : ${num} **`,
    description: `검색결과가 없음`
  }) ]], 0, 0 ];
  output[0][0]
    .setAuthor({ name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) })
    .setTitle(`** ${market} 주식 가격검색 : ${num} (총: ${stockfilter.length}개) **`);
  let max = 0;
  for (let i of output) {
    max += i.length;
  }
  for (let i=0; i<output.length; i++) {
    for (let j=0; j<output[i].length; j++) {
      output[i][j].setFooter({ text: `${i*5+j+1}/${max}` });
    }
  }
  return [ output, max, stockfilter.length ];
}