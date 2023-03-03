# ChatGPT Telegram Bot

![badge:version](https://img.shields.io/badge/version-2.3.0-brightgreen)
![license](https://img.shields.io/badge/license-MIT-green)

A ChatGPT bot for Telegram based on Node.js. Support both browserless and browser-based APIs.

## Updates

<strong>🎉 v2 has been released!</strong>

<details open>
  <summary><b>🔔 Mar. 02, 2023 (v2.3.0)</b></summary>

  > - Support the [official OpenAI chat completions API](https://platform.openai.com/docs/guides/chat).
  > - Support proxy by using a custom fetch function.

  We strongly advice you to use the `official` API. There are rumors that OpenAI may ban your account if you continue to use the `unofficial` API.
</details>

<details open>
  <summary><b>🔔 Feb. 28, 2023 (v2.2.0)</b></summary>

  > - Support message queue to avoid rate limit.
  > - Improve Markdown parsing.
</details>

<details>
<summary><strong>Previous Updates</strong></summary>

<details>
  <summary><b>🔔 Feb. 22, 2023 (v2.1.1)</b></summary>

  > - Support custom prompt prefix and suffix (allowing you to customize the bot's identity and behavior).
  > - Support Node.js v19.
</details>

<details>
  <summary><b>🔔 Feb. 19, 2023 (v2.1.0)</b></summary>

  > We have added support for the unofficial proxy API by @acheong08. This API uses a proxy server that allows users to bypass Cloudflare protection and use the real ChatGPT. Please see [Usage](#usage) for more details.
  >
  > For previous users, we've updated our API options. `api.version` is now `api.type`, with options `browser` (previously `v3`), `official` (previously `v4`), and `unofficial`. Please update your config file accordingly.
</details>

<details>
  <summary><b>🔔 Feb. 17, 2023</b></summary>

  > According to [one of the maintainers](https://github.com/waylaidwanderer/node-chatgpt-api#updates) of the reverse proxy servers, OpenAI has patched this method. So you have to either use the browserless Official API with official models (which costs money), or use the browser-based solution.
</details>

<details>
  <summary><b>🔔 Feb. 15, 2023</b></summary>

  > We have release the v2.0.0 of this bot, which supports both [browserless](https://github.com/transitive-bullshit/chatgpt-api) and [browser-based](https://github.com/transitive-bullshit/chatgpt-api/tree/v3) APIs. You can switch between the two APIs at any time using the config file. Additionally, we have refactored the codebase to make it more maintainable and easier to extend.
  >
  > For old users, you will need to switch from the `.env` file to json files under the `config/` folder.
</details>

</details>

## Features

<table>
  <tr>
    <th>Private Chat</th>
    <th>Group Chat</th>
  </tr>
  <tr>
    <td><img src="./assets/private_chat.jpg" /></td>
    <td><img src="./assets/group_chat.jpg" /></td>
  </tr>
</table>

- Support for both browserless (official, unofficial) and browser-based APIs
- Support for both private and group chats
- Work in privacy mode (the bot can only see specific messages)
- Bot access control based on user and group IDs
- Reset chat thread and refresh session with command
- Queue messages to avoid rate limit
- Typing indicator, Markdown formatting, ...
- Cloudflare bypassing and CAPTCHA automation (for the browser-based API)
- Customize bot identity and behavior (see https://github.com/RainEggplant/chatgpt-telegram-bot/issues/11)
- User-friendly logging

## Usage

### Differences between the three types of APIs

> Thank @transitive-bullshit for making this easy-to-understand table!

| Type         | Free?  | Robust?  | Quality?                |
| -------------| ------ | -------- | ----------------------- |
| `official`   | ❌ No  | ✅ Yes   | ✅ Real ChatGPT models |
| `unofficial` | ✅ Yes | ☑️ Maybe | ✅ Real ChatGPT         |
| `browser`    | ✅ Yes | ❌ No    | ✅ Real ChatGPT         |

- `official`: Uses the `gpt-3.5-turbo` model with the official OpenAI chat completions API (official, robust approach, but it's not free)
- `unofficial`: Uses an unofficial proxy server to access ChatGPT's backend API in a way that circumvents Cloudflare (uses the real ChatGPT and is pretty lightweight, but relies on a third-party server and is rate-limited)
- `browser` (not recommended): Uses Puppeteer to access the official ChatGPT webapp (uses the real ChatGPT, but very flaky, heavyweight, and error prone)

### Start the server

To get started, follow these steps:

1. Create `local.json` under the `config/` folder. You can copy the `config/default.json` as a template.
2. Modify the `local.json` following the instructions in the file. The settings in `local.json` will override the default settings in `default.json`.
  - Set `api.type` to `browser` if you want to use the browser-based API. Then provide the OpenAI / Google / Microsoft credentials and other settings. You can refer to [this](https://github.com/transitive-bullshit/chatgpt-api/tree/v3#authentication) and [this](https://github.com/transitive-bullshit/chatgpt-api/blob/v3/docs/classes/ChatGPTAPIBrowser.md#parameters) for more details. Make sure you have a Chromium-based browser installed.
  - Set `api.type` to `official` if you want to use the browserless official API. Then provide your [OpenAI API Key](https://platform.openai.com/overview) and other settings. You can refer to [this](https://github.com/transitive-bullshit/chatgpt-api#usage---chatgptapi) for more details.
    > **Warning**
    >
    > Using the browserless API may result in charges based on the model you use, as defined in the `api.official.completionParams` (the default value depends on the version of your `chatgpt` node module). Get more details about this from [the issue section](https://github.com/transitive-bullshit/chatgpt-api/issues) of the API repository.
    >
    > ~~Alternatively, if you prefer to avoid charges, you can utilize the community reverse proxy servers that mimic OpenAI's completions API. Please refer to [this](https://github.com/transitive-bullshit/chatgpt-api/blob/main/demos/demo-reverse-proxy.ts) and [this](https://github.com/waylaidwanderer/node-chatgpt-api#using-a-reverse-proxy) for more details.~~ (This method has been patched by OpenAI. You can use the unofficial API instead.)
  - Set `api.type` to `unofficial` if you want to use the browserless unofficial API. Then provide your OpenAI access token ([how to get your access token?](https://github.com/transitive-bullshit/chatgpt-api#access-token)) and other settings. You can refer to [this](https://github.com/transitive-bullshit/chatgpt-api#usage---chatgptunofficialproxyapi) for more details.

Then you can start the bot with:

```shell
pnpm install
pnpm build && pnpm start
```

### Chat with the bot in Telegram

To chat with the bot in Telegram, you can:

- Send direct messages to the bot (this is not supported in groups)
- Send messages that start with the specified command (e.g., `/chat` or the command you specified in the json config file)
- Reply to the bot's last message

> **Note** Make sure you have enabled the privacy mode of your bot before adding it to a group, or it will reply to every message in the group.

The bot also has several commands.

- `/help`: Show help information.
- `/reset`: Reset the current chat thread and start a new one.
- `/reload` (admin required): Refresh the ChatGPT session.

> **Note** When using a command in a group, make sure to include a mention after the command, like `/help@chatgpt_bot`.


## Advanced

### Running the bot on a headless server (browser-based API)

You can use [Xvfb](https://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml) to create a virtual framebuffer on a headless server and run this program:

```shell
xvfb-run -a --server-args="-screen 0 1280x800x24 -nolisten tcp -dpi 96 +extension RANDR" pnpm start
```

We recommend you to use Google auth to avoid the complicated login Recaptchas. If you use a OpenAI account, you may have to use nopecha or 2captcha or manually solve the Recaptcha (by connecting to the display server using x11vnc). For more details about CAPTCHA solving, please refer to [the api repository](https://github.com/transitive-bullshit/chatgpt-api/tree/v3#captchas).

#### Docker

You can also try this docker image by running the following command from the project root folder:

```shell
docker compose up
```

## Credits

- [ChatGPT API](https://github.com/transitive-bullshit/chatgpt-api): Node.js client for the unofficial ChatGPT API.
- [ChatGPT](https://github.com/acheong08/ChatGPT): Reverse engineered ChatGPT API 
- [Node.js Telegram Bot API](https://github.com/yagop/node-telegram-bot-api): Telegram Bot API for NodeJS.
- [🤖️ chatbot-telegram](https://github.com/Ciyou/chatbot-telegram): Yet another telegram ChatGPT bot.

## LICENSE

[MIT License](LICENSE).

**Leave a star ⭐ if you find this project useful.**
