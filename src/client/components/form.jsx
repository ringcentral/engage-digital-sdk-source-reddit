/**
 * API token and realtime endpoint URL form
 */

import React from 'react'
import { Form, Icon, Input, Button } from 'antd'

const FormItem = Form.Item

@Form.create()
class SdkForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.update(values)
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const {
      submitting,
      formData
    } = this.props

    return (
      <Form onSubmit={this.handleSubmit} layout='vertical'>
        <FormItem
          label='Subreddit'
        >
          {
            getFieldDecorator(
              'subreddit',
              {
                initialValue: formData.subreddit,
                rules: [
                  {
                    required: true,
                    message: 'Please input your subreddit name'
                  }
                ]
              }
            )(
              <Input
                placeholder='subreddit name'
              />
            )
          }
        </FormItem>
        <FormItem
          label='API Token'
        >
          {
            getFieldDecorator(
              'secret',
              {
                initialValue: formData.secret,
                rules: [
                  {
                    required: true,
                    message: 'Please input your API Token!'
                  }
                ]
              }
            )(
              <Input
                prefix={
                  <Icon type='key' />
                }
                type='password'
                placeholder='API Token'
              />
            )
          }
        </FormItem>
        <FormItem
          label='Realtime endpoint URL'
        >
          {
            getFieldDecorator(
              'endpoint',
              {
                initialValue: formData.endpoint,
                rules: [
                  {
                    required: true,
                    message: 'Realtime endpoint URL required!'
                  }
                ]
              }
            )(
              <Input
                prefix={
                  <Icon type='link' />
                }
                placeholder='Realtime endpoint URL'
              />
            )
          }
        </FormItem>
        <FormItem>
          <Button
            type='primary'
            htmlType='submit'
            loading={submitting}
            className='mg1r mg1b'
          >Submit</Button>
          <p>* Before submit API Token and Realtime endpoint URL the service can not respond</p>
          <p>
            * After polling API retrieved messages, if you want to reply message, you need  set the identity with your name to be controlled in Engage Digital Admin console => identities.
          </p>
        </FormItem>
      </Form>
    )
  }
}

export default SdkForm
