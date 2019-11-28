/**
 * bot control apis
 * /api
 */

import { User } from '../models/reddit'
import _ from 'lodash'

const supportedActions = [
  'update',
  'get-user'
]

const validProps = [
  'enabled',
  'secret',
  'endpoint',
  'subreddit'
]

export default async (req, res) => {
  let { user } = req
  if (!user) {
    res.status(401)
    return res.send('please login first')
  }
  let { body = {} } = req
  let {
    action,
    update
  } = body
  if (!supportedActions.includes(action)) {
    res.status(400)
    return res.send('not supported')
  }
  let { id } = user
  let result
  if (action === 'get-user') {
    result = await User.findByPk(id).catch(console.error)
    result = _.pick(result || {}, [
      'id', 'signed', 'privateChatOnly', 'data',
      ...validProps
    ])
    if (_.isEmpty(result)) {
      res.status(401)
      return res.send('user not exist')
    }
  } else if (action === 'update') {
    result = await User.update(
      _.pick(update, validProps),
      {
        where: {
          id
        }
      }
    ).catch(console.error)
  } else if (action === 'update') {
    let { enabled } = update
    let user = await User.findByPk(id).catch(console.error)
    if (!user) {
      res.status(401)
      return res.send('user not find')
    }
    if (user.enabled && enabled === false) {
      await user.ensureWebHook(true)
    }
    result = await User.update(
      _.pick(update, validProps),
      {
        where: {
          id
        }
      }
    ).catch(console.error)
  }
  res.send({
    status: 0,
    result: result
  })
}
