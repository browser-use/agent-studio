# Browser Use API Integration Setup

This guide walks you through setting up the AI Agent Demo Platform with real Browser Use API integration.

## 🔑 Getting Your Browser Use API Key

1. **Sign up for Browser Use**
   - Visit [Browser Use Cloud](https://cloud.browser-use.com/)
   - Create an account or sign in
   - Navigate to your dashboard

2. **Generate API Key**
   - Go to API settings or profile section
   - Generate a new API key
   - Copy the key securely

3. **Check Your Subscription**
   - Ensure you have an active subscription
   - The platform requires API access for task creation

## ⚙️ Environment Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local` with your configuration:**
   ```env
   # Required: Browser Use API Key
   BROWSER_USE_API_KEY=bu_live_your_actual_api_key_here
   
   # UI Mode: "simple" for chatbot view, "advanced" for dashboard view
   NEXT_PUBLIC_UI_MODE=advanced
   
   # Optional: Customize API endpoints
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## 🚀 Running the Application

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start development server:**
   ```bash
   yarn dev
   ```

3. **Test the integration:**
   - Open http://localhost:3000
   - **Simple Mode**: Type "Analyze OpenAI" in the chat
   - **Advanced Mode**: Enter company name and click "Start Task"
   - Watch real automation in action!

## 🔍 How It Works

### 1. **Task Creation**
When you click "Start Task", the platform:
- Calls `/api/task/start` endpoint
- Creates a Browser Use task with structured prompts
- Configures allowed domains and automation settings
- Returns a task ID for tracking

### 2. **Real-time Monitoring**
The application automatically:
- Polls `/api/task/status/{taskId}` every 3 seconds
- Updates progress indicators and step status
- Displays live screenshots from browser automation
- Shows task completion status

### 3. **File Processing**
When task completes:
- Retrieves list of generated files
- Downloads file URLs via `/api/task/files/{taskId}/{fileName}`
- Makes files available for download and preview
- Processes structured output into readable summaries

## 📊 Understanding the Analysis Process

The platform performs comprehensive startup analysis:

### **Analysis Steps:**
1. **Initialize Task** - Sets up browser automation
2. **Company Discovery** - Finds basic company information
3. **Funding Analysis** - Researches investment data
4. **Team Research** - Analyzes leadership and personnel
5. **Market Position** - Evaluates competitive landscape
6. **Generate Report** - Compiles comprehensive findings

### **Data Sources:**
- Crunchbase (funding and company data)
- LinkedIn (team and leadership info)
- PitchBook (investment details)
- TechCrunch, Bloomberg, Forbes (news and analysis)
- Company websites and SEC filings

### **Generated Files:**
- **JSON**: Structured company and market data
- **Excel/CSV**: Funding rounds and financial data
- **PDF**: Comprehensive research reports
- **Screenshots**: Visual documentation of research process

## 🛠️ Customization Options

### **Modify Analysis Scope**
Edit `src/app/api/task/start/route.ts` to customize:
- Analysis instructions and prompts
- Allowed domains for web scraping
- LLM model selection (GPT-4o, Claude, Gemini)
- Maximum automation steps
- Screenshot and file generation settings

### **Add New Automation Types**
1. Update task steps in `src/context/TaskContext.tsx`
2. Modify API prompts in the start route
3. Customize file processing logic
4. Update UI components for new data types

### **Integration with Other APIs**
Extend the platform by:
- Adding new data sources to allowed domains
- Implementing custom file processors
- Integrating additional AI models
- Adding webhook notifications

## 🐛 Troubleshooting

### **Common Issues:**

1. **"API key not configured" error**
   - Ensure `BROWSER_USE_API_KEY` is set in `.env.local`
   - Verify the API key is valid and active
   - Check your Browser Use subscription status

2. **Task fails to start**
   - Verify internet connection
   - Check Browser Use API status
   - Ensure sufficient API credits/quota

3. **Files not downloading**
   - Check browser popup blockers
   - Verify file URLs are accessible
   - Ensure CORS settings allow downloads

4. **Polling stops unexpectedly**
   - Check browser console for errors
   - Verify API endpoints are responding
   - Restart the development server

### **Debug Mode:**
Enable detailed logging by adding to `.env.local`:
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

## 📈 Production Deployment

### **Environment Variables for Production:**
```env
BROWSER_USE_API_KEY=your_production_api_key
NEXT_PUBLIC_UI_MODE=advanced
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### **Recommended Settings:**
- Use environment-specific API keys
- Configure proper CORS settings
- Set up error monitoring (Sentry, etc.)
- Implement rate limiting for API calls
- Add authentication for sensitive demos

## 🔒 Security Considerations

- **Never expose API keys in client-side code**
- **Use environment variables for all sensitive data**
- **Implement proper error handling to avoid key leaks**
- **Consider IP restrictions for production API keys**
- **Monitor API usage and set up alerts**

## 📚 Additional Resources

- [Browser Use API Documentation](https://docs.browser-use.com/)
- [Browser Use Examples](https://github.com/browser-use/browser-use)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Environment Variables in Next.js](https://nextjs.org/docs/basic-features/environment-variables)

## 🆘 Support

If you encounter issues:

1. **Check the Browser Use API status page**
2. **Review API documentation for updates**
3. **Open an issue in this repository**
4. **Contact Browser Use support for API-related problems**

---

**Ready to see AI web automation in action? Start your research now!** 🚀 