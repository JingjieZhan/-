/**
 * 场景注册
 * 每个场景对应一个地点/时刻，包含多个叙事角色
 */
window.SceneRegistry = {
    // 大理古街场景
    dali: {
        id: 'dali',
        title: '大理',
        location: '古城街道 · 咖啡馆',
        description: '在传统与现代交汇的街道上，每个人都带着自己的故事',
        available: true,
        
        // 序章内容
        prologue: {
            label: '◇ 序章 · 大理古街',
            text: `
                <p>我走在大理的一条古街道上。</p>
                <p>街道两旁，新颖的咖啡馆与古朴的店铺交错排列。我选择了一家古朴的——门口挂着手写的木牌，店内飘着某种说不清的香气。</p>
                <p>老板是个道士打扮的人。</p>
                <p>我点了一杯肉桂咖啡，坐在路边低矮的木桌旁。店门口立着一块小黑板：<span class="highlight-thought">「读书之夜」</span>。桌上摆着一本关于犬儒主义的书，书页间有红色的标注。</p>
                <p>我翻了几页，觉得写得乱七八糟，不像是开悟者的手笔。我把书放下。</p>
                <p>老板端来咖啡，问我还看不看那书。我说不看了。他便把书拿走，自己坐在柜台后读了起来。</p>
                <p>我看着他：<span class="highlight-thought">道士的打扮，却读着外国人写的犬儒主义，还有介绍西藏密宗的书。在景区开咖啡店，自己当老板，搞读书之夜...</span></p>
            `,
            question: `
                他到底觉得自己是谁？<br>
                他相信什么？他的叙事是什么？<br>
                如果我代入他的世界模型和生活空间，<br>
                会是怎样的体验？
            `
        },
        
        // 核心入口（序章页直接显示）
        coreNarratives: ['taoist'],
        
        // 所有可选角色（按分类）
        narrativeCategories: {
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
        }
    },

    // 预留场景
    midnight: {
        id: 'midnight',
        title: '深夜便利店',
        location: '城市 · 凌晨三点',
        description: '霓虹灯下，每个深夜不眠的人都有自己的理由',
        available: false
    },
    
    subway: {
        id: 'subway',
        title: '雨天的地铁',
        location: '通勤路上',
        description: '沉默的车厢里，每个人都在去往某个地方',
        available: false
    },
    
    hospital: {
        id: 'hospital',
        title: '医院走廊',
        location: '等待区',
        description: '在这里，时间有了不同的重量',
        available: false
    },
    
    village: {
        id: 'village',
        title: '故乡的村口',
        location: '春节 · 返乡',
        description: '熟悉又陌生的地方，熟悉又陌生的人',
        available: false
    },
    
    coworking: {
        id: 'coworking',
        title: '共享办公空间',
        location: '某个下午',
        description: '每个人都在"做自己的事"，但没人知道别人在做什么',
        available: false
    }
};

/**
 * 获取所有场景列表
 */
window.getSceneList = function() {
    return Object.values(window.SceneRegistry);
};

/**
 * 获取指定场景
 */
window.getScene = function(sceneId) {
    return window.SceneRegistry[sceneId] || null;
};