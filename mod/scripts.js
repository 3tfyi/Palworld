// 获取DOM元素
const modsList = document.getElementById('mods-list');
const searchInput = document.getElementById('search');
const toggleBtn = document.getElementById('toggle-btn');
const pageTitle = document.querySelector('h1');
const titleElement = document.querySelector('title');
const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
const selectAllCheckbox = document.getElementById('select-all-checkbox');

// 分类文本翻译数据
const categoryTranslations = {
    'Pals': { 'chinese': '伙伴', 'english': 'Pals' },
    'Gameplay': { 'chinese': '游戏玩法', 'english': 'Gameplay' },
    'Miscellaneous': { 'chinese': '其他', 'english': 'Miscellaneous' },
    'Weapons': { 'chinese': '武器', 'english': 'Weapons' },
    'User-Interface': { 'chinese': '用户界面', 'english': 'User Interface' },
    'Audio': { 'chinese': '声音', 'english': 'Audio' },
    'Characters': { 'chinese': '角色', 'english': 'Characters' },
    'Utilities': { 'chinese': '实用工具', 'english': 'Utilities' },
    'Visuals': { 'chinese': '视觉效果', 'english': 'Visuals' }
};

// 默认语言设置为中文
let language = 'chinese';

// 为每个分类复选框添加事件监听器
categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        updateSelectAllCheckboxState();
        renderMods(modsData);
    });
});

// 全选复选框事件监听器
selectAllCheckbox.addEventListener('change', () => {
    const isChecked = selectAllCheckbox.checked;
    categoryCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    renderMods(modsData);
});

// 切换语言按钮事件监听器
toggleBtn.addEventListener('click', () => {
    language = language === 'chinese' ? 'english' : 'chinese';
    renderMods(modsData);
    updateLanguage();
});

// 更新页面语言
function updateLanguage() {
    toggleBtn.textContent = language === 'chinese' ? '切换语言（英语/原始语言）' : 'Toggle Language (Chinese)';
    pageTitle.textContent = language === 'chinese' ? 'Mods 数据库' : 'Mods Database';
    titleElement.textContent = language === 'chinese' ? 'Mods 数据库' : 'Mods Database';
    searchInput.placeholder = language === 'chinese' ? '搜索...' : 'Search...';
    categoryCheckboxes.forEach(checkbox => {
        const value = checkbox.value;
        const textElement = checkbox.parentNode.querySelector('.category-text');
        if (textElement) {
            textElement.textContent = getCategoryTranslation(value);
        }
    });
    document.getElementById('select-all-text').textContent = language === 'chinese' ? '全选' : 'Select All';
}

// 渲染Mods列表
function renderMods(mods) {
    modsList.innerHTML = '';
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategories = Array.from(categoryCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    const filteredMods = mods.filter(mod =>
        (selectedCategories.length === 0 || selectedCategories.includes(mod.category)) &&
        (
            (mod.name_o && mod.name_o.toLowerCase().includes(searchTerm)) ||
            (mod.name_t && mod.name_t.toLowerCase().includes(searchTerm)) ||
            (mod.desc_o && mod.desc_o.toLowerCase().includes(searchTerm)) ||
            (mod.desc_t && mod.desc_t.toLowerCase().includes(searchTerm)) ||
            (mod.modid && mod.modid.includes(searchTerm)) ||
            isMatch(mod.category, searchTerm) ||
            isMatch(getCategoryTranslation(mod.category), searchTerm)
        )
    );

    if (filteredMods.length === 0) {
        const noContentElement = document.createElement('div');
        noContentElement.textContent = language === 'chinese' ? '没有找到相关内容。' : 'No content found.';
        modsList.appendChild(noContentElement);
    } else {
        filteredMods.forEach(mod => {
            const modElement = document.createElement('div');
            modElement.classList.add('mod', 'acrylic');
            modElement.innerHTML = `
                <h3>${language === 'chinese' ? (mod.name_t || 'Details not provided') : (mod.name_o || 'Details not provided')}</h3>
                <p><strong>${language === 'chinese' ? '分类' : 'Category'}:</strong> ${mod.category}（${getCategoryTranslation(mod.category)}）</p>
                <p><strong>${language === 'chinese' ? '更新时间' : 'Update Time'}:</strong> ${formatDate(mod.update)}</p>
                <p><strong>${language === 'chinese' ? '描述' : 'Description'}:</strong> ${language === 'chinese' ? (mod.desc_t || 'Details not provided') : (mod.desc_o || 'Details not provided')}</p>
                <p><strong>${language === 'chinese' ? '大小' : 'Size'}:</strong> ${mod.size || 'Details not provided'}</p>
                <p><strong>ModID:</strong> ${mod.modid || 'Details not provided'}</p>
            `;
            modElement.addEventListener('click', () => {
                showModal(mod);
            });
            modsList.appendChild(modElement);
        });
    }
}

// 显示模态框
function showModal(modData) {
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    const downloadText = language === 'chinese' ? '下载' : 'Download';
    const downloadLinkText = language === 'chinese' ? '链接' : 'link';
    const autoDownloadText = language === 'chinese' ? '自动下载' : 'Automatic Download';
    const manualDownloadText = language === 'chinese' ? '手动下载' : 'Manual Download';
    const thirdPartyDownloadText = language === 'chinese' ? '第三方下载' : 'Third-party Download';
    let autoDownloadLink = '';
    let manualDownloadLink = '';
    if (modData.share) {
        if (modData.key) {
            autoDownloadLink = `<a href="https://link.niganma.top/other/lz/lanzou.php/?type=down&pwd=${modData.key}&url=${modData.share}" target="_blank" rel="noopener noreferrer" class="download-link">${autoDownloadText}</a>`;
        } else {
            autoDownloadLink = `<a href="https://link.niganma.top/other/lz/lanzou.php/?type=down&url=${modData.share}" target="_blank" rel="noopener noreferrer" class="download-link">${autoDownloadText}</a>`;
        }
        manualDownloadLink = `<a href="https://wwf.lanzouo.com/${modData.share}" target="_blank" rel="noopener noreferrer" class="download-link">${manualDownloadText}</a>`;
    }
    const thirdPartyDownloadSection = modData.share ? `<p><strong>${thirdPartyDownloadText}:</strong> ${autoDownloadLink} ${manualDownloadLink}</p>` : '';
    const modalContent = `
        <h2>${language === 'chinese' ? modData.name_t : modData.name_o}</h2>
        <p><strong>${language === 'chinese' ? '分类' : 'Category'}:</strong> ${modData.category}（${getCategoryTranslation(modData.category)}）</p>
        <p><strong>${language === 'chinese' ? '更新时间' : 'Update Time'}:</strong> ${formatDate(modData.update)}</p>
        <p><strong>${language === 'chinese' ? '描述' : 'Description'}:</strong> ${language === 'chinese' ? (modData.desc_t || 'Details not provided') : (modData.desc_o || 'Details not provided')}</p>
        <p><strong>${language === 'chinese' ? '大小' : 'Size'}:</strong> ${modData.size || 'Details not provided'}</p>
        <p><strong>ModID:</strong> ${modData.modid || 'Details not provided'}</p>
        ${modData.modid ? `<p><strong>${downloadText}${language === 'chinese' ? '' : ' '}${downloadLinkText}:</strong> <a href="https://www.nexusmods.com/palworld/mods/${modData.modid}" target="_blank" rel="noopener noreferrer" class="download-link">https://www.nexusmods.com/palworld/mods/${modData.modid}</a></p>` : ''}
        ${thirdPartyDownloadSection}
    `;
    const modal = document.createElement('div');
    modal.classList.add('modal', 'acrylic');
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${modalContent}
        </div>
    `;
    modal.querySelector('.close').addEventListener('click', function () {
        modal.remove();
    });
    document.body.appendChild(modal);
}

// 将时间戳转换为所需的日期格式
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    if (language === 'chinese') {
        return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`;
    } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }
}

// 当页面加载时渲染Mods
window.addEventListener('DOMContentLoaded', () => {
    renderMods(modsData);
    updateLanguage();
});
// 搜索输入框事件监听器
searchInput.addEventListener('input', () => {
    renderMods(modsData);
});
// 判断是否匹配
function isMatch(value, searchTerm) {
    return value.toLowerCase().includes(searchTerm);
}
// 获取分类的翻译
function getCategoryTranslation(category) {
    return categoryTranslations[category]?.[language] || 'Details not provided';
}
// 更新全选复选框状态
function updateSelectAllCheckboxState() {
    const allChecked = Array.from(categoryCheckboxes).every(checkbox => checkbox.checked);
    const someChecked = Array.from(categoryCheckboxes).some(checkbox => checkbox.checked);
    if (allChecked) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else if (someChecked) {
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
    } else {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    }
}
// 返回顶部按钮的显示与隐藏以及点击事件处理
window.addEventListener('scroll', function () {
    var backToTopBtn = document.getElementById('back-to-top');
    if (window.pageYOffset > 100) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

document.getElementById('back-to-top').addEventListener('click', function () {
    scrollToTop(1000); // 1000 毫秒内返回顶部
});

// 平滑滚动至页面顶部函数
function scrollToTop(scrollDuration) {
    var scrollStep = -window.scrollY / (scrollDuration / 15);
    requestAnimationFrame(function smoothScroll() {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
            requestAnimationFrame(smoothScroll);
        }
    });
}