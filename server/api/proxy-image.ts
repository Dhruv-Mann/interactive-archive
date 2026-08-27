import { defineEventHandler, getQuery, sendStream } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    return { error: 'No URL provided' }
  }

  try {
    const response = await fetch(url)
    
    // Forward the content type
    const contentType = response.headers.get('content-type')
    if (contentType) {
      event.node.res.setHeader('Content-Type', contentType)
    }
    
    // Enable aggressive caching
    event.node.res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    
    if (response.body) {
      return sendStream(event, response.body as any)
    }
    
    return await response.arrayBuffer()
  } catch (error) {
    console.error('Error proxying image:', error)
    return { error: 'Failed to fetch image' }
  }
})
