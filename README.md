
# 📝 Todo List Application

A modern, responsive Todo List application built with React and TypeScript. This application allows you to manage your daily tasks, categorize them, search through them, and keep track of your productivity.

![Todo List Screenshot](https://via.placeholder.com/800x450.png?text=Todo+List+App)

## ✨ Features

- ✅ Create, complete, and delete tasks
- 🔍 Search and filter tasks by category
- 📊 Statistics dashboard
- 🌗 Dark/Light mode toggle
- 📅 Organize tasks by date
- 📱 Responsive design
- 🤖 Telegram bot integration for task management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or fork it on Replit
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to the provided URL (by default, it will be available at the external URL provided by Replit)

## 🔧 Configuration

### API Integration

This application uses JSONBin.io to store todos. The API credentials are currently configured in `src/config/api.ts`.

### 🔐 Securing API Keys

Currently, API keys are hardcoded in the config file, which is not secure. To properly secure your API keys:

1. Use the Replit Secrets tool:
   - Go to the "Tools" panel in your Replit workspace
   - Select "Secrets"
   - Add your API keys as secrets (e.g., `JSONBIN_ID`, `JSONBIN_KEY`)

2. Update your code to use environment variables:

```typescript
// src/config/api.ts
export const API_CONFIG = {
  JSONBIN_ID: process.env.JSONBIN_ID"",
  JSONBIN_KEY: process.env.JSONBIN_KEY"",
  JSONBIN_URL: "https://api.jsonbin.io/v3/b",
};
```

## 🤖 Telegram Bot Integration

This project includes integration with a Telegram bot using n8n workflow templates, allowing you to:

- View your tasks from Telegram
- Add new tasks
- Mark tasks as complete
- Receive reminders

![Telegram Bot Integration](![image](https://github.com/user-attachments/assets/f01d0258-388b-44ac-bcc9-8974ab856256)
)

### Setting up the Telegram Bot

1. Create a new bot through BotFather on Telegram
2. Set up n8n with the provided template
3. Configure the webhook URL in your bot settings
4. Add your Telegram bot token to Replit Secrets

## 🧰 Tech Stack

- React
- TypeScript
- Vite
- Axios for API calls
- n8n for workflow automation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
