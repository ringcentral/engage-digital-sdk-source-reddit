/**
 * User class
 */

import Reddit from 'snoowrap'
import { Service } from './Service'
import { pack } from '../common/constants'
import _ from 'lodash'

const rProps = [
  'refreshToken',
  'accessToken',
  'scope',
  'ratelimitRemaining'
]

const scopes = [
  'read', 'identity', 'submit'
]
const userAgent = () => `${pack.name}/${pack.version} app`
const scopeString = encodeURIComponent(scopes.join(' '))

export class User extends Service {}

const redirectUri = process.env.RINGCENTRAL_ENGAGE_SOURCE_SERVER + '/rc/oauth'
const {
  REDDIT_CLIENT_ID: cid,
  REDDIT_CLIENT_SECRET: secret
} = process.env

User.init = async ({ code, state }) => {
  const r = await Reddit.fromAuthCode({
    userAgent: userAgent(),
    clientId: cid,
    clientSecret: secret,
    redirectUri,
    code
  })
  const me = await r.getMe()
  const props = _.pick(r, rProps)
  let where = {
    id: me.id
  }
  let user = await User.findOne({
    where
  })
  let existInDB = !!user
  if (user) {
    let update = {
      props
    }
    if (state === 'user') {
      update.enabled = true
    }
    await User.update(update, {
      where
    })
    Object.assign(user, update)
    return { user, existInDB }
  }
  user = await User.create({
    id: me.id,
    props,
    data: me
  })
  return { user, existInDB }
}

Object.defineProperty(User.prototype, 'r', {
  get: function () {
    const r = new Reddit({
      userAgent: userAgent(),
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      ..._.pick(this.props, rProps)
    })
    if (this.props) {
      Object.assign(r, this.props)
    }
    return r
  }
})

User.prototype.authorizeUri = function (state = 'hoder') {
  return `https://www.reddit.com/api/v1/authorize.compact?client_id=${cid}&response_type=code&state=${state}&redirect_uri=${redirectUri}&duration=permanent&scope=${scopeString}`
}

User.prototype.reply = async function (subId, txt) {
  await this.r.getSubmission(subId).reply(txt)
}
