// 🎯 AUTOMATION TASK CONFIGURATION
// Easy customization for different use cases - just edit the tasks below!

export interface AppConfig {
  title: string
  description: string
  instructions: {
    simple: string
    advanced: string
  }
  examples: string[]
  branding: {
    companyName: string
    tagline: string
  }
}

export interface TaskConfig {
  id: string
  name: string
  description: string
  prompt: string
  allowedDomains?: string[]
  maxSteps?: number
  llmModel?: 'gpt-4o' | 'gpt-4o-mini' | 'claude-sonnet-4-20250514' | 'gemini-2.5-flash'
  structuredOutput?: object
}

// 🚀 STARTUP ANALYSIS TASK (Default)
export const STARTUP_ANALYSIS: TaskConfig = {
  id: 'startup-analysis',
  name: 'Startup Analysis',
  description: 'Comprehensive startup analysis including funding, team, and market research',
  prompt: `Analyze the startup company "{companyName}"{websiteContext}. Please conduct comprehensive analysis including:

🔍 **Analysis Steps:**
1. **Company Discovery**: Find basic company information, founding details, and web presence
2. **Funding Analysis**: Research funding rounds, investors, valuations, and financial data from Crunchbase, PitchBook
3. **Team Research**: Analyze leadership team, key personnel, and organizational structure via LinkedIn
4. **Market Position**: Evaluate competitive landscape, market size, and positioning
5. **News & Updates**: Find recent news, press releases, and market mentions
6. **Generate Report**: Compile findings into comprehensive research report

📊 **Data to Collect:**
- Company overview (founded, headquarters, industry, description)
- Funding details (total raised, rounds, investors, valuations)
- Team composition (leadership, key executives, team size)
- Market analysis (competitors, market size, competitive advantage)
- Recent news and developments

💾 **Save Findings To:**
- Company overview and basic info (JSON format)
- Funding data with investor details (CSV/Excel format)
- Team composition and leadership profiles (JSON format)
- Market analysis and competitive data (JSON format)
- Final comprehensive research report (PDF or structured text)
- Screenshots of key findings for documentation

🎯 **Focus Areas:**
- Be thorough and factual
- Cross-reference information from multiple sources
- Include specific numbers, dates, and details when available
- Take screenshots of important data sources`,

  maxSteps: 150,
  llmModel: 'gpt-4o',
  structuredOutput: {
    type: 'object',
    properties: {
      company_overview: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          founded: { type: 'string' },
          headquarters: { type: 'string' },
          industry: { type: 'string' },
          description: { type: 'string' },
          website: { type: 'string' },
          employee_count: { type: 'string' }
        }
      },
      funding_summary: {
        type: 'object',
        properties: {
          total_funding: { type: 'string' },
          last_round: { type: 'string' },
          last_round_amount: { type: 'string' },
          investors: { type: 'array', items: { type: 'string' } },
          valuation: { type: 'string' },
          funding_date: { type: 'string' }
        }
      },
      team_summary: {
        type: 'object',
        properties: {
          team_size: { type: 'string' },
          leadership: { type: 'array', items: { type: 'string' } },
          key_executives: { type: 'array', items: { type: 'string' } },
          founders: { type: 'array', items: { type: 'string' } }
        }
      },
      market_analysis: {
        type: 'object',
        properties: {
          market_size: { type: 'string' },
          competitors: { type: 'array', items: { type: 'string' } },
          competitive_advantage: { type: 'string' },
          market_position: { type: 'string' }
        }
      }
    }
  }
}

// 🔗 VC ANALYSIS TASK (Alternative)
export const VC_ANALYSIS: TaskConfig = {
  id: 'vc-analysis',
  name: 'VC Fund Analysis',
  description: 'Analyze venture capital funds, their portfolio, and investment thesis',
  prompt: `Analyze the venture capital fund "{companyName}"{websiteContext}. Focus on:

1. **Fund Overview**: Size, vintage, investment thesis, stage focus
2. **Portfolio Analysis**: Current investments, successful exits, portfolio companies
3. **Team Research**: Partners, investment team, backgrounds
4. **Investment Criteria**: Check size, sectors, geographic focus
5. **Recent Activity**: Latest investments, fund raises, news

Save findings to structured files and capture screenshots of key portfolio data.`,

  maxSteps: 100,
  llmModel: 'gpt-4o'
}

// 🏢 COMPETITOR ANALYSIS TASK
export const COMPETITOR_ANALYSIS: TaskConfig = {
  id: 'competitor-analysis',
  name: 'Competitor Analysis',
  description: 'Analyze competitors, their products, pricing, and market positioning',
  prompt: `Conduct competitive analysis for "{companyName}"{websiteContext}. Research:

1. **Direct Competitors**: Identify top 5-10 direct competitors
2. **Product Comparison**: Features, pricing, positioning analysis  
3. **Market Share**: Revenue estimates, customer base, market position
4. **Strengths/Weaknesses**: SWOT analysis for each competitor
5. **Differentiation**: Unique value propositions and competitive advantages

Generate comparison tables and competitive landscape mapping.`,
  maxSteps: 120,
  llmModel: 'gpt-4o'
}

// 📊 MARKET ANALYSIS TASK  
export const MARKET_ANALYSIS: TaskConfig = {
  id: 'market-analysis',
  name: 'Market Analysis',
  description: 'Analyze market size, trends, and opportunities in specific industry',
  prompt: `Analyze the market and industry for "{companyName}"{websiteContext}. Focus on:

1. **Market Size**: TAM, SAM, SOM analysis with specific numbers
2. **Growth Trends**: Historical growth, projections, key drivers
3. **Market Segments**: Customer segments, use cases, adoption rates
4. **Key Players**: Market leaders, emerging players, market share
5. **Opportunities**: Gaps, emerging trends, growth opportunities

Generate market sizing models and trend analysis reports.`,
  maxSteps: 100,
  llmModel: 'gpt-4o'
}

// 🎯 DEFAULT TASK (what gets used if no specific task is selected)
export const DEFAULT_TASK = STARTUP_ANALYSIS

// 📋 ALL AVAILABLE TASKS
export const AVAILABLE_TASKS = {
  'startup-analysis': STARTUP_ANALYSIS,
  'vc-analysis': VC_ANALYSIS, 
  'competitor-analysis': COMPETITOR_ANALYSIS,
  'market-analysis': MARKET_ANALYSIS
} as const

// 🎨 APP CONFIGURATION
// Customize your app's branding, title, and instructions here!
export const APP_CONFIG: AppConfig = {
  title: "AI Agent Demo Platform",
  description: "Powerful AI web automation for any use case",
  instructions: {
    simple: "Ask me to analyze any company or website using AI automation",
    advanced: "Enter a company name or website URL to start automated analysis"
  },
  examples: [
    "Analyze OpenAI",
    "Research Stripe's business model", 
    "https://example.com",
    "Study competitor Tesla",
    "Analyze Y Combinator"
  ],
  branding: {
    companyName: "Agent Studio",
    tagline: "AI Automation Made Simple"
  }
}

// 🛠️ HELPER FUNCTIONS
export function getTaskConfig(taskId?: string): TaskConfig {
  if (!taskId || !(taskId in AVAILABLE_TASKS)) {
    return DEFAULT_TASK
  }
  return AVAILABLE_TASKS[taskId as keyof typeof AVAILABLE_TASKS]
}

export function buildTaskPrompt(config: TaskConfig, companyName: string, website?: string): string {
  const websiteContext = website ? ` (website: ${website})` : ''
  return config.prompt
    .replace('{companyName}', companyName)
    .replace('{websiteContext}', websiteContext)
}

export function getAppConfig(): AppConfig {
  return APP_CONFIG
} 