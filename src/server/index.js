/**
 * demo config
 */

import initApp from './app/app'
import { User } from './app/models/reddit'
import { createMessage, showMessage, listMessages } from './lib/messages'
import { showThread, listThreads } from './lib/threads'

/**
 * handle all request
 * @param {object} body, request body
 * @param {object} req, express request
 */
export const onRequest = async (body, req) => {
  const { action, params } = body
  const { id } = req.params
  console.log('source sdk req received:', id, body)
  const user = await User.findByPk(id)
  // console.log('user', user)
  if (!user || !user.id || !user.enabled || !user.subreddit) {
    return ''
  }
  let result
  // check https://github.com/ringcentral/engage-digital-source-sdk/wiki for more info
  switch (action) {
    case 'implementation.info':
      result = {
        objects:
        {
          messages: ['create', 'show', 'list', 'reply'],
          threads: ['list', 'show', 'reply']
        },
        options: ['threads.no_content', 'messages.no_title', 'messages.text']
      }
      break
    case 'threads.list':
      result = await listThreads(user)
      break
    case 'threads.show':
      result = await showThread(user, params.id)
      break
    case 'messages.list':
      result = await listMessages(user, params.since_id, params.thread_id)
      break
    case 'messages.show':
      result = await showMessage(user, params.thread_id, params.id)
      break
    case 'messages.create':
      result = await createMessage(user, params.thread_id, params)
      break
    default:
      result = {}
  }
  return result
}

// extends or override express app as you need
export const appExtend = (app) => initApp(app, onRequest)
