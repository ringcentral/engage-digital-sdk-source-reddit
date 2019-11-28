
import { User } from '../models/reddit'

// create database tables if not exists
export const initDb = async (req, res) => {
  await User.sync()
  res.send('ok')
}

// create database tables if not exists
export const viewDb = async (req, res) => {
  const users = await User.findAll()
  let result = ''
  for (const user of users) {
    result += `<pre>\n${JSON.stringify(user, null, 2)}\n</pre>\n`
    const subscriptions = await user.getSubscriptions()
    result += `<pre>\n${JSON.stringify(subscriptions, null, 2)}\n</pre>\n`
  }
  res.send(result)
}
