import './App.less'
import React, {Component} from 'react'
import {hot} from 'react-hot-loader'
import {Picker as EmojiPicker} from 'emoji-mart'
import {Calendar, Card, Modal, Button, Popover, Input, message} from 'antd'
import coffee from './assets/coffee.svg'
import moment from 'moment'
import emojione from 'emojione'
import Nebpay from 'nebpay'

const {TextArea} = Input
const mainnetUrl = "https://pay.nebulas.io/api/mainnet/pay"
const testnetUrl = "https://pay.nebulas.io/api/pay"
const dappAddr = 'n1hndZE2NnWNTewjhDUrwRaaTAm7QVcDUpA'
const nebpay = new Nebpay()

class App extends Component {
  state = {
    author: '',
    date: moment(),
    editVisible: false,
    confirmLoading: false,
    emojiCol: '',
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
  
  componentDidMount() {
    this.getDiaryList()
  }
  
  onDateSelect(date) {
    this.setState({date, editVisible: true})
  }
  
  saveDiary = () => {
    const {
      date,
      emoji,
      todo,
      learn,
      relationship,
      health,
      work,
      financial,
      happiness,
      dream,
      author,
    } = this.state
    const dateStr = date.format('YYYYMMDD')
    const callFunc = 'save'
    const callArgs = `["${author}", "${dateStr}", "${todo}", "${learn}", "${relationship}", "${health}", "${work}", "${financial}", "${happiness}", "${dream}", "${emoji}"]`
    message.loading('交易完成后将自动保存日记，请稍等...', 0)
    this.serialNumber = nebpay.call(dappAddr, '0', callFunc, callArgs, {
      callback: testnetUrl,
      listener: res => {
        if (res === 'Error: Transaction rejected by user') {
          message.destroy()
          message.error('您已拒绝交易，请重新保存')
          clearInterval(this.queryInterval)
        }
      }
    })
    
    this.queryInterval = setInterval(this.querySaveInfo, 10000)
  }
  
  querySaveInfo = () => {
    nebpay.queryPayInfo(this.serialNumber, {callback: testnetUrl})
      .then(resp => {
        const result = JSON.parse(resp)
        if (result.code === 0) {
          clearInterval(this.queryInterval)
          // 交易成功
          message.destroy()
          this.onModalCancel()
          message.success('日记保存成功!')
        }
      })
      .catch(err => {
        clearInterval(this.queryInterval)
        message.error('日记保存失败，请重新保存')
        console.error(err)
      })
  }
  
  getDiaryList = () => {
    const {
      author,
    } = this.state
  
    const callFunc = 'getDiaryList'
    const callArgs = `["${author}"]`
    nebpay.simulateCall(dappAddr, '0', callFunc, callArgs, {
      callback: testnetUrl,
      listener: function (resp) {
        let list = JSON.parse(resp.result) || []
        let newList = []
        for (let i = 0; i <= list.length; i ++) {
          const hasOccupyIndex = newList.findIndex(l => l.id === list[i].id) > -1
          if (list[i].id === list[i - 1].id) {
          
          }
        }
      }
    })
  }
  
  onModalCancel = () => {
    this.setState({
      editVisible: false,
      confirmLoading: false,
      emojiCol: '',
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
    clearInterval(this.queryInterval)
  }
  
  onAboutUsShow = () => {
    Modal.info({
      title: '关于我们',
      okText: '开始吧！',
      content: (
        <div>
          <h2>晨间日记是什么？</h2>
          
          <p>晨间日记就是利用早晨的时间记录一段文字，帮助自己提高效率的工具，由佐藤传出版的<a href="https://book.douban.com/subject/3744041/">《晨间日记的奇迹》</a>中提出了该概念，通过自问自答的方式引领自己在每天早晨深入地思考与复盘。
          </p>
          
          <h2>和普通日记有什么区别？</h2>
          
          <ol>
            <li>冷静之后再写的大不同。经过一个晚上的时间，能更加客观的看待问题</li>
            <li>短时间内可正确做记录。而且对前一天的事情还记忆犹新，留下正确记录</li>
            <li>&quot;未来日记&quot;可以改变当日行动模式。写下自己的想法，让自己变得更加稳定，可以发变行动。更积极、自主地解决问题</li>
            <li>隔天早晨再次做确认、提高执行力。隔天早上检视前一天自己所写下的未来日记，执行力也会跟着提高</li>
            <li>有效<strong>治愈</strong>赖床！</li>
          </ol>
          
          <h2>使用攻略</h2>
          
          <ol>
            <li>本应用基于<a href="https://nebulas.io/">星云链</a>驱动，WEB 端使用请安装<a
              href="https://github.com/ChengOrangeJu/WebExtensionWallet">星云钱包插件</a>，移动端使用请安装<a
              href="https://nano.nebulas.io/index_cn.html">星云钱包 APP</a></li>
            <li>应用已内置经典模板，帮助你快速上手晨间日记</li>
            <li>点击相应日期即可开始书写或查看自己的晨间日记</li>
            <li>选择一个 emoji 作为自己一天的象征吧，日历中会展示你每天变化</li>
            <li>回忆可查看历史上的今天，你都留下了怎样的记录</li>
          </ol>
          
          <h2>更多信息</h2>
          
          <ol>
            <li>欢迎提交意见与反馈，可通过 <a href='mailto:xal821792703@gmail.com'>邮件</a> 或 <a href="https://github.com/nitta-honoka/morning-diary/issues">ISSUE</a> 的方式联系我们
            </li>
            <li>欢迎参加星云链开发者<a href="https://incentive.nebulas.io/cn/signup.html?invite=LGfSR">激励活动</a>，用一杯下午茶的时间赢取 NAS 奖励
            </li>
          </ol>
          
          <h3>现在，让我们开始享受每日清晨的奇迹时光吧！</h3>
        </div>
      ),
      onOk() {
      }
    })
  }
  
  onEmojiPick(emoji) {
    console.log(emoji)
    this.setState({
      emojiCol: emoji.colons,
      emoji: emoji.id
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
      emojiCol,
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
          <img src={coffee}/>
          <h2>晨间日记</h2>
        </header>
        <main>
          <Card bordered={false}>
            <Calendar value={date}
                      onSelect={date => this.onDateSelect(date)}
                      onPanelChange={date => this.setState({date})}/>
          </Card>
          <Card title='回忆' bordered={false}>
          
          </Card>
        </main>
        <footer>
          使用<a href='https://nebulas.io/'>星云链</a>驱动 |&nbsp;<a onClick={this.onAboutUsShow}>关于我们</a>
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
                !!emojiCol && (
                  <span dangerouslySetInnerHTML={{__html: emojione.shortnameToImage(emojiCol)}} />
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
