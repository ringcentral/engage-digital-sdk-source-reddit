import Sequelize from 'sequelize'
import { generate } from 'shortid'
import sequelize from './sequelize'

export const Service = sequelize.define('user', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: generate
  },
  name: {
    type: Sequelize.STRING
  },
  subreddit: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  props: {
    type: Sequelize.JSON
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  signed: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  secret: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  endpoint: {
    type: Sequelize.STRING,
    defaultValue: ''
  },
  privateChatOnly: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  data: { // all other data associcated with this user
    type: Sequelize.JSON
  }
})
