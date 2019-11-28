/**
 * middleware to verify id
 */

import { User } from '../models/reddit'

export default async (req, res, next) => {
  let { id } = req.params
  if (!id) {
    return res.status(400).send('id requred')
  }
  const user = await User.findByPk(id)
  if (!user || !user.id) {
    return res.status(404).send('not found')
  }
  if (!user.enabled || !user.endpoint || !user.secret) {
    return res.send('')
  }
  res.locals.secret = user.secret
  next()
}
