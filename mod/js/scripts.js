var modsContainer = document.querySelector('.mods');
var modalContent = document.getElementById('modalContent');
var modal = document.getElementById('myModal');
var body = document.querySelector('body');
var originalModsData = [];
var refreshButton = document.getElementById('refreshButton');

// Function to create mod element
function createModElement(mod) {
    // Create a div element
    var modElement = document.createElement('div');
    modElement.classList.add('mod');
    var category = mod.category;
    // Populate the div with mod data
    modElement.innerHTML = `
        <h2 style="text-align: center;">${mod.name_t}</h2>
        <p><strong>类别：</strong><span class="category">${category}</span></p>
        <p><strong>大小：</strong>${mod.size}</p>
        <p><strong>更新时间：</strong>${new Date(mod.update * 1000).toLocaleDateString()}</p>
        <p><strong>描述：</strong>${mod.desc_t ? mod.desc_t : '暂无描述'}</p>
    `;
    // Add event listeners
    modElement.addEventListener('mouseenter', function () {
        modElement.classList.add('highlight');
        modElement.setAttribute('title', "查看详情");
    });
    modElement.addEventListener('mouseleave', function () {
        modElement.classList.remove('highlight');
        modElement.removeAttribute('title');
    });
    modElement.addEventListener('click', function () {
        displayModal(mod);
    });
    return modElement;
}

// Function to refresh mod list
function refreshModList(mods) {
    modsContainer.innerHTML = '';
    mods.forEach(function (mod) {
        var modElement = createModElement(mod);
        modsContainer.appendChild(modElement);
    });
}

// Function to search mods
function searchMods() {
    var input, filter;
    input = document.getElementById('searchInput');
    filter = input.value.trim().toUpperCase().replace(/\s+/g, '');
    var filteredMods = modsData.filter(function (mod) {
        for (var key in mod) {
            if (mod.hasOwnProperty(key) && typeof mod[key] === 'string') {
                var fieldValue = mod[key].trim().toUpperCase().replace(/\s+/g, '');
                if (fieldValue && fieldValue.includes(filter)) {
                    return true;
                }
            }
        }
        return false;
    });
    if (filter === "") {
        filteredMods = shuffle(modsData).slice(0, 21);
    }
    refreshModList(filteredMods);
}

// Function to display modal
function displayModal(mod) {
    var sharelink = '';
    var directlink = '';
    var enjoylink = 'https://www.ilanzou.com/s/1pckN8A';
    var matchedShareData = shareData.find(data => data.getid === mod.modid);
    if (matchedShareData) {
        sharelink = `https://wwf.lanzouo.com/${matchedShareData.url}`;
        if (matchedShareData.key) {
            directlink = `https://api.hanximeng.com/lanzou/?url=https://wwf.lanzouo.com/${matchedShareData.url}&type=down&pwd=${matchedShareData.key}`;
        } else {
            directlink = `https://api.hanximeng.com/lanzou/?url=https://wwf.lanzouo.com/${matchedShareData.url}&type=down`;
        }
    }
    modalContent.innerHTML = `
        <h2 style="text-align: center;">${mod.name_t}</h2>
        <p><strong>原文名称：</strong>${mod.name_o}</p>
        <p><strong>类别：</strong>${mod.category}</p>
        <p><strong>机翻描述：</strong>${mod.desc_t ? mod.desc_t : '暂无描述'}</p>
        <p><strong>原文描述：</strong>${mod.desc_o ? mod.desc_o : '暂无描述'}</p>
        <p><strong>更新时间：</strong>${new Date(mod.update * 1000).toLocaleDateString()}</p>
        <p><strong>大小：</strong>${mod.size}</p>
        <p><strong>Mod ID：</strong>${mod.modid}</p>
        ${directlink ? `<p><strong>蓝奏云解析：</strong><a href="${directlink}" target="_blank">点击下载</a></p>` : ''}
        ${sharelink ? `<p><strong>蓝奏云分享链接：</strong><a href="${sharelink}" target="_blank">点击下载</a></p>` : ''}
        ${matchedShareData ? `<p><strong>蓝奏云优享版下载：</strong><a href="${enjoylink}" target="_blank">点击下载</a></p>` : ''}
        <p><strong>Nexus Mods下载：</strong><a href="https://www.nexusmods.com/palworld/mods/${mod.modid}" target="_blank">https://www.nexusmods.com/palworld/mods/${mod.modid}</a></p>
    `;
    modal.style.display = "block";
    body.style.overflow = 'hidden';
    refreshButton.style.display = 'none';
}

// Function to close modal
function closeModal() {
    modal.style.display = "none";
    body.style.overflow = '';
    refreshButton.style.display = 'block'; 
}

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Function to rotate refresh button icon
function rotateIcon() {
    var icon = document.querySelector('.floating-btn img');
    icon.style.transition = "transform 0.5s ease-in-out";
    icon.style.transform += "rotate(-180deg)";
    setTimeout(function () {
        icon.style.transition = "none";
        icon.style.transform = "rotate(0deg)";
        searchMods(); 
    }, 500);
}

// Function to shuffle array
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Initial loading of mods
shuffle(modsData).slice(0, 21).forEach(function (mod) {
    var modElement = createModElement(mod);
    modsContainer.appendChild(modElement);
    originalModsData.push(mod);
});

// Add tooltip for refresh button
var refreshBtn = document.querySelector('.floating-btn');
refreshBtn.addEventListener('mouseenter', function () {
    refreshBtn.title = "点击刷新模组列表";
});
refreshBtn.addEventListener('mouseleave', function () {
    refreshBtn.removeAttribute('title');
});