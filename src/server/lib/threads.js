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
  if (!res) {
    return []
  }
  res = res.map(r => {
    return {
      id: 'th_' + r.id,
      title: r.title
    }
  })
  console.log('======list thread=====')
  console.log(res)
  return res
}

/**
 * show thread content, from conversation
 * @param {object} user user instance
 * @param {string} tid thread id string
 */
export const showThread = async (user, tid) => {
  // GET /restapi/v1.0/glip/conversations/6090260482
  let res = await user.r.getSubmission(tid.split('_')[1]).fetch()
  if (!res) {
    return ''
  }
  return {
    id: res.id,
    title: res.title
  }
}
