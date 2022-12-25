import { BotClient } from "./classes/BotClient";
import { SlashHandler } from "./classes/Handler";
import { onInteractionCreate } from "./events/onInteractionCreate";
import { onMessageCreate } from "./events/onMessageCreate";
// import { onmessageReactionAdd } from "./events/onmessageReactionAdd";

export const client = new BotClient();
export const handler = new SlashHandler();

import { onReady } from "./events/onReady";

client.onEvent("ready", onReady);
client.onEvent("interactionCreate", onInteractionCreate);
client.onEvent("messageCreate", onMessageCreate);
// client.onEvent("messageReactionAdd", onmessageReactionAdd);

import "./stock/stockData";