# 🎯 Easy Task Customization Guide

Want to customize the AI automation for your specific use case? You're in the right place! This guide makes it super simple.

## 📁 **Main File to Edit**

Everything you need to customize is in **one file**:
```
src/config/automation-tasks.ts
```

## 🚀 **Quick Start - 3 Steps**

### **Step 1: Open the config file**
```bash
# Navigate to the task configuration
open src/config/automation-tasks.ts
```

### **Step 2: Customize app branding and tasks**
```typescript
// 🎨 First, customize your app branding
export const APP_CONFIG: AppConfig = {
  title: "Your App Name",
  description: "What your app does",
  instructions: {
    simple: "Simple mode instructions for users",
    advanced: "Advanced mode instructions"
  },
  examples: [
    "Example request 1",
    "Example request 2",
    "https://example.com"
  ],
  branding: {
    companyName: "Your Company",
    tagline: "Your tagline here"
  }
}

// 🤖 Then, add your custom automation task
export const MY_CUSTOM_AUTOMATION: TaskConfig = {
  id: 'my-custom-automation',
  name: 'My Custom Automation',
  description: 'What this automation focuses on',
  
  // 📝 This is the main prompt - customize this!
  prompt: `Automate "{companyName}"{websiteContext}. Focus on:

1. **Your Automation Area 1**: What you want to automate
2. **Your Automation Area 2**: Additional focus areas  
3. **Data Collection**: What specific data to gather
4. **Output Format**: How to save and present findings

🎯 **Instructions for the AI:**
- Be thorough and factual
- Focus on [YOUR SPECIFIC REQUIREMENTS]
- Save findings to [YOUR PREFERRED FORMATS]`,

  // 🌐 Websites the AI can visit (add your data sources!)
  allowedDomains: [
    'your-data-source.com',
    'industry-database.com',
    'news-source.com',
    'google.com',
    'bing.com'
  ],
  
  maxSteps: 100,        // How many automation steps max
  llmModel: 'gpt-4o'    // AI model to use
}
```

### **Step 3: Update the available tasks list**
```typescript
// Add your task to the AVAILABLE_TASKS object
export const AVAILABLE_TASKS = {
  'startup-analysis': STARTUP_ANALYSIS,
  'vc-analysis': VC_ANALYSIS,
  'my-custom-automation': MY_CUSTOM_AUTOMATION,  // ✅ Add this line
  // ... other tasks
} as const

// Optionally, make it the default task
export const DEFAULT_TASK = MY_CUSTOM_AUTOMATION
```

## 🎨 **Customization Examples**

### **Legal Research Task**
```typescript
export const LEGAL_RESEARCH: TaskConfig = {
  id: 'legal-research',
  name: 'Legal Research',
  description: 'Research legal cases, regulations, and compliance',
  prompt: `Research legal information for "{companyName}". Focus on:
  
1. **Regulatory Compliance**: Industry regulations and requirements
2. **Legal Cases**: Any litigation, patents, or legal issues
3. **Compliance Status**: Current compliance standing
4. **Risk Assessment**: Potential legal risks and considerations`,

  allowedDomains: [
    'sec.gov',
    'patents.uspto.gov', 
    'google.com',
    'justia.com',
    'law.com'
  ],
  maxSteps: 80,
  llmModel: 'gpt-4o'
}
```

### **Sales Intelligence Task**
```typescript
export const SALES_INTELLIGENCE: TaskConfig = {
  id: 'sales-intelligence',
  name: 'Sales Intelligence',
  description: 'Research prospects for sales outreach',
  prompt: `Research sales intelligence for "{companyName}". Focus on:
  
1. **Company Profile**: Size, revenue, recent growth
2. **Decision Makers**: Key contacts, leadership team
3. **Tech Stack**: Current tools and technologies used
4. **Pain Points**: Challenges and potential needs
5. **Recent Events**: Funding, hiring, news that indicates opportunity`,

  allowedDomains: [
    'linkedin.com',
    'crunchbase.com',
    'builtwith.com',
    'techcrunch.com',
    'google.com'
  ],
  maxSteps: 120,
  llmModel: 'gpt-4o'
}
```

### **Academic Research Task**
```typescript
export const ACADEMIC_RESEARCH: TaskConfig = {
  id: 'academic-research',
  name: 'Academic Research',
  description: 'Research academic papers and scholarly work',
  prompt: `Research academic information about "{companyName}". Focus on:
  
1. **Published Research**: Academic papers, publications
2. **Patents**: Intellectual property and innovations
3. **Academic Partnerships**: University collaborations
4. **Scholarly Impact**: Citations, research influence`,

  allowedDomains: [
    'scholar.google.com',
    'arxiv.org',
    'researchgate.net',
    'ieee.org',
    'acm.org'
  ],
  maxSteps: 100,
  llmModel: 'claude-sonnet-4-20250514'  // Claude is great for academic content
}
```

## 🔧 **Advanced Features**

### **Structured Output (for specific data extraction)**
```typescript
structuredOutput: {
  type: 'object',
  properties: {
    company_name: { type: 'string' },
    key_metrics: { 
      type: 'array', 
      items: { type: 'string' } 
    },
    risk_score: { type: 'number' }
  }
}
```

### **Different AI Models**
```typescript
llmModel: 'gpt-4o'                    // Best for general research
llmModel: 'claude-sonnet-4-20250514'  // Great for analysis/writing
llmModel: 'gemini-2.5-flash'         // Fast and efficient
llmModel: 'gpt-4o-mini'              // Cost-effective option
```

### **Step Limits**
```typescript
maxSteps: 50   // Quick research
maxSteps: 100  // Standard research  
maxSteps: 200  // Deep research (max allowed)
```

## 🎯 **Setting Default Task**

To change which task runs by default:
```typescript
// Change this line to your preferred default
export const DEFAULT_TASK = MY_CUSTOM_AUTOMATION  // Instead of STARTUP_ANALYSIS
```

## 🔄 **Testing Your Task**

1. **Save your changes** to `automation-tasks.ts`
2. **Restart the development server**: `yarn dev`
3. **Start a task** to test your new automation
4. **Check the browser console** for debug logs
5. **Iterate and improve** based on results

## 📚 **Tips for Great Tasks**

### **✅ DO:**
- Be specific about what data to collect
- Include clear instructions for the AI
- List relevant data sources in allowedDomains
- Test with real companies to refine prompts

### **❌ DON'T:**
- Make prompts too long (AI has context limits)
- Include domains the AI can't access
- Forget to add your task to AVAILABLE_TASKS
- Set maxSteps too high (expensive and slow)

## 🆘 **Need Help?**

- **Check existing tasks** in the config file for examples
- **Look at the console logs** when testing
- **Start simple** and add complexity gradually
- **Test frequently** with different company names

## 🚀 **Ready to Ship?**

Once you've customized your task:
1. Update the README with your use case
2. Modify the sidebar branding if needed
3. Deploy and share with your team!

---

## 🎨 **App Branding & Configuration**

The platform now includes centralized app configuration! Customize your app's title, description, and branding in one place:

```typescript
// Edit src/config/automation-tasks.ts
export const APP_CONFIG: AppConfig = {
  title: "Your Custom App Name",
  description: "What your automation platform does",
  instructions: {
    simple: "Chat instructions for simple mode",
    advanced: "Form instructions for advanced mode"
  },
  examples: [
    "Analyze Tesla",
    "Research competitor pricing",
    "https://example.com"
  ],
  branding: {
    companyName: "Your Company",
    tagline: "Your automation tagline"
  }
}
```

### **UI Mode Configuration**
Set your preferred interface style:
```env
# In .env.local
NEXT_PUBLIC_UI_MODE=simple    # Clean chatbot interface
NEXT_PUBLIC_UI_MODE=advanced  # Full dashboard with tabs
```

**Happy customizing! 🎉 Your AI automation agent is now tailored to your exact needs.** 