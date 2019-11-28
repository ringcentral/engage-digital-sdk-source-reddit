/**
 * view index
 */

import copy from 'json-deep-copy'
import { pack, jwtPrefix, authUrlDefault, defaultState } from '../common/constants'

const { RINGCENTRAL_ENGAGE_SOURCE_SERVER, CDN, SERVER_HOME } = process.env

export default (req, res) => {
  let data = {
    version: pack.version,
    title: pack.name,
    home: SERVER_HOME,
    server: RINGCENTRAL_ENGAGE_SOURCE_SERVER,
    cdn: CDN || RINGCENTRAL_ENGAGE_SOURCE_SERVER,
    jwtPrefix,
    defaultState,
    authUrlDefault
  }
  data._global = copy(data)
  res.render('index', data)
}
