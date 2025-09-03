/**
 * @name AbruptTranslation
 * @author Maige
 * @description 🌍 更适合中国宝宝体质的 Discord 翻译插件
 * @version 2.0.0
 * @website https://x.com/unflwMaige
 * @source https://github.com/Maigee/AbruptTranslation
 */

module.exports = class AbruptTranslation {
    constructor() {
        this.name = "AbruptTranslation";
        this.version = "2.0.0";
        
        // 最少必需状态
        this.translating = 0;
        this.cache = new Map(); // 简单的缓存
        
        // 极简配置
        this.settings = {
            apiKey: "",
            baseUrl: "",
            model: "",
            targetLang: "zh-CN",
            language: "en", // 插件界面语言：en/zh-CN
            prompt: "Translate the following text to {targetLang}, return only the translation::\n\n翻译结果在符合原意的基础上，可以进行口语化/网络用语化/年轻化的加工。\n注意：最终只需要译文，不要出现其他任何提示或者解释或者思考过程，仅需要输出译文。\n\n{text}"
        };
        
        this.loadSettings();
        
        // 语言文本配置
        this.texts = {
            en: {
                pluginName: "AbruptTranslation Settings",
                apiKey: "API Key:",
                baseUrl: "Base URL:",
                model: "Model:",
                targetLang: "Target Language:",
                language: "Plugin Language:",
                prompt: "Translation Prompt:",
                usage: "Usage: Double-click any message to translate, double-click again to hide translation.",
                newFeature: "New Feature: Intelligent separation of quoted and reply content for clearer visual distinction.",
                saveBtn: "Save Settings",
                testBtn: "Test API",
                clearBtn: "Clear Translations",
                chinese: "Chinese",
                english: "English",
                japanese: "Japanese",
                korean: "Korean"
            },
            "zh-CN": {
                pluginName: "AbruptTranslation 设置",
                apiKey: "API Key:",
                baseUrl: "Base URL:",
                model: "模型:",
                targetLang: "目标语言:",
                language: "插件语言:",
                prompt: "翻译提示词:",
                usage: "使用说明：双击任意消息翻译，再次双击隐藏译文。",
                newFeature: "新特性：智能分离引用和回复内容，视觉区分更清晰。",
                saveBtn: "保存设置",
                testBtn: "测试API",
                clearBtn: "清除翻译",
                chinese: "中文",
                english: "英文",
                japanese: "日文",
                korean: "韩文"
            }
        };
    }

    
    // 获取当前语言文本
    getText(key) {
        return this.texts[this.settings.language] ? this.texts[this.settings.language][key] : this.texts.en[key];
    }

    start() {
        console.log("🚀 简洁双击翻译器启动");
        this.setupDoubleClickTranslation();
        console.log("✅ 插件启动完成 - 双击消息即可翻译");
    }
    
    stop() {
        console.log("🛑 停止插件");
        this.cleanup();
        console.log("✅ 插件已停止");
    }
    
    // BetterDiscord可选方法
    getSettingsPanel() {
        return this.createSettingsPanel();
    }
    
    cleanup() {
        // 移除双击事件监听
        if (this.handleDoubleClick) {
            document.removeEventListener('dblclick', this.handleDoubleClick);
        }
        this.clearAllTranslations();
    }

    loadSettings() {
        try {
            const saved = BdApi.Data.load(this.name, "settings");
            if (saved) {
                Object.assign(this.settings, saved);
            }
        } catch (error) {
            console.log("使用默认设置");
        }
    }
    
    saveSettings() {
        BdApi.Data.save(this.name, "settings", this.settings);
    }
    
    updateTranslatingStatus() {
        // 在控制台显示翻译状态
        if (this.translating > 0) {
            console.log(`🔄 working... (${this.translating}条消息)`);
        }
    }

    // =========================================================================
    // 双击翻译功能 - 简单直接，双击即翻译
    // =========================================================================
    
    setupDoubleClickTranslation() {
        // 绑定双击事件到文档
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
        document.addEventListener('dblclick', this.handleDoubleClick);
        console.log('✅ 双击翻译功能已启用');
    }
    
    handleDoubleClick(event) {
        const messageElement = this.findMessageElement(event.target);
        if (!messageElement) return;
        
        this.translateMessage(messageElement);
    }
    
    // 找到消息元素
    findMessageElement(element) {
        // 向上遍历DOM树，找到消息容器
        let current = element;
        while (current && current !== document) {
            const className = current.className || "";
            // Discord消息元素的典型特征
            if (className.includes("messageListItem") || 
                className.includes("message-") ||
                current.id?.startsWith("chat-messages-")) {
                return current;
            }
            current = current.parentElement;
        }
        return null;
    }
    
    // =========================================================================
    // 消息文本提取 - 精确提取，处理引用消息
    // =========================================================================
    
    // 智能提取 - 分离引用和回复，清理干扰信息
    extractText(element) {
        const result = this.extractMessageParts(element);
        
        // 如果有引用和回复，分别处理
        if (result.hasQuote && result.replyText) {
            return {
                isComplex: true,
                quoteText: result.quoteText,
                replyText: result.replyText,
                fullText: `${result.quoteText} ${result.replyText}`
            };
        }
        
        // 普通消息直接返回清理后的文本
        return {
            isComplex: false,
            fullText: result.fullText || result.replyText || ""
        };
    }
    
    // 提取消息各部分内容
    extractMessageParts(element) {
        // 查找所有可能的内容容器
        const contentElements = element.querySelectorAll('[class*="messageContent"], [class*="markup"]');
        
        let quoteText = "";
        let replyText = "";
        let fullText = "";
        let hasQuote = false;
        
        if (contentElements.length >= 2) {
            // 可能是引用消息：第一个是引用，第二个是回复
            const firstEl = contentElements[0];
            const secondEl = contentElements[1];
            
            quoteText = this.cleanText(firstEl.textContent);
            replyText = this.cleanText(secondEl.textContent);
            hasQuote = true;
            
            console.log(`📝 检测到引用消息 - 引用: "${quoteText.substring(0, 30)}..." 回复: "${replyText.substring(0, 30)}..."`);
        } else if (contentElements.length === 1) {
            // 普通消息
            fullText = this.cleanText(contentElements[0].textContent);
            console.log(`📝 提取普通消息: "${fullText.substring(0, 50)}..."`);
        } else {
            // 备用方案：直接从元素获取
            fullText = this.cleanText(element.textContent);
            console.log(`📝 备用提取: "${fullText.substring(0, 50)}..."`);
        }
        
        return { quoteText, replyText, fullText, hasQuote };
    }
    
    // 彻底清理文本干扰
    cleanText(text) {
        if (!text) return "";
        
        return text
            // 清理Discord特殊字符
            .replace(/\u200B/g, '') // 零宽空格
            .replace(/\u200D/g, '') // 零宽连字符  
            .replace(/\uFEFF/g, '') // 字节顺序标记
            // 清理时间戳和ID模式
            .replace(/\b\d{10,20}\b/g, '') // 长数字ID
            .replace(/\b(?:Today|Yesterday|\d{1,2}:\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4})\b/gi, '') // 时间戳
            .replace(/\b(?:AM|PM)\b/gi, '') // 上午下午
            // 清理多余空白
            .replace(/\s+/g, ' ')
            .trim();
    }
    
    // =========================================================================
    // 翻译功能 - 简单直接，一次翻译一条消息
    // =========================================================================
    
    async translateMessage(messageElement) {
        const existingTranslation = messageElement.querySelector(".translation-result, .translation-container");
        if (existingTranslation) {
            this.toggleTranslationVisibility(messageElement);
            return;
        }
        
        // 正常翻译流程
        const textData = this.extractText(messageElement);
        const fullText = textData?.fullText || "";
        if (!fullText || fullText.trim().length < 2) return;
        if (messageElement.querySelector('[class*="localUser"]')) return;
        
        messageElement.dataset.translated = "true";
        
        try {
            this.translating++;
            this.updateTranslatingStatus();
            
            if (textData.isComplex) {
                await this.translateComplexMessage(messageElement, textData);
            } else {
                const loadingEl = this.insertTranslation(messageElement, "🔄 working...", true);
                const translation = await this.getTranslation(fullText);
                loadingEl.textContent = translation;
                loadingEl.style.fontStyle = "normal";
                loadingEl.style.opacity = "1";
            }
        } catch (error) {
            console.error("翻译失败:", error);
            this.insertTranslation(messageElement, `翻译失败: ${error.message}`, false, true);
        } finally {
            this.translating = Math.max(0, this.translating - 1);
            this.updateTranslatingStatus();
        }
    }
    
    // 翻译复杂消息（引用+回复）
    async translateComplexMessage(messageElement, textData) {
        const { quoteText, replyText } = textData;
        
        // 创建容器
        const container = this.createTranslationContainer(messageElement);
        
        // 显示加载状态
        const loadingDiv = document.createElement("div");
        loadingDiv.className = "translation-loading";
        loadingDiv.textContent = "🔄 working...";
        loadingDiv.style.cssText = `
            padding: 8px 12px !important;
            color: #666 !important;
            font-style: italic !important;
            font-size: 13px !important;
        `;
        container.appendChild(loadingDiv);
        
        try {
            // 翻译引用内容
            if (quoteText && quoteText.length > 2) {
                const quoteTranslation = await this.getTranslation(quoteText);
                const quoteDiv = this.createQuoteTranslation(quoteTranslation);
                container.appendChild(quoteDiv);
            }
            
            // 翻译回复内容  
            if (replyText && replyText.length > 2) {
                const replyTranslation = await this.getTranslation(replyText);
                const replyDiv = this.createReplyTranslation(replyTranslation);
                container.appendChild(replyDiv);
            }
        } finally {
            // 移除加载状态
            loadingDiv.remove();
        }
    }
    
    // 翻译普通消息
    async translateSimpleMessage(messageElement, text) {
        const translation = await this.getTranslation(text);
        this.insertTranslation(messageElement, translation);
    }
    
    // 获取翻译（带缓存）
    async getTranslation(text) {
        if (this.cache.has(text)) {
            console.log('✅ 使用缓存结果');
            return this.cache.get(text);
        }
        
        const translation = await this.callAPI(text);
        this.cache.set(text, translation);
        return translation;
    }
    
    toggleTranslationVisibility(messageElement) {
        const translations = messageElement.querySelectorAll('.translation-result, .translation-container');
        translations.forEach(el => {
            const isHidden = el.style.display === 'none';
            if (isHidden) {
                el.style.removeProperty('display');
            } else {
                el.style.setProperty('display', 'none', 'important');
            }
        });
    }
    
    // 创建翻译容器
    createTranslationContainer(messageElement) {
        const existing = messageElement.querySelector(".translation-container");
        if (existing) existing.remove();
        
        const container = document.createElement("div");
        container.className = "translation-container";
        container.style.cssText = `
            margin: 8px 0 4px 0 !important;
            display: block !important;
            position: relative !important;
        `;
        
        messageElement.appendChild(container);
        return container;
    }
    
    // 创建引用翻译样式
    createQuoteTranslation(text) {
        const div = document.createElement("div");
        div.className = "translation-result quote-translation";
        div.innerHTML = `<span style="color: #666; font-size: 12px; margin-right: 8px;">📋:</span>${text}`;
        
        div.style.cssText = `
            margin: 4px 0 !important;
            padding: 8px 12px !important;
            border-left: 3px solid #9e9e9e !important;
            background: #f5f5f5 !important;
            border-radius: 4px !important;
            font-size: 13px !important;
            color: #555 !important;
            font-style: italic !important;
            display: block !important;
            position: relative !important;
            z-index: 1000 !important;
        `;
        
        return div;
    }
    
    // 创建回复翻译样式
    createReplyTranslation(text) {
        const div = document.createElement("div");
        div.className = "translation-result reply-translation";
        div.innerHTML = `<span style="color: #2196f3; font-size: 12px; margin-right: 8px;">💬:</span>${text}`;
        
        div.style.cssText = `
            margin: 4px 0 !important;
            padding: 10px 14px !important;
            border-left: 4px solid #2196f3 !important;
            background: #e3f2fd !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            color: #1565c0 !important;
            font-weight: 500 !important;
            display: block !important;
            position: relative !important;
            z-index: 1000 !important;
        `;
        
        return div;
    }
    
    // 简单消息翻译插入
    insertTranslation(messageElement, text, isLoading = false, isError = false) {
        const existing = messageElement.querySelector(".translation-result");
        if (existing) existing.remove();
        
        const div = document.createElement("div");
        div.className = "translation-result";
        div.textContent = text;
        
        div.style.cssText = `
            margin: 8px 0 4px 0 !important;
            padding: 10px 14px !important;
            border-left: 4px solid ${isError ? '#ed4245' : '#2196f3'} !important;
            background: ${isError ? '#ffebee' : '#e3f2fd'} !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            font-style: ${isLoading ? 'italic' : 'normal'} !important;
            opacity: ${isLoading ? '0.8' : '1'} !important;
            color: ${isError ? '#d32f2f' : '#1565c0'} !important;
            display: block !important;
            position: relative !important;
            z-index: 1000 !important;
            visibility: visible !important;
        `;
        
        messageElement.appendChild(div);
        return div;
    }

    // 彻底修复API空结果问题
    async callAPI(text) {
        const { apiKey, baseUrl, model } = this.settings;
        
        if (!apiKey || !baseUrl || !model) {
            throw new Error("请先配置API信息");
        }
        
        const prompt = this.settings.prompt
            .replace("{targetLang}", this.settings.targetLang)
            .replace("{text}", text);
        
        console.log(`🔍 API调用开始: ${text.substring(0, 30)}...`);
        
        const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1000,
                temperature: 0.3
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ API请求失败: ${response.status} - ${errorText}`);
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('🔍 API响应数据:', JSON.stringify(data, null, 2));
        
        let result = null;
        
        if (data.choices && data.choices.length > 0) {
            const choice = data.choices[0];
            if (choice.message && typeof choice.message.content === 'string') {
                result = choice.message.content.trim();
            console.log('✅ 从 choices[0].message.content 提取结果');
            } else if (choice.text && typeof choice.text === 'string') {
                result = choice.text.trim();
                console.log('✅ 从 choices[0].text 提取结果');
            }
        }
        
        if (!result) {
            const fields = ['result', 'output', 'response', 'answer', 'translation', 'text', 'content'];
            for (const field of fields) {
                if (data[field] && typeof data[field] === 'string' && data[field].trim()) {
                    result = data[field].trim();
                    console.log(`✅ 从 ${field} 提取结果`);
                    break;
                }
            }
        }
        
        if (!result && typeof data === 'string' && data.trim()) {
            result = data.trim();
            console.log('✅ 整个响应就是结果');
        }
        
        if (!result) {
            function deepSearch(obj) {
                if (typeof obj === 'string' && obj.trim() && obj.length > 2) {
                    return obj.trim();
                }
                if (typeof obj === 'object' && obj !== null) {
                    for (const value of Object.values(obj)) {
                        if (Array.isArray(value)) {
                            for (const item of value) {
                                const found = deepSearch(item);
                                if (found) return found;
                            }
                        } else {
                            const found = deepSearch(value);
                            if (found) return found;
                        }
                    }
                }
                return null;
            }
            
            result = deepSearch(data);
            if (result) console.log('✅ 通过深度搜索提取结果');
        }
        
        if (!result || result.length === 0) {
            console.error('❌ 所有方法都无法提取翻译结果，完整响应:', data);
            throw new Error('API返回空结果');
        }
        
        // 验证结果质量
        if (result.toLowerCase() === 'null' || result.toLowerCase() === 'undefined' || result.toLowerCase() === 'error') {
            throw new Error(`翻译结果无效: "${result}"`);
        }
        
        console.log(`✅ 翻译成功: ${result.substring(0, 50)}...`);
        return result;
    }

    // =========================================================================
    // 工具函数 - 简单实用
    // =========================================================================
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    clearAllTranslations() {
        document.querySelectorAll(".translation-result, .translation-container").forEach(el => el.remove());
        document.querySelectorAll('[data-translated="true"]').forEach(el => {
            delete el.dataset.translated;
        });
    }

    // =========================================================================
    // 设置面板 - 实用为主，不搞花哨
    // =========================================================================
    
    createSettingsPanel() {
        const panel = document.createElement("div");
        panel.style.cssText = `
            padding: 20px;
            background: white;
            border-radius: 8px;
            max-width: 500px;
        `;
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 20px 0; color: #5865f2;">🌌 ${this.getText('pluginName')}</h3>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">${this.getText('language')}</label>
                <select id="language" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>🇺🇸 English</option>
                    <option value="zh-CN" ${this.settings.language === 'zh-CN' ? 'selected' : ''}>🇨🇳 中文</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">${this.getText('apiKey')}</label>
                <input type="password" id="apiKey" value="${this.settings.apiKey}" 
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">${this.getText('baseUrl')}</label>
                <input type="text" id="baseUrl" value="${this.settings.baseUrl}" 
                       placeholder="https://api.openai.com/v1"
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">${this.getText('model')}</label>
                <input type="text" id="model" value="${this.settings.model}" 
                       placeholder="gpt-3.5-turbo"
                       style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">${this.getText('targetLang')}</label>
                <select id="targetLang" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="zh-CN" ${this.settings.targetLang === 'zh-CN' ? 'selected' : ''}>🇨🇳 ${this.getText('chinese')}</option>
                    <option value="en" ${this.settings.targetLang === 'en' ? 'selected' : ''}>🇺🇸 ${this.getText('english')}</option>
                    <option value="ja" ${this.settings.targetLang === 'ja' ? 'selected' : ''}>🇯🇵 ${this.getText('japanese')}</option>
                    <option value="ko" ${this.settings.targetLang === 'ko' ? 'selected' : ''}>🇰🇷 ${this.getText('korean')}</option>
                </select>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">${this.getText('prompt')}</label>
                <textarea id="prompt" rows="3" 
                          style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; resize: vertical;">${this.settings.prompt}</textarea>
            </div>
            
            <div style="margin-bottom: 15px; padding: 12px; background: #f0f8ff; border-radius: 6px; border-left: 4px solid #5865f2;">
                <p style="margin: 0; color: #2c5282; font-size: 14px;">
                    👆 <strong>${this.getText('usage')}</strong><br>
                    <strong>${this.getText('newFeature')}</strong>
                </p>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button id="saveBtn" style="flex: 1; padding: 10px; background: #5865f2; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">${this.getText('saveBtn')}</button>
                <button id="testBtn" style="flex: 1; padding: 10px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">${this.getText('testBtn')}</button>
                <button id="clearBtn" style="padding: 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">${this.getText('clearBtn')}</button>
            </div>
            
            <div id="status" style="margin-top: 10px; padding: 8px; border-radius: 4px; display: none;"></div>
        `;
        
        // 绑定事件
        const languageSelect = panel.querySelector("#language");
        languageSelect.onchange = () => {
            this.settings.language = languageSelect.value;
            this.saveSettings();
            // 重新渲染设置面板以更新语言
            const newPanel = this.createSettingsPanel();
            panel.parentNode.replaceChild(newPanel, panel);
        };
        
        panel.querySelector("#saveBtn").onclick = () => this.saveSettingsFromPanel(panel);
        panel.querySelector("#testBtn").onclick = () => this.testAPIFromPanel(panel);
        panel.querySelector("#clearBtn").onclick = () => {
            this.clearAllTranslations();
            this.showStatus(panel, this.getText('clearBtn'), "success");
        };
        
        return panel;
    }
    
    saveSettingsFromPanel(panel) {
        this.settings.apiKey = panel.querySelector("#apiKey").value;
        this.settings.baseUrl = panel.querySelector("#baseUrl").value;
        this.settings.model = panel.querySelector("#model").value;
        this.settings.targetLang = panel.querySelector("#targetLang").value;
        this.settings.language = panel.querySelector("#language").value;
        this.settings.prompt = panel.querySelector("#prompt").value;
        
        this.saveSettings();
        this.showStatus(panel, this.getText('saveBtn').replace(/设置|保存/g, '') + " ✅!", "success");
    }
    
    async testAPIFromPanel(panel) {
        try {
            this.showStatus(panel, "test...", "info");
            const result = await this.callAPI("Hello");
            this.showStatus(panel, `✅！result: ${result}`, "success");
        } catch (error) {
            this.showStatus(panel, `❌: ${error.message}`, "error");
        }
    }
    
    showStatus(panel, message, type = "info") {
        const status = panel.querySelector("#status");
        const colors = {
            success: "#d4edda",
            error: "#f8d7da",
            info: "#d1ecf1"
        };
        
        status.textContent = message;
        status.style.backgroundColor = colors[type];
        status.style.display = "block";
        
        setTimeout(() => {
            status.style.display = "none";
        }, 3000);
    }
};
