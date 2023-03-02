import type TelegramBot from 'node-telegram-bot-api';
import type {ChatGPT} from '../api';
import {BotOptions} from '../types';
import {logWithTime} from '../utils';
import fs from 'fs';

class CommandHandler {
  debug: number;
  protected _opts: BotOptions;
  protected _bot: TelegramBot;
  protected _api: ChatGPT;

  constructor(bot: TelegramBot, api: ChatGPT, botOpts: BotOptions, debug = 1) {
    this.debug = debug;
    this._bot = bot;
    this._api = api;
    this._opts = botOpts;
  }

  handle = async (
    msg: TelegramBot.Message,
    command: string,
    isMentioned: boolean,
    botUsername: string
  ) => {
    const userInfo = `@${msg.from?.username ?? ''} (${msg.from?.id})`;
    const chatInfo =
      msg.chat.type == 'private'
        ? 'private chat'
        : `group ${msg.chat.title} (${msg.chat.id})`;
    if (this.debug >= 1) {
      logWithTime(
        `👨‍💻️ User ${userInfo} issued command "${command}" in ${chatInfo} (isMentioned=${isMentioned}).`
      );
    }

    // Ignore commands without mention in groups.
    if (msg.chat.type != 'private' && !isMentioned) return;

    switch (command) {
      case '/start':
        // Check if user has started the bot before
        const userId = msg.from?.id.toString();
        const userFile = 'user.txt';
        const existingUsers = fs.existsSync(userFile)
          ? fs.readFileSync(userFile, 'utf-8').split('\n')
          : [];
        if (!existingUsers.includes(userId ?? '') && msg.chat.type === 'private') {
          const firstName = msg.from?.first_name ?? '';
          const lastName = msg.from?.last_name ?? '';
          const username = msg.from?.username;
          let message = '';
          if (firstName && lastName && username) {
            message = `📳 <a href="https://t.me/${username}">${firstName} ${lastName}</a> just started me.`;
          } else if (firstName && username ) {
            message = `📳 <a href="https://t.me/${username}">${firstName}</a> just started me.`;
          } else if (firstName && lastName) {
            message = `📳 ${firstName} ${lastName} just started me.`;
          } else if (firstName) {
            message = `📳 ${firstName} just started me.`;
          } else {
            message = `📳 A new user just started me.`;
          }
          await this._bot.sendMessage('134802504', message, { parse_mode: 'HTML', disable_web_page_preview: true });
          // Add user ID to user.txt file
          fs.appendFileSync(userFile, `${userId}\n`);
        }
        const inlineKeyboard = {
          inline_keyboard: [
            [
              {
                text: 'Owner',
                url: 'https://t.me/adammau2'
              },
              {
                text: '🤖 Collection',
                url: 'https://t.me/khampret_collection'
              }
            ]
          ]
        };
        await this._bot.sendMessage(
          msg.chat.id,
          'I am ChatGPT, a smart bot ready to assist you with various questions and information.\n' +
          'Just ask your questions and I will do my best to provide quick and accurate answers.',
          {
            reply_markup: inlineKeyboard
          }
        );
        break;        

      case '/help':
        await this._bot.sendMessage(
          msg.chat.id,
          'To chat with me, you can:\n' +
            '  • send messages directly (not supported in groups)\n' +
            `  • send messages that start with ${this._opts.chatCmd}\n` +
            '  • reply to my last message\n\n' +
            'Command list:\n' +
            `(When using a command in a group, make sure to include a mention after the command, like /help@${botUsername}).\n` +
            '  • /help Show help information.\n' +
            '  • /reset Reset the current chat thread and start a new one.\n' +
            '  • /reload (admin required) Refresh the ChatGPT session.'
        );
        break;

      case '/reset':
        await this._bot.sendChatAction(msg.chat.id, 'typing');
        await this._api.resetThread();
        await this._bot.sendMessage(
          msg.chat.id,
          '🔄 The chat thread has been reset. New chat thread started.'
        );
        logWithTime(`🔄 Chat thread reset by ${userInfo}.`);
        break;

      case '/reload':
        if (msg.from?.id !== 134802504) {
        //if (this._opts.userIds.indexOf(msg.from?.id ?? 0) == -1) {
          await this._bot.sendMessage(
            msg.chat.id,
            '⛔️ Sorry, you do not have the permission to run this command.'
          );
          logWithTime(
            `⚠️ Permission denied for "${command}" from ${userInfo}.`
          );
        } else {
          await this._bot.sendChatAction(msg.chat.id, 'typing');
          await this._api.refreshSession();
          await this._bot.sendMessage(msg.chat.id, '🔄 Session refreshed.');
          logWithTime(`🔄 Session refreshed by ${userInfo}.`);
        }
        break;

      default:
        await this._bot.sendMessage(
          msg.chat.id,
          '⚠️ Unsupported command. Run /help to see the usage.'
        );
        break;
    }
  };
}

export {CommandHandler};
