import { Component } from 'react-subx'
import { Button, Tag, Icon, Spin } from 'antd'
import logo from '../images/rc128.png'
import SdkForm from './form.jsx'
import copy from 'json-deep-copy'

const { server } = window.rc
export default class App extends Component {
  componentDidMount () {
    window.particleBg && window.particleBg('#bg', {
      color: '#eee'
    })
    this.fetchUserInfo()
  }

  fetchUserInfo = () => {
    this.props.store.getUser()
  }

  uri = () => {
    const { server, home } = window.rc
    const { id } = this.props.store.user
    return server + home.replace(':id', id)
  }

  renderFooter () {
    return (
      <div className='mg3t pd1y'>
        <h3>About</h3>
        <p>
          This app help RingCentral Engage Digital users to create Dimelo SDK source with Reddit accout, so RingCentral Engage Digital users can view/reply Subreddit thread/comment in RingCentral Engage Digital admin console, you can follow
          <a href='https://github.com/ringcentral/engage-digital-source-sdk-js/blob/master/docs/enable-sdk-source.md' target='_blank' className='mg1x'>this guide</a>
        </p>
        <p className='mg3t pd1y'>
          Powered by
          <a href='https://github.com/ringcentral/engage-digital-source-sdk-js' target='_blank' className='mg1x'>engage-digital-source-sdk-js</a>,
          <a href='https://github.com/ringcentral/ringcentral-personal-chatbot-js' target='_blank' className='mg1x'>ringcentral-personal-chatbot</a>
          and
          <a href='https://github.com/tylerlong/subx' target='_blank' className='mg1x'>Subx</a>
        </p>
      </div>
    )
  }

  renderTitle () {
    return (
      <div>
        <div className='pd2b aligncenter'>
          <img
            className='iblock'
            src={logo}
          />
          <h1>
            RingCentral Engage Digital SDK source server for Reddit
            <sup className='mg1l'><Tag color='red'>Beta</Tag></sup>
          </h1>
        </div>
      </div>
    )
  }

  renderSwitch () {
    let { enabled } = this.props.store.user
    let { switching, updateEnabled } = this.props.store
    let turnOnUrl = window.rc.authUrlDefault.replace(window.rc.defaultState, 'user')
    return enabled
      ? (
        <Button
          type='danger'
          icon='disconnect'
          loading={switching}
          onClick={() => updateEnabled(false)}
        >Turn off service</Button>
      )
      : (
        <a href={turnOnUrl}>
          <Button
            type='ghost'
          >Turn on service</Button>
        </a>
      )
  }

  renderLogined () {
    let {
      user = {},
      submitting,
      update
    } = this.props.store
    let { enabled } = user
    let props = {
      submitting,
      formData: copy(user),
      update
    }
    let txt1 = enabled
      ? 'Your RingCentral Engage Digital SDK source service is working now, you can close this page, service will still work.'
      : 'Your RingCentral Engage Digital SDK source service is offline'
    return (
      <div className='outer'>
        <div className='header alignright mg3b pd2x pd1y'>
          <a href={`${server}/logout`} className='iblock'>
            <Icon type='logout' /> logout
          </a>
        </div>
        <div className='wrap'>
          {this.renderTitle()}
          <p className='pd1b'>{txt1} {this.renderSwitch()}</p>
          <p className='pd1b'><b>Base URI</b> for your Dimelo SDK source: <b>{this.uri()}</b></p>
          <SdkForm
            {...props}
          />
          {this.renderFooter()}
        </div>
      </div>
    )
  }

  renderNotLogined () {
    let { fetchingUser } = this.props.store
    return (
      <div className='aligncenter wrap'>
        {this.renderTitle()}
        <Spin spinning={fetchingUser}>
          <div className='pd1b pd1t'>
            <a href={window.rc.authUrlDefault}>
              <Button icon='login' type='primary' size='large'>
                Login with Reddit
              </Button>
            </a>
          </div>
        </Spin>
        <p className='pd1b'>After login, you can set API token & realtime endponit and get your server URI 😏, for your Dimelo SDK source</p>
        {this.renderFooter()}
      </div>
    )
  }

  render () {
    let { logined } = this.props.store
    return logined
      ? this.renderLogined()
      : this.renderNotLogined()
  }
}
