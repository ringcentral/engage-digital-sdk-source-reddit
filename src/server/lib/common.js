/**
 * common APIs
 */

import _ from 'lodash'

function getMember (user, id) {
  return user.r.getUser(id).fetch()
}

/**
 * get member info
 * @param {object} user user instance
 * @param {array or string} ids ids array or id string
 */
export const getMembers = async (user, _ids) => {
  const ids = _.uniq(_ids)
  let arr = []
  for (let id of ids) {
    const u = await getMember(user, id).catch(e => {
      console.log('err when get user')
      console.log(e.stack)
    })
    arr.push(u)
  }
  return arr.reduce((p, o) => {
    const dt = new Date(o.created * 1000).toISOString()
    const u = {
      id: o.id,
      puppetizable: o.id === user.id,
      screenname: o.name,
      created_at: dt,
      updated_at: dt,
      avatar_url: o.icon_img
    }
    p.idsMap = {
      ...p.idsMap,
      [o.name]: u
    }
    p.users.push(u)
    return p
  }, {
    idsMap: {},
    users: []
  })
}
