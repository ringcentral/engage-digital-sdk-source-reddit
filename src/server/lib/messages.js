/**
 * messages API
 */

import { getMembers } from './common'
import _ from 'lodash'
import cheerio from 'cheerio'

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
  return 'th_' + r
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
    const prefix = d.title
      ? 'po_'
      : 'com_'
    const dt = new Date(d.created * 1000).toISOString()
    const rr = {
      actions: ['show', 'reply'],
      id: prefix + d.id,
      thread_id: getThreadId(d),
      body: d.body_html || d.selftext_html,
      updated_at: dt,
      created_at: dt,
      author: u
    }
    if (d.parent_id) {
      rr.in_reply_to_id = d.parent_id.split('_')[1]
    }
    return rr
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
  let r = await formatMessage(user, [...threads, ...comments])
  console.log('--before sort----', sinceId)
  console.log(r)
  r.sort((a, b) => {
    return a.created_at > b.created_at ? -1 : 1
  })
  console.log('---after sort---')
  console.log(r)
  // console.log(f.map(g => {
  //   return {
  //     id: g.id,
  //     created_at: g.created_at
  //   }
  // }))
  if (sinceId) {
    let i = _.findIndex(r, d => d.id === sinceId)
    r = r.slice(0, i)
  }
  console.log('--after filter----')
  console.log(r)
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
  let sid = message.in_reply_to_id || message.thread_id
  let type = 'po'
  if (sid.includes('_')) {
    let arr = sid.split('_')[1]
    sid = arr[1]
    type = arr[0]
  }
  let r = type === 'com'
    ? user.r.getComment(sid)
    : user.r.getSubmission(sid)
  let msg = message.body
  if (message.format === 'html') {
    const $ = cheerio.load(msg)
    msg = $('body').text()
  }
  const res = await r.reply(msg).catch(e => {
    console.log('reply err')
    console.log(e.message)
  })
  return res || {}
}
