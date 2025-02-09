# CMS Admin System

一个基于 FireCMS 和 Firebase 构建的内容管理系统。

## 功能特性

- 📝 文章管理
  - 富文本编辑器支持
  - 文章封面上传
  - 中英文标题
  - 首页展示控制
  - 文章分类管理
  - 文章状态控制

- 🖼️ Banner管理
  - 图片上传
  - 排序控制
  - 时间控制
  - 链接管理

## 技术栈

- React
- TypeScript
- Firebase
  - Firestore
  - Storage
  - Authentication
- FireCMS
- React Quill

## 开始使用

1. 克隆项目


```

bash
git clone [your-repository-url]
cd [your-project-name]


```


2. 安装依赖
```

bash
yarn install
```


3. 配置环境变量
复制 `.env.template` 文件并重命名为 `.env`，填入你的 Firebase 配置信息：
env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

4. 启动开发服务器

```
bash
yarn dev
```


5. 构建生产版本


```
bash
yarn build
```

## 项目结构


src/
├── collections/ # 集合配置
│ ├── articles.tsx # 文章集合
│ └── banner.tsx # Banner集合
├── firebase_config.ts # Firebase配置
├── App.tsx # 主应用组件
└── main.tsx # 入口文件


## 部署

1. 确保你已经安装了 Firebase CLI

```
bash
npm install -g firebase-tools
```
2. 登录 Firebase

```
bash
firebase login
```


3. 初始化 Firebase 项目


```
bash
firebase init
```

4. 部署到 Firebase


```
bash
firebase deploy
```




## 贡献

欢迎提交 Pull Request 和 Issue。

## 许可

[MIT License](LICENSE)