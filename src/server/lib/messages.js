/**
 * messages API
 */

import { getMembers } from './common'
import _ from 'lodash'

/**
 * translate `![:Person](xxxx)` to username
 * @param {array} mentions
 * @param {string} text
 */
// function translateText (mentions = [], text) {
//   for (let m of mentions) {
//     const reg = new RegExp(_.escapeRegExp(`![:Person](${m.id})`), 'g')
//     text = text.replace(reg, '@' + m.name)
//   }
//   return text
// }

function getThreadId (msg) {
  const res = (msg.url || msg.link_url).match(/comments\/([^/]+)\//)
  const r = _.get(res, '[1]')
  return r
}

/**
 * format ringcentral message to Dimelo message
 * @param {array} records message array
 */
export async function formatMessage (user, records) {
  const uids = records.map(g => g.author.name)
  const { idsMap } = await getMembers(user, uids)
  if (!idsMap) {
    return []
  }
  return records.map(d => {
    let u = idsMap[d.author.name]
    if (!u) {
      return null
    }
    const title = d.title
      ? `${d.title}\n\n`
      : ''
    const dt = new Date(d.created * 1000).toISOString()
    const prefix = d.title
      ? 'p' // post
      : 'c' // comment
    return {
      actions: ['show', 'reply'],
      id: prefix + '_' + d.id,
      thread_id: getThreadId(d),
      body: `${title}${d.body || d.selftext}`,
      updated_at: dt,
      created_at: dt,
      author: u
    }
  }).filter(d => d)
}

/**
 * list messages
 * @param {object} user user instance
 * @param {string} tid thread id
 */
export const listMessages = async (user, sinceId) => {
  let res = await user.r.getSubreddit(user.subreddit)
  let threads = await res.getNew()
  // console.log('======')
  // console.log(threads)
  // console.log('======')
  let comments = await res.getNewComments()
  // console.log('======')
  // console.log(comments)
  // console.log('======')
  const r = await formatMessage(user, [...threads, ...comments])
  return r
}

/**
 * show message
 * @param {object} user user instance
 * @param {string} tid thread id
 * @param {string} mid message id
 */
export const showMessage = async (user, tid, mid) => {
  // /restapi/v1.0/glip/chats/chatId/posts/postId
  let r = await user.r.getSubmission(mid)
  if (!r) {
    return ''
  }
  return r || {}
}

export const createMessage = async (user, tid, message) => {
  // /restapi/v1.0/glip/chats/chatId/posts
  const [type, id] = message.in_reply_to_id.split('_')
  let r = type === 'c'
    ? user.r.getComment(id)
    : user.r.getSubmission(id)
  const res = await r.reply(message.body).catch(e => {
    console.log('reply err')
    console.log(e)
  })
  return res || {}
}
