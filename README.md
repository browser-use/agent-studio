# 🤖 Agent Studio - AI Research Demo Platform

A comprehensive Next.js template for creating AI web automation agent demos. This platform showcases AI agents in action, specifically designed for startup research, funding analysis, and competitive intelligence.

## ✨ Features

### 🎯 Core Platform
- **Professional UI**: Dark theme with cyan accents and modern design
- **Real-time Progress**: Live updates with step-by-step execution tracking
- **3-Tab Interface**: Overview, Steps & Screenshots, Files & Downloads
- **Responsive Design**: Mobile-friendly layout with professional aesthetics

### 📊 Demo Capabilities
- **Startup Analysis**: Company discovery, funding analysis, team research
- **Visual Documentation**: Screenshot capture at each automation step
- **File Generation**: PDF reports, Excel data, JSON exports, ZIP archives
- **Progress Tracking**: Real-time status indicators and timing metrics

### 🔧 Technical Features
- **Next.js 14**: App Router with TypeScript support
- **Dual UI Modes**: Simple chatbot or advanced dashboard interface
- **Tailwind CSS**: Utility-first styling with custom design system
- **Context Management**: Global state for task progress and results
- **Centralized Config**: Single-file customization for branding and tasks
- **Easy Customization**: Modular architecture for different use cases

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and Yarn
- Modern web browser
- Browser Use API key ([Get yours here](https://docs.browser-use.com))

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd agent-studio
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   yarn install
   \`\`\`

3. **Configure environment**
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local and add your Browser Use API key
   \`\`\`

4. **Start development server**
   \`\`\`bash
   yarn dev
   \`\`\`

5. **Choose UI Mode** (optional)
   - **Simple Mode**: Clean chatbot interface for end-users
   - **Advanced Mode**: Full dashboard with tabs and detailed controls
   ```bash
   # Add to .env.local
   NEXT_PUBLIC_UI_MODE=simple    # or "advanced" (default)
   ```

6. **Open in browser**
   Navigate to \`http://localhost:3000\`

7. **Customize for your use case** (optional)
   See [TASK_CUSTOMIZATION.md](TASK_CUSTOMIZATION.md) for easy task setup

## 🎮 Demo Usage

### Simple Mode (Chatbot Interface)
1. **Type your request** - "Analyze OpenAI" or provide a website URL
2. **Watch real-time progress** - See step-by-step automation status
3. **Get results** - Receive analysis summary and downloadable files

### Advanced Mode (Dashboard Interface)  
1. **Enter Target Details**
   - Company name (required)
   - Website URL (optional)

2. **Start Automation**
   - Click "Start Task" button
   - Watch real-time progress in sidebar
   - Monitor step completion with timestamps

3. **View Results**
   - **Overview Tab**: Executive summary and key metrics
   - **Steps Tab**: Timeline view with screenshots
   - **Files Tab**: Generated reports and downloads

## 🎯 **Quick Customization**

Want to customize for your specific use case? It's super easy!

**One file to edit**: `src/config/automation-tasks.ts`

```typescript
// Just modify this file to create your custom automation tasks!
export const YOUR_AUTOMATION: TaskConfig = {
  id: 'your-automation',
  name: 'Your Automation Type', 
  prompt: 'Your custom automation instructions...'
}
```

📖 **[Full Customization Guide →](TASK_CUSTOMIZATION.md)**

## 🔄 Easy Customization Guide

### 🎯 **Quick Task Customization**

**Step 1: Edit the task configuration file**
```bash
# Open the main task config file
src/config/automation-tasks.ts
```

**Step 2: Modify or add your automation task**
```typescript
export const YOUR_AUTOMATION: TaskConfig = {
  id: 'your-automation',
  name: 'Your Automation Type',
  description: 'What your automation focuses on',
  prompt: `Analyze "{companyName}" focusing on:
  1. Your specific research areas
  2. Data sources you want to use
  3. Output format requirements`,
  allowedDomains: [
    'your-data-source.com',
    'another-source.com'
  ],
  maxSteps: 100,
  llmModel: 'gpt-4.1'
}
```

**Step 3: That's it! 🎉**
- Your new task is automatically available
- No code changes needed elsewhere
- Just restart the app to see changes

### 📋 **Available Task Templates**

The platform includes ready-to-use tasks:

- **🚀 Startup Analysis** (default) - Funding, team, market analysis
- **🏦 VC Analysis** - Fund analysis, portfolio, investment thesis  
- **🏢 Competitor Analysis** - Direct competitors, pricing, positioning
- **📊 Market Analysis** - Market size, trends, opportunities

### 🛠️ **Advanced Customization**

1. **Custom Branding**
   ```tsx
   // src/components/Sidebar.tsx - Line 30
   <h1>Your Company Name</h1>
   <h2>Your Use Case</h2>
   ```

2. **Custom File Types**
   ```typescript
   // src/context/TaskContext.tsx
   type: 'pdf' | 'excel' | 'json' | 'zip' | 'image' | 'your-type'
   ```

3. **Additional Data Sources**
   ```typescript
   // Just add domains to allowedDomains in automation-tasks.ts
   allowedDomains: ['new-source.com', 'api-provider.com']
   ```

## 📁 Project Structure

\`\`\`
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── tabs/             # Tab content components
│   ├── MainContent.tsx   # Main area with tabs
│   ├── ProgressSection.tsx
│   └── Sidebar.tsx       # Left sidebar
├── context/              # React context
│   └── TaskContext.tsx
└── hooks/                # Custom hooks
    └── useTaskExecution.ts
\`\`\`

## 🎨 Design System

### Colors
- **Primary**: #00d4ff (Cyan)
- **Dark Backgrounds**: #1a1a1a, #2a2a2a, #3a3a3a
- **Text**: White, grays for secondary content

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners, dark backgrounds, subtle borders
- **Buttons**: Primary cyan, hover states, disabled states
- **Progress**: Animated indicators, status colors

## 📊 Mock Data Structure

The platform includes realistic mock data for:
- Company research steps (6 phases)
- Generated files (PDF, Excel, JSON, ZIP)
- Progress timing and screenshots
- Executive summary with key metrics

## 🔗 Browser Use API Integration

This platform is now fully integrated with [Browser Use API](https://docs.browser-use.com/api-reference/run-task) for real web automation:

### ✅ **Implemented Features**
- **Task Creation**: Automatically creates automation tasks via `/api/v1/run-task`
- **Real-time Polling**: Monitors task progress via `/api/v1/task/{taskId}`
- **File Downloads**: Retrieves generated files via `/api/v1/task/{taskId}/output-file/{fileName}`
- **Screenshot Capture**: Displays actual browser screenshots from automation
- **Structured Output**: Parses JSON results into readable analysis summaries

### 📋 **API Configuration**
\`\`\`env
BROWSER_USE_API_KEY=your_api_key_here
\`\`\`

### 🎯 **Analysis Capabilities**
The platform automatically analyzes:
- Company discovery and basic information
- Funding rounds and investor data
- Team composition and leadership
- Market analysis and competitive landscape
- Generated files (PDF reports, Excel data, JSON exports)

### 🔄 **Future Integration Points**
- **OpenAI/Anthropic**: Enhanced LLM processing
- **File Storage**: AWS S3, Google Drive integration
- **Analytics**: Usage tracking and metrics
- **Webhooks**: Real-time notifications

## 🚢 Deployment

### Vercel (Recommended)
\`\`\`bash
yarn build
# Deploy to Vercel
\`\`\`

### Docker
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the code comments and examples
- **Issues**: Open GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub discussions for questions

---

**Built with ❤️ for the AI automation community**