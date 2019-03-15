import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import * as Discord from 'discord.js';

import { Logger } from '../logger';

@Singleton
@AutoWired
export class DiscordManager {

  @Inject private logger: Logger;

  private discord: Discord.Client;
  private discordGuild: Discord.Guild;
  private discordChannel: Discord.GuildChannel;

  public async init() {
    if(!process.env.DISCORD_SECRET) return false;

    this.discord = new Discord.Client();
    await this.discord.login(process.env.DISCORD_SECRET);
    this.discordGuild = this.discord.guilds.get(process.env.DISCORD_GUILD);
    this.discordChannel = <Discord.GuildChannel>this.discord.channels.get(process.env.DISCORD_CHANNEL);

    this.discord.on('error', (error) => {
      this.logger.error(error);
    });
  }

  public updateUserCount(userCount: number): void {
    if(!this.discordChannel) return;

    this.discordChannel.setTopic(`${userCount} player(s) in game`);
  }

  // INCOMING message format
  //     this.channel.send(`<web:${msgData.playerName} [${msgData.guildTag || 'no guild'}] [${msgData.title || 'no title'}] [${msgData.ascensionLevel}~${msgData.level}]> ${msgData.text}`);

}
