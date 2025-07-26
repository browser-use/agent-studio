import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string; stepId: string } }
) {
  try {
    const { taskId, stepId } = params

    const browserUseApiKey = process.env.BROWSER_USE_API_KEY
    if (!browserUseApiKey) {
      return NextResponse.json(
        { error: 'Browser Use API key not configured' },
        { status: 500 }
      )
    }

    console.log('🖼️ [SCREENSHOT API] Fetching screenshot for:', { taskId, stepId })

    // Try different potential Browser Use API endpoints for screenshots
    const possibleEndpoints = [
      `https://api.browser-use.com/api/v1/task/${taskId}/step/${stepId}/screenshot`,
      `https://api.browser-use.com/api/v1/task/${taskId}/screenshots/${stepId}`,
      `https://api.browser-use.com/api/v1/screenshot/${taskId}/${stepId}`,
    ]

    for (const endpoint of possibleEndpoints) {
      console.log('🔍 [SCREENSHOT API] Trying endpoint:', endpoint)
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${browserUseApiKey}`,
        },
      })

      if (response.ok) {
        console.log('✅ [SCREENSHOT API] Found screenshot at:', endpoint)
        
        // If it's an image, return it directly
        const contentType = response.headers.get('content-type')
        if (contentType?.startsWith('image/')) {
          const imageBuffer = await response.arrayBuffer()
          return new NextResponse(imageBuffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=3600'
            }
          })
        }
        
        // If it's JSON with image URL, return the URL
        const data = await response.json()
        if (data.screenshot_url || data.image_url || data.url) {
          return NextResponse.json({
            screenshot_url: data.screenshot_url || data.image_url || data.url
          })
        }
      } else {
        console.log('❌ [SCREENSHOT API] Failed at:', endpoint, response.status)
      }
    }

    // If no specific endpoints work, try to find screenshots in the task data
    console.log('🔍 [SCREENSHOT API] Trying to get screenshot from task data')
    const taskResponse = await fetch(`https://api.browser-use.com/api/v1/task/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${browserUseApiKey}`,
      },
    })

    if (taskResponse.ok) {
      const taskData = await taskResponse.json()
      console.log('📊 [SCREENSHOT API] Task data received, looking for screenshots...')
      
      // Look for screenshot in step data
      const step = taskData.steps?.find((s: any) => s.id === stepId)
      if (step) {
        // Check various possible screenshot fields
        const screenshotUrl = step.screenshot_url || step.screenshot || step.image_url || step.image
        if (screenshotUrl) {
          console.log('✅ [SCREENSHOT API] Found screenshot URL in step data:', screenshotUrl)
          return NextResponse.json({ screenshot_url: screenshotUrl })
        }
      }
      
      // Check if there's a screenshots array in task data
      if (taskData.screenshots) {
        const screenshot = taskData.screenshots.find((s: any) => s.step_id === stepId)
        if (screenshot) {
          console.log('✅ [SCREENSHOT API] Found screenshot in screenshots array:', screenshot.url)
          return NextResponse.json({ screenshot_url: screenshot.url })
        }
      }
    }

    console.log('❌ [SCREENSHOT API] No screenshot found for step:', stepId)
    return NextResponse.json(
      { error: 'Screenshot not found for this step' },
      { status: 404 }
    )

  } catch (error) {
    console.error('❌ [SCREENSHOT API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch screenshot' },
      { status: 500 }
    )
  }
} 