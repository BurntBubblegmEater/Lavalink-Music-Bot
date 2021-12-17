import { Client, IntentsString, Options } from "discord.js-light";
import { BotConfig } from "../utils/client-interface";
import { LavasfyClient } from "lavasfy";
import { Manager } from "erela.js";
import Register from "../class/Register";
import { ICache } from "../utils/lavalink-interface";
import Lavalink from "../class/Lavalink";

declare module "discord.js-light" {
    interface Client {
        config: BotConfig;
        register: Register;
        lavasfy: LavasfyClient;
        manager: Manager;
        cache: Map<string, ICache>;
        erela: Lavalink;
    }
}

export default class DiscordClient extends Client {
    constructor(intents: IntentsString[]) {
        super({ intents, makeCache: Options.cacheWithLimits({
            ApplicationCommandManager: Infinity, // guild.commands
            BaseGuildEmojiManager: Infinity, // guild.emojis
            ChannelManager: Infinity, // client.channels
            GuildChannelManager: Infinity, // guild.channels
            GuildBanManager: Infinity, // guild.bans
            GuildInviteManager: Infinity, // guild.invites
            GuildManager: Infinity, // client.guilds
            GuildMemberManager: Infinity, // guild.members
            GuildStickerManager: Infinity, // guild.stickers
            MessageManager: Infinity, // channel.messages
            PermissionOverwriteManager: Infinity, // channel.permissionOverwrites
            PresenceManager: Infinity, // guild.presences
            ReactionManager: Infinity, // message.reactions
            ReactionUserManager: Infinity, // reaction.users
            RoleManager: Infinity, // guild.roles
            StageInstanceManager: Infinity, // guild.stageInstances
            ThreadManager: Infinity, // channel.threads
            ThreadMemberManager: Infinity, // threadchannel.members
            UserManager: Infinity, // client.users
            VoiceStateManager: Infinity // guild.voiceStates
        }) });

        this.config = {
            token: process.env.TOKEN as string,
            prefix: process.env.PREFIX as string,
            developers: JSON.parse(process.env.DEVELOPERS as string),
            unknownErrorMessage: false
        };
        this.erela = new Lavalink(this);
        this.erela.connect();
        this.register = new Register(this);
        this.register.registerAll();
        this.cache = new Map();
    }

    public async start(): Promise<void> {
        await this.login(this.config.token);
    }
}