# AbruptTranslation

> 🌍 简洁、可靠、高效的Discord翻译插件

更适合中国宝宝体质的 Discord 翻译插件，双击即可翻译任意消息。

## ✨ 特性

- 🖱️ **双击翻译** - 双击任意消息立即翻译，再次双击隐藏译文
- 🎯 **智能缓存** - 自动缓存翻译结果，避免重复API调用
- 🌐 **多语言支持** - 支持中文、英文、日文、韩文等主流语言
- 🤖 **多模型支持** - 兼容OpenAI、DeepSeek等所有OpenAI格式API
- 💡 **引用消息智能处理** - 自动识别并分别翻译引用内容和回复内容
- 🎨 **完美融合** - 译文样式与Discord界面完美融合
- ⚡ **极简设计** - 遵循"好品味"原则，代码简洁高效

## 🚀 快速开始

### 安装

1. 确保已安装 [BetterDiscord](https://betterdiscord.app/)
2. 下载 `AbruptTranslation.plugin.js` 文件
3. 将文件放入BetterDiscord插件目录：
   - **Windows**: `%AppData%/BetterDiscord/plugins/`
   - **macOS**: `~/Library/Application Support/BetterDiscord/plugins/`
   - **Linux**: `~/.config/BetterDiscord/plugins/`
4. 重启Discord并在设置中启用插件

### 配置

1. 在BetterDiscord插件设置中找到"AbruptTranslation"
2. 点击设置按钮配置以下信息：
   - **API Key**: 你的API密钥
   - **Base URL**: API服务地址（详见下方配置示例）
   - **模型**: 使用的AI模型名称
   - **目标语言**: 翻译目标语言 (默认: 中文)
3. 点击"测试API"确保配置正确
4. 保存设置

### 使用

**就这么简单：**

1. **翻译消息** - 双击任意Discord消息
2. **隐藏译文** - 再次双击同一消息
3. **重新显示** - 第三次双击消息

**智能特性：**

- 🔄 **智能缓存** - 相同内容不会重复翻译
- 📝 **引用消息** - 自动分离翻译引用内容和回复内容  
- 👤 **跳过自己** - 自动跳过自己发送的消息
- ⚡ **即时响应** - 翻译结果即时显示

## 🎨 界面展示

```
原消息: Hello, how are you?
━━━━━━━━━━━━━━━━━━━━━━━━
💬 译文: 你好，你怎么样？
```

**引用消息示例：**
```
📋 引用译文: 这是引用的内容翻译
💬 回复译文: 这是回复的内容翻译
```

## ⚙️ API配置示例

> 💡 **支持所有兼容OpenAI格式的API服务** - 只需配置对应的Base URL和模型名称

### OpenAI 官方
```
API Key: sk-xxxxxxxxxxxxxxxx
Base URL: https://api.openai.com/v1
模型: gpt-3.5-turbo / gpt-4 / gpt-4-turbo
```

### Google Gemini
```
API Key: AIxxxxxxxxxxxxxxxx
Base URL: https://generativelanguage.googleapis.com/v1beta
模型: gemini-pro / gemini-1.5-flash / gemini-1.5-pro
```

### DeepSeek
```
API Key: sk-xxxxxxxxxxxxxxxx
Base URL: https://api.deepseek.com/v1
模型: deepseek-chat / deepseek-coder
```

### 智谱AI (GLM)
```
API Key: xxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx
Base URL: https://open.bigmodel.cn/api/paas/v4
模型: glm-4 / glm-4-flash / glm-3-turbo
```

### 月之暗面 (Kimi)
```
API Key: sk-xxxxxxxxxxxxxxxx
Base URL: https://api.moonshot.cn/v1
模型: moonshot-v1-8k / moonshot-v1-32k / moonshot-v1-128k
```

### 阿里云通义千问
```
API Key: sk-xxxxxxxxxxxxxxxx
Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1
模型: qwen-turbo / qwen-plus / qwen-max
```

### 百川智能
```
API Key: xxxxxxxxxxxxxxxx
Base URL: https://qianfan.baidubce.com/v2
模型: ernie-3.5-8k / ernie-4.0-8k / ernie-speed
```

### Anthropic Claude (通过代理)
```
API Key: sk-ant-xxxxxxxxxxxxxxxx
Base URL: https://api.anthropic.com/v1  # 需要代理服务
模型: claude-3-haiku / claude-3-sonnet / claude-3-opus
```

### 第三方代理服务
```
# 一般都兼容OpenAI格式，只需更换Base URL
API Key: 代理服务提供的Key
Base URL: 代理服务地址
模型: 支持的模型名称
```

## 🔧 自定义翻译提示词

默认提示词：
```
Translate the following text to {targetLang}, return only the translation:
{text}
```

可以根据需要自定义，支持变量：
- `{targetLang}` - 目标语言
- `{text}` - 原文内容

## 🛠️ 技术实现

### 关键技术

- **DOM事件监听** - 全局双击事件捕获
- **智能元素查找** - 精确定位Discord消息容器
- **缓存机制** - Map-based翻译结果缓存
- **CSS优先级处理** - 使用`!important`确保样式生效
- **异步API调用** - 支持并发翻译请求

## 🐛 常见问题

### Q: 双击没有反应？
A: 检查API配置是否正确，确保API Key有效

### Q: 译文样式异常？
A: 插件使用`!important`样式，通常不会被覆盖。如有问题，尝试重启Discord

### Q: 翻译速度慢？
A: 检查网络连接和API服务响应速度。插件已内置缓存机制

### Q: 某些消息无法翻译？
A: 插件会自动跳过自己的消息和过短的消息（少于2个字符）


## 🤝 贡献

欢迎提交Issues和Pull Requests！

**作者推特**: [@unflwMaige](https://x.com/unflwMaige)


