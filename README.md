# AbruptTranslation

**🌏 [中文文档](./README-zh.md) | English Documentation**

> 🌍 A clean, reliable, and efficient Discord translation plugin

A BetterDiscord translation plugin built with "good taste" principles. Double-click any message to translate it instantly.

## ✨ Features

- 🖱️ **Double-click Translation** - Double-click any message to translate instantly, double-click again to hide
- 🎯 **Smart Caching** - Automatically cache translation results to avoid duplicate API calls
- 🌐 **Multi-language Support** - Support for Chinese, English, Japanese, Korean, and other major languages
- 🤖 **Multi-model Support** - Compatible with OpenAI, DeepSeek, and all OpenAI-format APIs
- 💡 **Smart Quote Handling** - Automatically identify and separately translate quoted and reply content
- 🎨 **Perfect Integration** - Translation styles perfectly integrate with Discord interface
- ⚡ **Minimalist Design** - Following "good taste" principles with clean and efficient code
- 🌏 **Multilingual Interface** - Plugin interface supports English/Chinese switching

## 🚀 Quick Start

### Installation

1. Ensure [BetterDiscord](https://betterdiscord.app/) is installed
2. Download the `AbruptTranslation.plugin.js` file
3. Place the file in your BetterDiscord plugins directory:
   - **Windows**: `%AppData%/BetterDiscord/plugins/`
   - **macOS**: `~/Library/Application Support/BetterDiscord/plugins/`
   - **Linux**: `~/.config/BetterDiscord/plugins/`
4. Restart Discord and enable the plugin in settings

### Configuration

1. Find "AbruptTranslation" in BetterDiscord plugin settings
2. Click the settings button to configure:
   - **Plugin Language**: Choose English or Chinese interface
   - **API Key**: Your API key
   - **Base URL**: API service address (see configuration examples below)
   - **Model**: AI model name to use
   - **Target Language**: Translation target language (default: Chinese)
3. Click "Test API" to ensure configuration is correct
4. Save settings

### Usage

**It's that simple:**

1. **Translate Message** - Double-click any Discord message
2. **Hide Translation** - Double-click the same message again
3. **Show Again** - Double-click the message a third time

**Smart Features:**

- 🔄 **Smart Caching** - Same content won't be translated repeatedly
- 📝 **Quote Messages** - Automatically separate translation of quoted and reply content
- 👤 **Skip Self** - Automatically skip your own messages
- ⚡ **Instant Response** - Translation results appear instantly

## 🎨 Interface Preview

```
Original: Hello, how are you?
━━━━━━━━━━━━━━━━━━━━━━━━
💬 Translation: 你好，你怎么样？
```

**Quote Message Example:**
```
📋 Quote Translation: This is the quoted content translation
💬 Reply Translation: This is the reply content translation
```

## ⚙️ API Configuration Examples

> 💡 **Supports all OpenAI-compatible API services** - Just configure the corresponding Base URL and model name

### OpenAI Official
```
API Key: sk-xxxxxxxxxxxxxxxx
Base URL: https://api.openai.com/v1
Model: gpt-3.5-turbo / gpt-4 / gpt-4-turbo
```

### Google Gemini
```
API Key: AIxxxxxxxxxxxxxxxx
Base URL: https://generativelanguage.googleapis.com/v1beta
Model: gemini-pro / gemini-1.5-flash / gemini-1.5-pro
```

### DeepSeek
```
API Key: sk-xxxxxxxxxxxxxxxx
Base URL: https://api.deepseek.com/v1
Model: deepseek-chat / deepseek-coder
```

### Zhipu AI (GLM)
```
API Key: xxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx
Base URL: https://open.bigmodel.cn/api/paas/v4
Model: glm-4 / glm-4-flash / glm-3-turbo
```

### Moonshot (Kimi)
```
API Key: sk-xxxxxxxxxxxxxxxx
Base URL: https://api.moonshot.cn/v1
Model: moonshot-v1-8k / moonshot-v1-32k / moonshot-v1-128k
```

### Alibaba Qwen
```
API Key: sk-xxxxxxxxxxxxxxxx
Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1
Model: qwen-turbo / qwen-plus / qwen-max
```

### Baidu ERNIE
```
API Key: xxxxxxxxxxxxxxxx
Base URL: https://qianfan.baidubce.com/v2
Model: ernie-3.5-8k / ernie-4.0-8k / ernie-speed
```

### Anthropic Claude (via proxy)
```
API Key: sk-ant-xxxxxxxxxxxxxxxx
Base URL: https://api.anthropic.com/v1  # Requires proxy service
Model: claude-3-haiku / claude-3-sonnet / claude-3-opus
```

### Third-party Proxy Services
```
# Generally compatible with OpenAI format, just change Base URL
API Key: Key provided by proxy service
Base URL: Proxy service address
Model: Supported model name
```

## 🔧 Custom Translation Prompts

Default prompt:
```
Translate the following text to {targetLang}, return only the translation:
{text}
```

Can be customized as needed, supports variables:
- `{targetLang}` - Target language
- `{text}` - Original text content

## 🛠️ Technical Implementation

### Core Design Philosophy

Following "good taste" principles:

- **Eliminate Special Cases** - Make toggling display the normal flow
- **Simplicity Obsession** - Functions are short and focused, doing one thing well
- **Pragmatism** - Solve real problems, reject over-engineering

### Key Technologies

- **DOM Event Listening** - Global double-click event capture
- **Smart Element Finding** - Precisely locate Discord message containers
- **Caching Mechanism** - Map-based translation result caching
- **CSS Priority Handling** - Use `!important` to ensure styles take effect
- **Async API Calls** - Support concurrent translation requests
- **Multilingual Interface** - Dynamic language switching system

## 🐛 Common Issues

### Q: Double-click not responding?
A: Check if API configuration is correct and ensure API Key is valid

### Q: Translation style abnormal?
A: Plugin uses `!important` styles, usually won't be overridden. If issues persist, try restarting Discord

### Q: Translation speed slow?
A: Check network connection and API service response speed. Plugin has built-in caching mechanism

### Q: Some messages can't be translated?
A: Plugin automatically skips your own messages and messages too short (less than 2 characters)

### Q: How to switch plugin interface language?
A: Select "Plugin Language" in plugin settings, supports Chinese and English

## 📄 Open Source License

MIT License - Free to use, modify, and distribute

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

Follow code philosophy:
- Code should have "good taste"
- Simplicity over complexity
- Practicality over perfection

**Project Repository**: [GitHub - AbruptTranslation](https://github.com/Maigee/AbruptTranslation)
**Author Twitter**: [@unflwMaige](https://x.com/unflwMaige)

---

**Enjoy barrier-free Discord chatting experience!** 🎉