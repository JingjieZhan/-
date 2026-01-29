/**
 * 目录页逻辑
 */
(function() {
    'use strict';

    const sceneGridEl = document.getElementById('sceneGrid');
    const creatorEntryEl = document.getElementById('creatorEntry');
    const dustEl = document.getElementById('dust');

    /**
     * 初始化场景目录
     */
    function initSceneGrid() {
        const scenes = window.getSceneList();
        sceneGridEl.innerHTML = '';

        scenes.forEach(scene => {
            const item = document.createElement('div');
            item.className = 'scene-item' + (scene.available ? '' : ' coming-soon');
            
            item.innerHTML = `
                ${!scene.available ? '<span class="scene-item-badge">敬请期待</span>' : ''}
                <div class="scene-item-title">${scene.title}</div>
                <div class="scene-item-location">${scene.location}</div>
                <div class="scene-item-desc">${scene.description}</div>
            `;

            if (scene.available) {
                item.addEventListener('click', () => {
                    window.location.href = `scene.html?id=${scene.id}`;
                });
            }

            sceneGridEl.appendChild(item);
        });
    }

    /**
     * 创建尘埃粒子
     */
    function createDust() {
        if (!dustEl) return;
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particle.style.animationDelay = Math.random() * 15 + 's';
            dustEl.appendChild(particle);
        }
    }

    /**
     * 事件绑定
     */
    creatorEntryEl.addEventListener('click', () => {
        window.location.href = 'creator.html';
    });

    /**
     * 初始化
     */
    function init() {
        createDust();
        initSceneGrid();
    }

    init();
})();