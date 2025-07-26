import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string; fileName: string } }
) {
  try {
    const { taskId, fileName } = params

    const browserUseApiKey = process.env.BROWSER_USE_API_KEY
    if (!browserUseApiKey) {
      return NextResponse.json(
        { error: 'Browser Use API key not configured' },
        { status: 500 }
      )
    }

    // Get file download URL from Browser Use API
    const response = await fetch(
      `https://api.browser-use.com/api/v1/task/${taskId}/output-file/${fileName}`,
      {
        headers: {
          'Authorization': `Bearer ${browserUseApiKey}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Browser Use API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get file download URL' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      download_url: data.download_url,
      file_name: fileName
    })

  } catch (error) {
    console.error('Error getting file download URL:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 