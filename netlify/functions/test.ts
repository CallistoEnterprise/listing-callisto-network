import type { Handler, HandlerEvent } from '@netlify/functions'

const handler: Handler = async (event: HandlerEvent) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World', body: event.body }),
  }
}

export { handler }
