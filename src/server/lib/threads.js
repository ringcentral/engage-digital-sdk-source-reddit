/**
 * threads related API
 */

/**
 * list recent threads
 * @param {object} user , user instance
 * @returns {array}
 */
export const listThreads = async (user) => {
  let res = await user.r.getSubreddit(user.subreddit).getNew()
  return res.map(r => {
    return {
      actions: ['show', 'reply'],
      id: r.id
    }
  })
}

/**
 * show thread content, from conversation
 * @param {object} user user instance
 * @param {string} tid thread id string
 */
export const showThread = async (user, tid) => {
  // GET /restapi/v1.0/glip/conversations/6090260482
  let res = await user.r.getSubmission(tid)
  return {
    id: res.id
  }
}
