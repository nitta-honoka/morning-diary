
import './App.less'
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import { Picker as EmojiPicker } from 'emoji-mart'
import { Calendar, Card, Modal, Button, Popover, Input } from 'antd'
import coffee from './assets/coffee.svg'
import moment from 'moment'
import emojione from 'emojione'

const { TextArea } = Input
class App extends Component {
  state = {
    date: moment(),
    editVisible: false,
    confirmLoading: false,
    emoji: '',
    todo: '', // 今日待办
    learn: '', // 学习
    relationship: '', // 人际关系
    health: '', // 健康
    work: '', // 工作
    financial: '', // 理财
    happiness: '', // 快乐
    dream: '' // 梦想
  }
  onDateSelect(date) {
    this.setState({date, editVisible: true})
  }
  saveDiary = () => {
  
  }
  onModalCancel = () => {
    this.setState({
      editVisible: false,
      confirmLoading: false,
      emoji: '',
      todo: '',
      learn: '',
      relationship: '',
      health: '',
      work: '',
      financial: '',
      happiness: '',
      dream: ''
    })
  }
  
  onEmojiPick(emoji) {
    this.setState({
      emoji: emoji.colons,
    })
  }
  
  onDiaryInput = (v, key) => {
    this.setState({[key]: v})
  }
  
  get EmojiBox() {
    const { emoji } = this.state
    return (
      <EmojiPicker set='emojione'
                   emoji={emoji}
                   title='心情如何'
                   onSelect={emoji => this.onEmojiPick(emoji)}/>
    )
  }
  
  render() {
    const {
      confirmLoading,
      editVisible,
      emoji,
      date,
      // diary content
      todo,
      learn,
      relationship,
      health,
      work,
      financial,
      happiness,
      dream
    } = this.state
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={coffee} />
          <h2>晨间日记</h2>
        </header>
        <main>
          <Card bordered={false}>
            <Calendar value={date}
              onSelect={date => this.onDateSelect(date)}/>
          </Card>
          <Card title='回忆' bordered={false}>
          
          </Card>
        </main>
        <footer>
          使用<a href='https://nebulas.io/'>星云链</a>驱动 | 查看<a>详细帮助信息</a>
        </footer>
        <Modal title='编写日记'
               visible={editVisible}
               cancelText='取消'
               okText='保存'
               onOk={this.saveDiary}
               confirmLoading={confirmLoading}
               onCancel={this.onModalCancel}>
          <Card className='diary-header'>
            <div>
              <h2>{date.format('DD')}</h2>
              <span>
                <p>{WEEK_CONF[date.weekday()]}</p>
                <p>{date.format('YYYY年MM月')}</p>
              </span>
            </div>
            <div>
              <Popover content={this.EmojiBox} trigger={['click']}>
                <Button type='primary'>选择一个emoji代表今天的心情吧</Button>
              </Popover>
              {
                !!emoji && (
                  <span dangerouslySetInnerHTML={{__html: emojione.shortnameToImage(emoji)}} />
                )
              }
            </div>
          </Card>
          <Card title='今天待办'
            extra={<i>吃掉那只青蛙</i>}>
            <TextArea rows={5} value={todo}
                      onChange={e => this.onDiaryInput(e.target.value, 'todo')}/>
          </Card>
          <Card title='学习·信息·阅读'
            extra={<i>读万卷书，行万里路</i>}>
            <TextArea rows={5} value={learn}
                      onChange={e => this.onDiaryInput(e.target.value, 'learn')}/>
          </Card>
          <Card title='人际关系·家庭·朋友'
            extra={<i>每天做一件让人快乐的事</i>}>
            <TextArea rows={5} value={relationship}
                      onChange={e => this.onDiaryInput(e.target.value, 'relationship')}/>
          </Card>
          <Card title='健康·饮食·锻炼'
                extra={<i>早睡早起，劳逸结合</i>}>
            <TextArea rows={5} value={health}
                      onChange={e => this.onDiaryInput(e.target.value, 'health')}/>
          </Card>
          <Card title='工作'
                extra={<i>行成于思，业精于勤</i>}>
            <TextArea rows={5} value={work}
                      onChange={e => this.onDiaryInput(e.target.value, 'work')}/>
          </Card>
          <Card title='理财·金钱'
                extra={<i>金钱拥有中立的能量</i>}>
            <TextArea rows={5} value={financial}
                      onChange={e => this.onDiaryInput(e.target.value, 'financial')}/>
          </Card>
          <Card title='快乐·惊喜·其他'
                extra={<i>真正的快乐是内在的</i>}>
            <TextArea rows={5} value={happiness}
                      onChange={e => this.onDiaryInput(e.target.value, 'happiness')}/>
          </Card>
          <Card title='愿望·人生的梦'
                extra={<i>梦想是蝴蝶的翅膀</i>}>
            <TextArea rows={5} value={dream}
                      onChange={e => this.onDiaryInput(e.target.value, 'dream')}/>
          </Card>
        </Modal>
      </div>
    )
  }
}

export default hot(module)(App)

const WEEK_CONF = {
  '1': '周一',
  '2': '周二',
  '3': '周三',
  '4': '周四',
  '5': '周五',
  '6': '周六',
  '7': '周日',
}
