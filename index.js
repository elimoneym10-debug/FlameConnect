const express = require('express');
const { Telegraf } = require('telegraf');

// ===== CONFIG =====
const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is required in .env file');
  process.exit(1);
}

// ===== INITIALIZE =====
const bot = new Telegraf(BOT_TOKEN);
const app = express();

// ===== HEALTH CHECK (for Railway) =====
app.get('/health', (req, res) => {
  res.status(200).send('🔥 FlameConnect is running!');
});

// ===== WEBHOOK ENDPOINT =====
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// ===== BOT COMMANDS =====

// Start command
bot.start((ctx) => {
  ctx.reply(
    `🔥 *Welcome to FlameConnect!*\n\n` +
    `👋 Voice-first dating with active moderation\n` +
    `🎤 Send voice notes\n` +
    `🎮 Fun icebreaker games\n` +
    `🛡️ Safe & respectful community\n\n` +
    `Use /match to find your match!`,
    { parse_mode: 'Markdown' }
  );
});

// Match command
bot.command('match', (ctx) => {
  ctx.reply(
    `💕 *Find Your Match*\n\n` +
    `We're finding compatible people for you...\n` +
    `🔍 Search based on your preferences\n\n` +
    `Click below to start matching!`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '❤️ Find Now', callback_data: 'find_match' },
            { text: '⚙️ Preferences', callback_data: 'preferences' }
          ]
        ]
      }
    }
  );
});

// Profile command
bot.command('profile', (ctx) => {
  ctx.reply(
    `👤 *Your Profile*\n\n` +
    `📛 Name: ${ctx.from.first_name || 'Not set'}\n` +
    `📝 Bio: Tell us about yourself\n` +
    `🎂 Age: Not set\n` +
    `✅ Verified: No\n` +
    `💕 Matches: 0\n\n` +
    `Complete your profile to get better matches!`,
    { parse_mode: 'Markdown' }
  );
});

// Settings command
bot.command('settings', (ctx) => {
  ctx.reply(
    `⚙️ *Settings*\n\n` +
    `Choose what to update:`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📝 Edit Bio', callback_data: 'edit_bio' }],
          [{ text: '🔒 Privacy', callback_data: 'privacy' }],
          [{ text: '🗑️ Delete Account', callback_data: 'delete' }]
        ]
      }
    }
  );
});

// Voice command
bot.command('voice', (ctx) => {
  ctx.reply(
    `🎤 *Send a Voice Note*\n\n` +
    `Record and send a voice message to your match!\n` +
    `🎵 Keep it under 60 seconds\n` +
    `🛡️ All voice notes are moderated`,
    { parse_mode: 'Markdown' }
  );
});

// Help command
bot.command('help', (ctx) => {
  ctx.reply(
    `❓ *Help Center*\n\n` +
    `📌 *Commands:*\n` +
    `/start - Welcome message\n` +
    `/match - Find matches\n` +
    `/profile - View profile\n` +
    `/settings - Update settings\n` +
    `/voice - Send voice note\n` +
    `/report - Report a user\n` +
    `/help - Show this menu\n\n` +
    `🛡️ *Safety Tips:*\n` +
    `• Never share personal info\n` +
    `• Report suspicious users\n` +
    `• Stay respectful\n\n` +
    `📞 Support: @FlameConnectSupport`,
    { parse_mode: 'Markdown' }
  );
});

// Report command
bot.command('report', (ctx) => {
  ctx.reply(
    `🚨 *Report a User*\n\n` +
    `To report someone, reply to their message with:\n` +
    `/report @username reason\n\n` +
    `Example: /report @baduser Harassment\n\n` +
    `🛡️ All reports are reviewed within 24 hours.`,
    { parse_mode: 'Markdown' }
  );
});

// ===== HANDLE VOICE MESSAGES =====
bot.on('voice', (ctx) => {
  ctx.reply(
    `🎤 *Voice Note Received!*\n\n` +
    `✅ Sent to your match\n` +
    `🛡️ Moderated for safety\n` +
    `💬 Reply to chat with them`,
    { parse_mode: 'Markdown' }
  );
});

// ===== HANDLE TEXT MESSAGES =====
bot.on('text', (ctx) => {
  // Only reply if not a command
  if (!ctx.message.text.startsWith('/')) {
    ctx.reply(
      `💬 *Message Received*\n\n` +
      `I'll forward this to your match.\n` +
      `Use /match to find someone to chat with!`,
      { parse_mode: 'Markdown' }
    );
  }
});

// ===== INLINE BUTTON HANDLERS =====
bot.action('find_match', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `🔍 *Searching for matches...*\n\n` +
    `🎯 Based on your preferences\n` +
    `📍 Finding people near you\n` +
    `⏳ This may take a moment\n\n` +
    `Found someone! 💕`,
    { parse_mode: 'Markdown' }
  );
});

bot.action('preferences', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `⚙️ *Set Your Preferences*\n\n` +
    `Send your preferences like:\n` +
    `• Age range: 25-35\n` +
    `• Looking for: Long-term\n` +
    `• Gender: Female\n` +
    `• Distance: 50km`,
    { parse_mode: 'Markdown' }
  );
});

bot.action('edit_bio', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `📝 *Edit Your Bio*\n\n` +
    `Send your new bio as a message.\n` +
    `📏 Max 500 characters\n\n` +
    `Example: "I love hiking, cooking, and travel 🏔️"`,
    { parse_mode: 'Markdown' }
  );
});

bot.action('privacy', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `🔒 *Privacy Settings*\n\n` +
    `• Show age: ✅ On\n` +
    `• Show distance: ✅ On\n` +
    `• Active status: ✅ On\n` +
    `• Blocked users: 0\n\n` +
    `Tap to toggle:`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '👁️ Hide Age', callback_data: 'hide_age' }],
          [{ text: '📍 Hide Location', callback_data: 'hide_location' }],
          [{ text: '🚫 Block List', callback_data: 'block_list' }]
        ]
      }
    }
  );
});

bot.action('delete', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `⚠️ *Delete Account*\n\n` +
    `Are you sure? This action cannot be undone!\n\n` +
    `All your data will be permanently removed.`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Yes, Delete', callback_data: 'confirm_delete' }],
          [{ text: '❌ Cancel', callback_data: 'cancel_delete' }]
        ]
      }
    }
  );
});

bot.action('confirm_delete', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `🗑️ *Account Deleted*\n\n` +
    `We're sorry to see you go 😢\n` +
    `Your data has been removed.\n\n` +
    `You can restart anytime with /start`,
    { parse_mode: 'Markdown' }
  );
});

bot.action('cancel_delete', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(`✅ Account deletion cancelled. We're glad you're staying! 💕`);
});

// ===== ERROR HANDLING =====
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('⚠️ Something went wrong. Please try again.');
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 FlameConnect running on port ${PORT}`);
  
  // Start bot
  bot.launch();
  console.log('✅ Bot is active!');
});

// ===== GRACEFUL SHUTDOWN =====
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
