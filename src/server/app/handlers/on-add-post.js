/**
 * default parser for add post event
 */
import { User } from '../models/reddit'

export default async (message, conf) => {
  let { text } = message.body
  if (!text) {
    return // not a text message
  }
  const { ownerId } = message
  const { creatorId } = message.body
  const isTalkToSelf = ownerId === creatorId && text.startsWith('#me ')
  const { groupId } = message.body
  const user = await User.findByPk(ownerId)
  const group = await user.getGroup(groupId)
  const isPrivateChat = group.members.length <= 2
  if (!isPrivateChat && !isTalkToSelf && (
    !message.body.mentions ||
    !message.body.mentions.some(m => m.type === 'Person' && m.id === ownerId)
  )) {
    // only respond to mentioned chat in group chat or private chat
    return
  }
  const regex = new RegExp(`!\\[:Person\\]\\(${user.id}\\)`)
  const textFiltered = text.replace(regex, ' ').replace(/^#me /, '').trim()

  return {
    text,
    textFiltered,
    isTalkToSelf,
    isPrivateChat,
    group,
    user,
    message
  }
}
