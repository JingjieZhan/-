/**
 * 叙事之镜 - 场景页主逻辑
 */
(function() {
    'use strict';

    // ===== 收集所有叙事模块 =====
    const narratives = {};
    Object.keys(window).forEach(key => {
        if (key.startsWith('Narrative') && window[key] && window[key].key) {
            narratives[window[key].key] = window[key];
        }
    });

    // ===== 角色分类配置 =====
    const narrativeCategories = {
        tourist: {
            label: '游客 · 他们在寻找什么',
            narratives: ['shanghai-worker', 'heartbroken-coder', 'curious-student', 'spiritual-seeker']
        },
        local: {
            label: '本地人 · 他们记得什么',
            narratives: ['bai-grandmother']
        },
        settler: {
            label: '定居者 · 他们逃离了什么',
            narratives: ['innkeeper', 'writer', 'digital-nomad']
        },
        meta: {
            label: '元视角',
            narratives: ['mirror']
        }
    };

    // ===== 状态 =====
    let currentNarrative = null;
    let dialogueHistory = [];

    // ===== DOM 元素 =====
    const prologueEl = document.getElementById('prologue');
    const experienceEl = document.getElementById('experience');
    const portalsEl = document.getElementById('portals');
    const perspectiveLabelEl = document.getElementById('perspectiveLabel');
    const narratorBoxEl = document.getElementById('narratorBox');
    const dialogueLogEl = document.getElementById('dialogueLog');
    const thoughtInputEl = document.getElementById('thoughtInput');
    const submitBtn = document.getElementById('submitThought');
    const switchBtn = document.getElementById('switchPerspective');
    const backToHomeBtn = document.getElementById('backToHome');
    const backToIndexBtn = document.getElementById('backToIndex');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    // ===== 初始化三个核心入口 =====
    function initPortals() {
        portalsEl.innerHTML = '';
        
        // 1. 道士咖啡馆老板
        if (narratives['taoist']) {
            const taoist = narratives['taoist'];
            const portal1 = document.createElement('div');
            portal1.className = 'portal';
            portal1.innerHTML = `
                <div class="portal-title">${taoist.portalTitle}</div>
                <div class="portal-desc">${taoist.portalDesc}</div>
            `;
            portal1.addEventListener('click', () => enterNarrative('taoist'));
            portalsEl.appendChild(portal1);
        }

        // 2. 路人总入口（打开 Modal）
        const passerbyPortal = document.createElement('div');
        passerbyPortal.className = 'portal';
        passerbyPortal.innerHTML = `
            <div class="portal-title">→ 街上的人们</div>
            <div class="portal-desc">游客、本地人、定居者... 他们各自活在怎样的故事里？点击选择一个角色。</div>
        `;
        passerbyPortal.addEventListener('click', openModal);
        portalsEl.appendChild(passerbyPortal);
    }

    // ===== 初始化 Modal 内容 =====
    function initModal() {
        modalBody.innerHTML = '';
        
        Object.entries(narrativeCategories).forEach(([catKey, category]) => {
            const categoryEl = document.createElement('div');
            categoryEl.className = 'character-category';
            
            const labelEl = document.createElement('div');
            labelEl.className = 'category-label';
            labelEl.textContent = category.label;
            categoryEl.appendChild(labelEl);
            
            const listEl = document.createElement('div');
            listEl.className = 'character-list';
            
            category.narratives.forEach(key => {
                const narrative = narratives[key];
                if (!narrative) return;
                
                const item = document.createElement('div');
                item.className = 'character-item';
                item.innerHTML = `
                    <div class="character-name">${narrative.label}</div>
                    <div class="character-seeking">${narrative.seeking || narrative.portalDesc}</div>
                `;
                item.addEventListener('click', () => {
                    closeModal();
                    enterNarrative(key);
                });
                listEl.appendChild(item);
            });
            
            categoryEl.appendChild(listEl);
            modalBody.appendChild(categoryEl);
        });
    }

    // ===== Modal 控制 =====
    function openModal() {
        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
    }

    // ===== 创建尘埃粒子 =====
    function createDust() {
        const container = document.getElementById('dust');
        if (!container) return;
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particle.style.animationDelay = Math.random() * 15 + 's';
            container.appendChild(particle);
        }
    }

    // ===== 进入叙事 =====
    function enterNarrative(key) {
        currentNarrative = key;
        const narrative = narratives[key];
        
        perspectiveLabelEl.textContent = narrative.label;
        narratorBoxEl.innerHTML = narrative.opening.replace(/\n/g, '<br>');
        dialogueLogEl.innerHTML = '';
        dialogueHistory = [];
        
        prologueEl.classList.add('hidden');
        setTimeout(() => {
            prologueEl.style.display = 'none';
            experienceEl.classList.add('active');
            window.scrollTo(0, 0);
        }, 500);

        saveState();
    }

    // ===== 返回序章 =====
    function backToHome() {
        experienceEl.classList.remove('active');
        prologueEl.style.display = 'block';
        setTimeout(() => {
            prologueEl.classList.remove('hidden');
        }, 50);
        currentNarrative = null;
        localStorage.removeItem('narrativeState');
    }

    // ===== 检测关键词 =====
    function detectKeyword(input, narrative) {
        const keywords = narrative.keywords || [];
        for (const item of keywords) {
            if (item.words.some(word => input.includes(word))) {
                return item.key;
            }
        }
        return 'default';
    }

    // ===== 生成回复 =====
    function generateResponse(input) {
        const narrative = narratives[currentNarrative];
        const keyword = detectKeyword(input, narrative);
        return narrative.responses[keyword] || narrative.responses.default;
    }

    // ===== 添加对话 =====
    function addDialogue(speaker, content, type) {
        const entry = document.createElement('div');
        entry.className = `dialogue-entry ${type}`;
        entry.innerHTML = `
            <div class="dialogue-speaker">${speaker}</div>
            <div class="dialogue-content">${content.replace(/\n/g, '<br>')}</div>
        `;
        dialogueLogEl.appendChild(entry);
        entry.scrollIntoView({ behavior: 'smooth' });
    }

    // ===== 提交想法 =====
    function handleSubmit() {
        const input = thoughtInputEl.value.trim();
        if (!input) return;

        addDialogue('你的思考', input, 'observer');
        dialogueHistory.push({ type: 'user', content: input });
        thoughtInputEl.value = '';

        const loading = document.createElement('div');
        loading.className = 'dialogue-entry subject';
        loading.innerHTML = `<div class="typing-indicator">正在回应</div>`;
        dialogueLogEl.appendChild(loading);

        setTimeout(() => {
            loading.remove();
            const response = generateResponse(input);
            const narrative = narratives[currentNarrative];
            addDialogue(narrative.label, response, 'subject');
            dialogueHistory.push({ type: 'subject', content: response });
            saveState();
        }, 800 + Math.random() * 400);
    }

    // ===== 状态持久化 =====
    function saveState() {
        const state = {
            currentNarrative,
            dialogueHistory
        };
        localStorage.setItem('narrativeState', JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem('narrativeState');
        if (saved) {
            try {
                const state = JSON.parse(saved);
                if (state.currentNarrative && narratives[state.currentNarrative]) {
                    currentNarrative = state.currentNarrative;
                    dialogueHistory = state.dialogueHistory || [];
                    
                    const narrative = narratives[currentNarrative];
                    perspectiveLabelEl.textContent = narrative.label;
                    narratorBoxEl.innerHTML = narrative.opening.replace(/\n/g, '<br>');
                    
                    dialogueHistory.forEach(item => {
                        const speaker = item.type === 'user' ? '你的思考' : narrative.label;
                        const type = item.type === 'user' ? 'observer' : 'subject';
                        addDialogue(speaker, item.content, type);
                    });
                    
                    prologueEl.style.display = 'none';
                    experienceEl.classList.add('active');
                }
            } catch (e) {
                console.error('Failed to load state:', e);
            }
        }
    }

    // ===== 事件绑定 =====
    submitBtn.addEventListener('click', handleSubmit);
    thoughtInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handleSubmit();
        }
    });
    
    switchBtn.addEventListener('click', openModal);
    backToHomeBtn.addEventListener('click', backToHome);
    
    if (backToIndexBtn) {
        backToIndexBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // ===== 初始化 =====
    function init() {
        createDust();
        initPortals();
        initModal();
        loadState();
    }

    init();
})();