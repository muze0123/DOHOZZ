const fs = require('fs');

let content = fs.readFileSync('src/views/Dashboard.vue', 'utf-8');

// 1. Remove all menu dividers
content = content.replace(/<div class="menu-divider"><\/div>\n\s*/g, '');

// 2. Replace the chunk from "找达人" to "达人榜单" closing tag.
const oldMenuChunk = `          <div class="menu-item has-submenu">
            <div class="menu-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
              </svg>
            </div>
            <span>找达人</span>
            <div class="submenu-arrow"></div>
          </div>
          <div class="menu-item selected">
            <div class="menu-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span>达人库</span>
          </div>
          <div class="menu-item">
            <div class="menu-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
            <span>商品找达人</span>
          </div>
          <div class="menu-item">
            <div class="menu-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span>智能推荐达人</span>
          </div>
          <div class="menu-item">
            <div class="menu-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </div>
            <span>达人榜单</span>
            <span class="new-tag">New</span>
          </div>`;

const newMenuChunk = `          <div class="menu-item has-submenu" @click="talentMenuOpen = !talentMenuOpen">
            <div class="menu-icon">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z"/>
              </svg>
            </div>
            <span>找达人</span>
            <div class="submenu-arrow" :style="{ transform: talentMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }"></div>
          </div>
          
          <div class="submenu-container" v-show="talentMenuOpen">
            <div class="menu-item submenu-item">
              <span>达人库</span>
              <span class="new-tag">New</span>
            </div>
            <div class="menu-item submenu-item">
              <span>智能推荐达人</span>
              <span class="new-tag">New</span>
            </div>
            <div class="menu-item submenu-item">
              <span>商品找达人</span>
              <span class="new-tag">New</span>
            </div>
            <div class="menu-item submenu-item">
              <span>达人榜单</span>
              <span class="new-tag">New</span>
            </div>
          </div>`;

if (content.indexOf(oldMenuChunk) !== -1) {
    content = content.replace(oldMenuChunk, newMenuChunk);
} else {
    console.log("Could not find oldMenuChunk. Proceeding anyway.");
}

// 3. User Info layout
const userInfoTarget = `<div class="user-details">
                <div class="user-name">{{ userInfo.name }}</div>
                <div class="user-role">{{ userInfo.department }} | {{ userInfo.role }}</div>
                <div class="user-tenure">
                  <span class="tenure-text">您已加入公司 </span>
                  <span class="tenure-value">{{ userInfo.tenure }}</span>
                  <span class="tenure-text"> 天</span>
                </div>
              </div>`;

const userInfoReplace = `<div class="user-details">
                <div class="user-name">
                  {{ userInfo.name }}
                  <span class="inline-tenure">您已加入公司 <span style="color: #0064E0; font-weight: bold;">{{ userInfo.tenure }}</span> 天</span>
                </div>
                <div class="user-role">{{ userInfo.department }} | {{ userInfo.role }}</div>
              </div>`;

if (content.indexOf(userInfoTarget) !== -1) {
    content = content.replace(userInfoTarget, userInfoReplace);
} else {
    console.log("Could not find userInfoTarget. Proceeding anyway.");
}

// 4. JS Script modifications
const scriptTarget = "const notifTab = ref('reminder')\n";
const scriptInsert = `const notifTab = ref('reminder')\nconst talentMenuOpen = ref(false)\n`;
if (content.indexOf("talentMenuOpen") === -1) {
    content = content.replace(scriptTarget, scriptInsert);
}

const userInfoJsTarget = `const userInfo = reactive({
  name: '张三',
  tenure: 260,
  department: '部门名称XXX',
  role: '角色名称XXX'
})`;

const userInfoJsReplace = `const joinDateStr = '2025-01-01'
const diffTime = Math.abs(new Date() - new Date(joinDateStr))
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

const userInfo = reactive({
  name: '张三',
  tenure: diffDays,
  department: '部门名称XXX',
  role: '角色名称XXX'
})`;
if (content.indexOf(userInfoJsTarget) !== -1) {
    content = content.replace(userInfoJsTarget, userInfoJsReplace);
}

// 5. CSS modifications
const menuCssTarget = `.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: $secondary-text;
  cursor: pointer;
  font-size: 13px;
  transition: all $transition-fast;
  position: relative;

  &:hover {
    background: rgba($meta-blue, 0.05);
    color: $primary-text;
  }

  &.active, &.selected {
    background: rgba($meta-blue, 0.1);
    color: $meta-blue;

    .menu-icon {
      color: $meta-blue;
    }
  }`;

const menuCssReplace = `.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  color: $secondary-text;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  margin: 2px 8px;
  border-radius: 8px;

  &:hover {
    background: #f0f5ff;
    color: $meta-blue;
    transform: translateX(4px);
  }
  
  &:active {
    transform: scale(0.98);
  }

  &.active, &.selected {
    background: #e6f0ff;
    color: $meta-blue;
    font-weight: 600;

    &::before {
      content: '';
      position: absolute;
      left: -8px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: $meta-blue;
      border-radius: 0 4px 4px 0;
    }

    .menu-icon {
      color: $meta-blue;
    }
  }

  .submenu-arrow {
    margin-left: auto;
    width: 0;
    height: 0;
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-left: 4px solid currentColor;
    transition: transform 0.3s ease;
  }`;

if (content.indexOf(menuCssTarget) !== -1) {
    content = content.replace(menuCssTarget, menuCssReplace);
}

// Ensure extra styles are added
const cssGlobalExtraTarget = `// 中间层布局
.middle-layout {`;
const fallbackTarget = `// 主内容区\n.main-content {`;

const extraStyles = `.submenu-container {
  display: flex;
  flex-direction: column;
  padding-left: 36px;
  margin-bottom: 8px;
}

.submenu-item {
  padding: 8px 16px;
  margin: 2px 0 2px 8px;
  font-size: 13px;
  border-radius: 6px;
  position: relative;
  
  &::before {
    display: none !important; /* cancel the active left border for submenus */
  }
  
  &:hover {
    transform: translateX(2px);
  }
}

.inline-tenure {
  font-size: 12px;
  color: #65676B;
  background: rgba(0, 100, 224, 0.08);
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
  font-weight: normal;
}

`;

if (content.indexOf('.submenu-container {') === -1) {
    if (content.indexOf(cssGlobalExtraTarget) !== -1) {
        content = content.replace(cssGlobalExtraTarget, extraStyles + cssGlobalExtraTarget);
    } else if (content.indexOf(fallbackTarget) !== -1) {
         content = content.replace(fallbackTarget, extraStyles + fallbackTarget);
    }
}

// Clean up extraneous .submenu-arrow styling left from original code if any right after menuCssReplace
// It is handled by not replacing too much but modifying the block locally. Actually, the original css had specific block for .submenu-arrow that was inside .menu-item. Our regex replaced it properly.

fs.writeFileSync('src/views/Dashboard.vue', content);
console.log('Update Script Completed successfully');
