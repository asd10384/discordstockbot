import { client } from "../index";
import { Command } from "../interfaces/Command";
import { check_permission as ckper, embed_permission as emper } from "../utils/Permission";
// import { Logger } from "../utils/Logger";
import { Message, EmbedBuilder, ApplicationCommandOptionType, ChatInputApplicationCommandData, CommandInteraction, GuildMember, Guild, ChannelType } from "discord.js";
import { QDB } from "../databases/Quickdb";
import { maxEmbedNumber } from "../stock/stockConfig";
import { searchName } from "../stock/searchName";
import { searchStockEmbed } from "../stock/searchStock";
import { searchMoney } from "../stock/searchMoney";
import { buyStock } from "../stock/buyStock";
import { sellStock } from "../stock/sellStock";
import { getStock } from "../stock/getStockPrice";

/**
 * DB
 * let guildDB = await QDB.get(interaction.guild!);
 * 
 * check permission(role)
 * if (!(await ckper(interaction))) return await interaction.followUp({ embeds: [ emper ] });
 * if (!(await ckper(message))) return message.channel.send({ embeds: [ emper ] }).then(m => client.msgdelete(m, 1));
 */

export default class implements Command {
  /** 해당 명령어 설명 */
  name = "주식";
  visible = true;
  description = "주식";
  information = "주식";
  aliases: string[] = [];
  metadata: ChatInputApplicationCommandData = {
    name: this.name,
    description: this.description,
    options: [
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "채널생성",
        description: "주식명령어를 사용할수있는 채널 생성"
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "돈",
        description: "주식 보유금액 확인"
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "보유",
        description: "보유중인 주식확인"
      },
      {
        type: ApplicationCommandOptionType.Subcommand,
        name: "지원금",
        description: "주식 지원금"
      },
      {
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: "검색",
        description: "주식 검색",
        options: [
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스피",
            description: "코스피 주식 검색",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "주식이름",
              description: "주식 이름",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스닥",
            description: "코스닥 주식 검색",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "주식이름",
              description: "주식 이름",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "나스닥",
            description: "나스닥 주식 검색",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "주식이름",
              description: "주식 이름",
              required: true
            }]
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: "이름검색",
        description: "주식 이름검색",
        options: [
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스피",
            description: "코스피 주식 이름검색",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "주식이름",
              description: "주식 이름",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스닥",
            description: "코스닥 주식 이름검색",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "주식이름",
              description: "주식 이름",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "나스닥",
            description: "나스닥 주식 이름검색",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "주식이름",
              description: "주식 이름",
              required: true
            }]
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: "가격검색",
        description: "주식 가격검색",
        options: [
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스피",
            description: "코스피 주식 가격검색",
            options: [{
              type: ApplicationCommandOptionType.Integer,
              name: "가격",
              description: "입력한 가격 아래 코스피 주식검색",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스닥",
            description: "코스닥 주식 가격검색",
            options: [{
              type: ApplicationCommandOptionType.Integer,
              name: "가격",
              description: "입력한 가격 아래 코스닥 주식검색",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "나스닥",
            description: "나스닥 주식 가격검색",
            options: [{
              type: ApplicationCommandOptionType.Integer,
              name: "가격",
              description: "입력한 가격 아래 나스닥 주식검색",
              required: true
            }]
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: "매수",
        description: "주식 매수",
        options: [
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스피",
            description: "코스피 주식 매수",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "데이터",
              description: "<주식이름> <매수수량> 순서로 입력해주세요.",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스닥",
            description: "코스닥 주식 매수",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "데이터",
              description: "<주식이름> <매수수량> 순서로 입력해주세요.",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "나스닥",
            description: "나스닥 주식 매수",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "데이터",
              description: "<주식이름> <매수수량> 순서로 입력해주세요.",
              required: true
            }]
          }
        ]
      },
      {
        type: ApplicationCommandOptionType.SubcommandGroup,
        name: "매도",
        description: "주식 매도",
        options: [
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스피",
            description: "코스피 주식 매도",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "데이터",
              description: "<주식이름> <매도수량> 순서로 입력해주세요.",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "코스닥",
            description: "코스닥 주식 매도",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "데이터",
              description: "<주식이름> <매도수량> 순서로 입력해주세요.",
              required: true
            }]
          },
          {
            type: ApplicationCommandOptionType.Subcommand,
            name: "나스닥",
            description: "나스닥 주식 매도",
            options: [{
              type: ApplicationCommandOptionType.String,
              name: "데이터",
              description: "<주식이름> <매도수량> 순서로 입력해주세요.",
              required: true
            }]
          }
        ]
      },
    ]
  };
  msgmetadata?: { name: string; des: string; }[] = [
    {
      name: "채널생성",
      des: "주식명령어를 사용할수있는 채널 생성"
    },
    {
      name: "돈",
      des: "보유금액 확인"
    },
    {
      name: "보유",
      des: "보유중인 주식확인"
    },
    {
      name: "지원금",
      des: "주식 지원금"
    },
    {
      name: "검색 [코스피|코스닥|나스닥] <주식이름>",
      des: "[코스피|코스닥|나스닥] 주식 검색"
    },
    {
      name: "매수 [코스피|코스닥|나스닥] <주식이름> <매수수량>",
      des: "[코스피|코스닥|나스닥] 주식 매수"
    },
    {
      name: "매도 [코스피|코스닥|나스닥] <주식이름> <매도수량>",
      des: "[코스피|코스닥|나스닥] 주식 매도"
    },
    {
      name: "이름검색 [코스피|코스닥|나스닥] <주식이름>",
      des: "[코스피|코스닥|나스닥] 주식 이름검색"
    },
    {
      name: "가격검색 [코스피|코스닥|나스닥] <가격>",
      des: "입력한 가격 아래 [코스피|코스닥|나스닥] 주식검색"
    }
  ];

  /** 실행되는 부분 */
  async slashRun(interaction: CommandInteraction) {
    const cmd = interaction.options.data[0];
    
    if (cmd.name === "도움말") return await interaction.followUp({ embeds: [ this.help() ] });
    
    if (cmd.name === "채널생성") {
      if (!(await ckper(interaction))) return await interaction.followUp({ embeds: [ emper ] });
      return await interaction.followUp({ embeds: [ await this.makeChannel(interaction.guild!) ] });
    }
    
    const channel = interaction.guild!.channels.cache.get((await QDB.guild.get(interaction.guild!)).channelId);
    if (!channel || channel.id !== interaction.channelId) return await interaction.followUp({ embeds: [ client.mkembed({
      title: `** 주식 사용제한 **`,
      description: `주식 명령어는 주식 채널에서만 사용할수있습니다.\n\`${client.prefix}주식 채널생성 , /주식 채널생성\`\n으로 채널을 생성한뒤 사용해주세요.`,
      color: "DarkRed"
    }) ] });
    
    if (cmd.name === "돈") return await interaction.followUp({ embeds: [ await this.money(interaction.guild!, interaction.member as GuildMember) ] });
    
    if (cmd.name === "보유") return await interaction.followUp({ embeds: [ await this.have(interaction.guild!, interaction.member as GuildMember) ] });

    if (cmd.name === "지원금") return await interaction.followUp({ embeds: [ await this.support(interaction.guild!, interaction.member as GuildMember) ] });
    
    if (cmd.name == "검색") {
      const cmd2 = cmd.options![0];
      const data = cmd2.options![0].value as string;
      if (cmd2.name === "코스피") return await interaction.followUp({ embeds: [ await searchStockEmbed(interaction.member as GuildMember, "KOSPI", data) ] });
      if (cmd2.name === "코스닥") return await interaction.followUp({ embeds: [ await searchStockEmbed(interaction.member as GuildMember, "KOSDAQ", data) ] });
      if (cmd2.name === "나스닥") return await interaction.followUp({ embeds: [ await searchStockEmbed(interaction.member as GuildMember, "NASDAQ", data) ] });
      return await interaction.followUp({ embeds: [ client.mkembed({
        title: `** ${cmd2.name} 주식 검색 오류 **`,
        description: `시장 이름을 찾을수 없음`,
        color: "DarkRed"
      }) ] });
    }
    
    if (cmd.name === "이름검색") {
      const cmd2 = cmd.options![0];
      const data = cmd2.options![0].value as string;
      let embedslist: [ EmbedBuilder[][], number, number ] | undefined = undefined;
      if (cmd2.name === "코스피") embedslist = await searchName(interaction.member as GuildMember, "KOSPI", data);
      if (cmd2.name === "코스닥") embedslist = await searchName(interaction.member as GuildMember, "KOSDAQ", data);
      if (cmd2.name === "나스닥") embedslist = await searchName(interaction.member as GuildMember, "NASDAQ", data);
      return await this.searchNext("이름검색", embedslist, interaction, undefined, cmd2.name);
    }
    
    if (cmd.name === "가격검색") {
      const cmd2 = cmd.options![0];
      const data = cmd2.options![0].value as number;
      let embedslist: [ EmbedBuilder[][], number, number ] | undefined = undefined;
      if (cmd2.name === "코스피") embedslist = await searchMoney(interaction.member as GuildMember, "KOSPI", data);
      if (cmd2.name === "코스닥") embedslist = await searchMoney(interaction.member as GuildMember, "KOSDAQ", data);
      if (cmd2.name === "나스닥") embedslist = await searchMoney(interaction.member as GuildMember, "NASDAQ", data);
      return await this.searchNext("가격검색", embedslist, interaction, undefined, cmd2.name);
    }

    if (cmd.name == "매수") {
      const cmd2 = cmd.options![0];
      const data = cmd2.options![0].value as string;
      const split = data.trim().split(/ +/g);
      if (split.length < 2) return await interaction.followUp({ embeds: [ client.mkembed({
        title: `** ${cmd2.name} 주식 매수 오류 **`,
        description: `/주식 매수 ${cmd2.name} <주식이름> <주식수량> <- 주식수량을 찾을수없음`,
        color: "DarkRed"
      }) ], ephemeral: true });
      if (!Number(split[split.length-1]) || Number(split[split.length-1]) < 1) return await interaction.followUp({ embeds: [ client.mkembed({
        title: `** ${cmd2.name} 주식 매수 오류 **`,
        description: `/주식 매수 ${cmd2.name} <주식이름> <주식수량> <- 주식수량은 1이상의 숫자만 입력할수있음`,
        color: "DarkRed"
      }) ], ephemeral: true });
      if (cmd2.name === "코스피") return await interaction.followUp({ embeds: [ await buyStock(interaction.guild!, interaction.member as GuildMember, "KOSPI", split.slice(0,split.length-1).join(" "), Number(split[split.length-1])) ] });
      if (cmd2.name === "코스닥") return await interaction.followUp({ embeds: [ await buyStock(interaction.guild!, interaction.member as GuildMember, "KOSDAQ", split.slice(0,split.length-1).join(" "), Number(split[split.length-1])) ] });
      if (cmd2.name === "나스닥") return await interaction.followUp({ embeds: [ await buyStock(interaction.guild!, interaction.member as GuildMember, "NASDAQ", split.slice(0,split.length-1).join(" "), Number(split[split.length-1])) ] });
      return await interaction.followUp({ embeds: [ client.mkembed({
        title: `** ${cmd2.name} 주식 매수 오류 **`,
        description: `시장 이름을 찾을수 없음`,
        color: "DarkRed"
      }) ] });
    }

    if (cmd.name == "매도") {
      const cmd2 = cmd.options![0];
      const data = cmd2.options![0].value as string;
      const split = data.trim().split(/ +/g);
      if (split.length < 2) return await interaction.followUp({ embeds: [ client.mkembed({
        title: `** ${cmd2.name} 주식 매도 오류 **`,
        description: `/주식 매도 ${cmd2.name} <주식이름> <주식수량> <- 주식수량을 찾을수없음`,
        color: "DarkRed"
      }) ], ephemeral: true });
      if (!Number(split[split.length-1]) || Number(split[split.length-1]) < 1) return await interaction.followUp({ embeds: [ client.mkembed({
        title: `** ${cmd2.name} 주식 매도 오류 **`,
        description: `/주식 매도 ${cmd2.name} <주식이름> <주식수량> <- 주식수량은 1이상의 숫자만 입력할수있음`,
        color: "DarkRed"
      }) ], ephemeral: true });
      if (cmd2.name === "코스피") return await interaction.followUp({ embeds: [ await sellStock(interaction.guild!, interaction.member as GuildMember, "KOSPI", split.slice(0,split.length-1).join(" "), Number(split[split.length-1])) ] });
      if (cmd2.name === "코스닥") return await interaction.followUp({ embeds: [ await sellStock(interaction.guild!, interaction.member as GuildMember, "KOSDAQ", split.slice(0,split.length-1).join(" "), Number(split[split.length-1])) ] });
      if (cmd2.name === "나스닥") return await interaction.followUp({ embeds: [ await sellStock(interaction.guild!, interaction.member as GuildMember, "NASDAQ", split.slice(0,split.length-1).join(" "), Number(split[split.length-1])) ] });
      return await interaction.followUp({ embeds: [ client.mkembed({
        title: `** ${cmd2.name} 주식 매도 오류 **`,
        description: `시장 이름을 찾을수 없음`,
        color: "DarkRed"
      }) ] });
    }

    return await interaction.followUp({ embeds: [ this.help() ] });
  }
  
  async messageRun(message: Message, args: string[]) {
    if (args[0] === "도움말") return message.channel.send({ embeds: [ this.help() ] }).then(m => client.msgdelete(m, 6));
    
    if (args[0] === "채널생성") {
      if (!(await ckper(message))) return message.channel.send({ embeds: [ emper ] }).then(m => client.msgdelete(m, 1));
      return message.channel.send({ embeds: [ await this.makeChannel(message.guild!) ] }).then(m => client.msgdelete(m, 4));
    }
    
    const channel = message.guild!.channels.cache.get((await QDB.guild.get(message.guild!)).channelId);
    if (!channel || channel.id !== message.channelId) return await message.channel.send({ embeds: [ client.mkembed({
      author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
      title: `** 주식 사용제한 **`,
      description: `주식 명령어는 주식 채널에서만 사용할수있습니다.\n\`${client.prefix}주식 채널생성 | /주식 채널생성\`\n으로 채널을 생성한뒤 사용해주세요.`,
      color: "DarkRed"
    }) ] }).then(m => client.msgdelete(m, 1));
    
    if (args[0] === "주기") {
      if (!(await ckper(message))) return message.channel.send({ embeds: [ emper ] }).then(m => client.msgdelete(m, 1));
      if (!args[1] || !(args[1].startsWith("<") && args[1].endsWith(">")) || !args[2] || !Number(args[2]) || Number(args[2]) < 1) return message.channel.send({ content: `${client.prefix}주식 주기 @유저 금액` }).then(m => client.msgdelete(m, 1));
      const member = message.guild?.members.cache.get(args[1].replace(/\<|\>|\!|\@/g,"").trim());
      if (!member) return message.channel.send({ content: `${client.prefix}주식 주기 @유저 금액` }).then(m => client.msgdelete(m, 1));
      const UDB = await QDB.user.get(message.guild!, member);
      const check = await QDB.user.set(message.guild!.id, member.id, { money: UDB.money + Number(args[2]) });
      if (!check) return message.channel.send({ content: `주식 주기 오류발생` }).then(m => client.msgdelete(m, 1));
      return message.channel.send({ content: `${member.nickname ? member.nickname : member.user.username} 주식 주기 성공` }).then(m => client.msgdelete(m, 1));
    }

    if (args[0] === "빼기") {
      if (!(await ckper(message))) return message.channel.send({ embeds: [ emper ] }).then(m => client.msgdelete(m, 1));
      if (!args[1] || !(args[1].startsWith("<") && args[1].endsWith(">")) || !args[2] || !Number(args[2]) || Number(args[2]) < 1) return message.channel.send({ content: `${client.prefix}주식 빼기 @유저 금액` }).then(m => client.msgdelete(m, 1));
      const member = message.guild?.members.cache.get(args[1].replace(/\<|\>|\!|\@/g,"").trim());
      if (!member) return message.channel.send({ content: `${client.prefix}주식 빼기 @유저 금액` }).then(m => client.msgdelete(m, 1));
      const UDB = await QDB.user.get(message.guild!, member);
      if (Number(args[2]) > UDB.money) return message.channel.send({ content: `보유금액 부족` }).then(m => client.msgdelete(m, 1));
      const check = await QDB.user.set(message.guild!.id, member.id, { money: UDB.money - Number(args[2]) });
      if (!check) return message.channel.send({ content: `주식 빼기 오류발생` }).then(m => client.msgdelete(m, 1));
      return message.channel.send({ content: `${member.nickname ? member.nickname : member.user.username} 주식 빼기 성공` }).then(m => client.msgdelete(m, 1));
    }

    if (args[0] === "설정") {
      if (!(await ckper(message))) return message.channel.send({ embeds: [ emper ] }).then(m => client.msgdelete(m, 1));
      if (!args[1] || !(args[1].startsWith("<") && args[1].endsWith(">")) || !args[2] || !Number(args[2]) || Number(args[2]) < 1) return message.channel.send({ content: `${client.prefix}주식 설정 @유저 금액` }).then(m => client.msgdelete(m, 1));
      const member = message.guild?.members.cache.get(args[1].replace(/\<|\>|\!|\@/g,"").trim());
      if (!member) return message.channel.send({ content: `${client.prefix}주식 설정 @유저 금액` }).then(m => client.msgdelete(m, 1));
      const check = await QDB.user.set(message.guild!.id, member.id, { money: Number(args[2]) });
      if (!check) return message.channel.send({ content: `주식 설정 오류발생` }).then(m => client.msgdelete(m, 1));
      return message.channel.send({ content: `${member.nickname ? member.nickname : member.user.username} 주식 설정 성공` }).then(m => client.msgdelete(m, 1));
    }

    if (args[0] === "돈") return message.channel.send({ embeds: [ await this.money(message.guild!, message.member!) ] });
    
    if (args[0] === "보유") return await message.channel.send({ embeds: [ await this.have(message.guild!, message.member!) ] });

    if (args[0] === "지원금") return message.channel.send({ embeds: [ await this.support(message.guild!, message.member!) ] });
    
    if (args[0] === "검색") {
      if (!args[1]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** 주식 검색 오류 **`,
        description: `${client.prefix}주식 검색 <시장이름> <주식이름> <- 시장이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (!args[2]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 검색 오류 **`,
        description: `${client.prefix}주식 검색 <시장이름> <주식이름> <- 주식이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));

      const name = args.slice(2).join(" ").trim();
      if (args[1] === "코스피") return message.channel.send({ embeds: [ await searchStockEmbed(message.member!, "KOSPI", name) ] });
      if (args[1] === "코스닥") return message.channel.send({ embeds: [ await searchStockEmbed(message.member!, "KOSDAQ", name) ] });
      if (args[1] === "나스닥") return message.channel.send({ embeds: [ await searchStockEmbed(message.member!, "NASDAQ", name) ] });
      return message.channel.send({ embeds: [ client.mkembed({
        title: `** ${args[1]} 주식 검색 오류 **`,
        description: `시장이름을 찾을수 없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
    }
    
    if (args[0] === "이름검색") {
      if (!args[1]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** 주식 이름검색 오류 **`,
        description: `${client.prefix}주식 이름검색 <시장이름> <주식이름> <- 시장이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (!args[2]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 이름검색 오류 **`,
        description: `${client.prefix}주식 이름검색 <시장이름> <주식이름> <- 주식이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));

      const name = args.slice(2).join(" ").trim();
      let embedslist: [ EmbedBuilder[][], number, number ] | undefined = undefined;
      if (args[1] === "코스피") embedslist = await searchName(message.member as GuildMember, "KOSPI", name);
      if (args[1] === "코스닥") embedslist = await searchName(message.member as GuildMember, "KOSDAQ", name);
      if (args[1] === "나스닥") embedslist = await searchName(message.member as GuildMember, "NASDAQ", name);
      return await this.searchNext("이름검색", embedslist, undefined, message, args[1]);
    }
    
    if (args[0] === "가격검색") {
      if (!args[1]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** 주식 가격검색 오류 **`,
        description: `${client.prefix}주식 이름검색 <시장이름> <주식최대가격> <- 시장이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (!args[2]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 가격검색 오류 **`,
        description: `${client.prefix}주식 이름검색 <시장이름> <주식최대가격> <- 주식최대가격을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (!Number(args[2])) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 가격검색 오류 **`,
        description: `${client.prefix}주식 이름검색 <시장이름> <주식최대가격> <- 주식최대가격에는 숫자를 입력해야됨`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (Number(args[2]) < 0) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 가격검색 오류 **`,
        description: `${client.prefix}주식 이름검색 <시장이름> <주식최대가격> <- 주식최대가격에는 0보다 큰숫자를 입력해야됨`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));

      const num = Number(args[2]);
      let embedslist: [ EmbedBuilder[][], number, number ] | undefined = undefined;
      if (args[1] === "코스피") embedslist = await searchMoney(message.member as GuildMember, "KOSPI", num);
      if (args[1] === "코스닥") embedslist = await searchMoney(message.member as GuildMember, "KOSDAQ", num);
      if (args[1] === "나스닥") embedslist = await searchMoney(message.member as GuildMember, "NASDAQ", num);
      return await this.searchNext("이름검색", embedslist, undefined, message, args[1]);
    }

    if (args[0] === "매수") {
      if (!args[1]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** 주식 매수 오류 **`,
        description: `${client.prefix}주식 매수 <시장이름> <주식이름> <주식수량> <- 시장이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (!args[2]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 매수 오류 **`,
        description: `${client.prefix}주식 매수 <시장이름> <주식이름> <주식수량> <- 주식이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (args.length < 4) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 매수 오류 **`,
        description: `${client.prefix}주식 매수 <시장이름> <주식이름> <주식수량> <- 주식수량을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (!Number(args[args.length-1]) || Number(args[args.length-1]) < 1) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 매수 오류 **`,
        description: `${client.prefix}주식 매수 <시장이름> <주식이름> <주식수량> <- 주식수량은 1이상의 숫자만 입력할수있음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));

      const name = args.slice(2, args.length-1).join(" ").trim();
      const count = Number(args[args.length-1]);
      if (args[1] === "코스피") return message.channel.send({ embeds: [ await buyStock(message.guild!, message.member!, "KOSPI", name, count) ] });
      if (args[1] === "코스닥") return message.channel.send({ embeds: [ await buyStock(message.guild!, message.member!, "KOSDAQ", name, count) ] });
      if (args[1] === "나스닥") return message.channel.send({ embeds: [ await buyStock(message.guild!, message.member!, "NASDAQ", name, count) ] });
      return message.channel.send({ embeds: [ client.mkembed({
        title: `** ${args[1]} 주식 매수 오류 **`,
        description: `시장이름을 찾을수 없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
    }

    if (args[0] === "매도") {
      if (!args[1]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** 주식 매도 오류 **`,
        description: `${client.prefix}주식 매도 <시장이름> <주식이름> <주식수량> <- 시장이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (!args[2]) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 매도 오류 **`,
        description: `${client.prefix}주식 매도 <시장이름> <주식이름> <주식수량> <- 주식이름을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (args.length < 4) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 매도 오류 **`,
        description: `${client.prefix}주식 매도 <시장이름> <주식이름> <주식수량> <- 주식수량을 찾을수없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      if (!Number(args[args.length-1]) || Number(args[args.length-1]) < 1) return message.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${args[1]} 주식 매도 오류 **`,
        description: `${client.prefix}주식 매도 <시장이름> <주식이름> <주식수량> <- 주식수량은 1이상의 숫자만 입력할수있음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));

      const name = args.slice(2, args.length-1).join(" ").trim();
      const count = Number(args[args.length-1]);
      if (args[1] === "코스피") return message.channel.send({ embeds: [ await sellStock(message.guild!, message.member!, "KOSPI", name, count) ] });
      if (args[1] === "코스닥") return message.channel.send({ embeds: [ await sellStock(message.guild!, message.member!, "KOSDAQ", name, count) ] });
      if (args[1] === "나스닥") return message.channel.send({ embeds: [ await sellStock(message.guild!, message.member!, "NASDAQ", name, count) ] });
      return message.channel.send({ embeds: [ client.mkembed({
        title: `** ${args[1]} 주식 매수 오류 **`,
        description: `시장이름을 찾을수 없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
    }

    return message.channel.send({ embeds: [ this.help() ] });
  }

  help(): EmbedBuilder {
    return client.help(this.metadata.name, this.metadata, this.msgmetadata)!;
  }

  async money(guild: Guild, member: GuildMember) {
    const UDB = await QDB.user.get(guild, member);
    return client.mkembed({
      author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
      title: `** 주식 보유금액 **`,
      description: `${UDB.money.toLocaleString("ko-KR")}원`
    });
  }

  async have(guild: Guild, member: GuildMember) {
    const UDB = await QDB.user.get(guild, member);
    let text = "【시장】[종목] (현재가) <보유수량>〔손익〕｛투자금액｝「예상수익률」\n";
    if (UDB.stocks.length == 0) return client.mkembed({
      author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
      title: `** ${member.nickname ? member.nickname : member.user.username} 님의 보유주식 **`,
      description: `없음`
    });
    for (let i=0; i<UDB.stocks.length; i++) {
      let stock = UDB.stocks[i];
      let [ nowStockPrice, nowStockPriceErrMsg ] = await getStock(stock.market, stock.code);
      let marketname = stock.market == "KOSPI" ? "코스피"
        : stock.market == "KOSDAQ" ? "코스닥"
        : "나스닥";
      if (!nowStockPrice) {
        text += `\n【${marketname}】[${stock.name}] ${nowStockPriceErrMsg}`;
      } else {
        let nowPrice = Number(nowStockPrice?.replace(/\,/g,""));
        let pross = nowPrice - stock.price;
        text += `\n【${
          marketname
        }】[${
          stock.name
        }] (${
          nowStockPrice
        }원) <${
          stock.count
        }주>〔${
          pross
        }원〕｛${
          (stock.price * stock.count).toLocaleString("ko-KR")
        }원｝「${
          (nowPrice / stock.price) * 100 - 100
        }」`;
      }
    }
    return client.mkembed({
      author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
      title: `** ${member.nickname ? member.nickname : member.user.username} 님의 보유주식 **`,
      description: text
    });
  }

  async support(guild: Guild, member: GuildMember): Promise<EmbedBuilder> {
    const UDB = await QDB.user.get(guild, member);
    const support_money = 5000000;
    if (UDB.support.money) return client.mkembed({
      author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
      title: `** 주식 지원금 **`,
      description: `주식 지원금을 이미 받으셨습니다.\n받은시간 : <t:${Math.round(UDB.support.time/1000)}:F> (<t:${Math.round(UDB.support.time/1000)}:R>)`,
      color: "Red"
    });
    const check = await QDB.user.set(guild.id, member.id, { support: { money: true, time: Date.now() }, money: UDB.money + support_money });
    if (check) return client.mkembed({
      author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
      title: `** 주식 지원금 **`,
      description: `주식 지원금 ${support_money.toLocaleString("ko-KR")}원 지급`
    });
    return client.mkembed({
      author: { name: member.nickname || member.user.username, iconURL: member.displayAvatarURL({ forceStatic: false }) },
      title: `** 주식 지원금 오류 **`,
      description: `지원금 지급도중 오류발생`,
      color: "DarkRed"
    });
  }

  async searchNext(searchname: string, embedslist: [ EmbedBuilder[][], number, number ] | undefined, interaction: CommandInteraction | undefined, message: Message | undefined, market: string) {
    if (!embedslist) {
      await interaction?.followUp({ embeds: [ client.mkembed({
        title: `** ${market} 주식 ${searchname}검색 오류 **`,
        description: `시장이름을 찾을수 없음`,
        color: "DarkRed"
      }) ] });
      message?.channel.send({ embeds: [ client.mkembed({
        author: { name: message.member!.nickname || message.member!.user.username, iconURL: message.member!.displayAvatarURL({ forceStatic: false }) },
        title: `** ${market} 주식 ${searchname}검색 오류 **`,
        description: `시장이름을 찾을수 없음`,
        color: "DarkRed"
      }) ] }).then(m => client.msgdelete(m, 1));
      return;
    }
    if (embedslist[1] > maxEmbedNumber) {
      let leftembed = maxEmbedNumber;
      for (let i=0; i<embedslist[0].length; i++) {
        for (let j=0; j<embedslist[0][i].length; j++) {
          const footer = embedslist[0][i][j].data.footer?.text;
          if (footer) {
            let changefooter = footer.split("/")[0] || undefined;
            embedslist[0][i][j].setFooter({ text: `${changefooter ? `${changefooter}/${maxEmbedNumber}` : `총 ${maxEmbedNumber}개`}` });
          }
        }
        if (embedslist[0][i].length < leftembed) {
          leftembed -= embedslist[0][i].length;
          await interaction?.followUp({ embeds: embedslist[0][i], ephemeral: true });
          message?.channel.send({ embeds: embedslist[0][i] });
        } else {
          const text = embedslist[0][i][leftembed-1].data.description;
          if (text) {
            let textsplit = text.split("\n");
            let lastnum = Number(textsplit[textsplit.length-2]?.slice(0,3) || "0");
            embedslist[0][i][leftembed-1].setDescription(`${text}\n+ ${embedslist[2]-lastnum}개`);
          }
          await interaction?.followUp({ embeds: embedslist[0][i].slice(0,leftembed), ephemeral: true });
          message?.channel.send({ embeds: embedslist[0][i].slice(0,leftembed) });
          break;
        }
      }
      return;
    }
    for (let i=0; i<embedslist[0].length; i++) {
      await interaction?.followUp({ embeds: embedslist[0][i], ephemeral: true });
      message?.channel.send({ embeds: embedslist[0][i] });
    }
    return;
  }

  async makeChannel(guild: Guild): Promise<EmbedBuilder> {
    const GDB = await QDB.guild.get(guild);
    const checkchannel = guild.channels.cache.get(GDB.channelId);
    if (checkchannel) checkchannel.delete().catch(() => {});
    const channel = await guild.channels.create({
      type: ChannelType.GuildText,
      name: "📈ㅣ주식",
      topic: `${client.prefix}주식 도움말 , /주식 도움말`
    }).catch(() => {
      return undefined;
    });
    if (!channel) return client.mkembed({
      title: `** 주식 채널 생성 오류 **`,
      description: `주식 채널 생성중 오류발생`,
      color: "DarkRed"
    });
    channel.send({ embeds: [ client.mkembed({
      title: `** 주식채널입니다. **`,
      description: `${client.prefix}주식 도움말 , /주식 도움말`
    }) ] });
    QDB.guild.set(guild.id, { channelId: channel.id });
    return client.mkembed({
      title: `** 주식 채널 생성 **`,
      description: `<#${channel.id}> 채널 생성 완료`
    });
  }
}