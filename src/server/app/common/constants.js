import { resolve } from 'path'
import crypto from 'crypto'
import { User } from '../models/reddit'

const { RINGCENTRAL_ENGAGE_SOURCE_SERVER } = process.env
const arr = RINGCENTRAL_ENGAGE_SOURCE_SERVER.split('/')
const root = arr[0] + arr[1] + arr[2]
const user = new User()
const cwd = process.cwd()

export const defaultState = '__default_state_'
export const extraPath = RINGCENTRAL_ENGAGE_SOURCE_SERVER.replace(root, '')
export const pack = require(resolve(cwd, 'package.json'))
export const jwtPrefix = crypto.createHash('md5').update(RINGCENTRAL_ENGAGE_SOURCE_SERVER).digest('hex')
export const authUrlDefault = user.authorizeUri(defaultState)
