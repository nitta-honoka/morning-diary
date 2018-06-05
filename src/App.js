import './App.less'
import React, {Component} from 'react'
import {hot} from 'react-hot-loader'
import {Picker as EmojiPicker} from 'emoji-mart'
import {Calendar, Card, Modal, Button, Popover, Input, message, Alert, Select} from 'antd'
import coffee from './assets/coffee.svg'
import moment from 'moment'
import emojione from 'emojione'
import Nebpay from 'nebpay'

const {TextArea} = Input
const mainnetUrl = "https://pay.nebulas.io/api/mainnet/pay"
const testnetUrl = "https://pay.nebulas.io/api/pay"
const dappAddr = 'n1r5g2XYCw4SbyCY34VBsCi9vfk7wHiLWSJ'
const nebpay = new Nebpay()

class App extends Component {
  state = {
    diaryData: {},
    date: moment(),
    lastYear: moment().subtract(1, 'years').year(),
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
    this.getAddress()
  }
  
  getAddress() {
    // 获得绑定钱包地址
    window.postMessage({
      'target': 'contentscript',
      'data': {},
      'method': 'getAccount'
    }, '*')
    
    window.addEventListener('message', e => {
      if (e.data && e.data.data && e.data.data.account) {
        this.setState({address: e.data.data.account})
      }
    })
  }
  
  onDateSelect(date) {
    const { diaryData } = this.state
    const data = diaryData[date.format('YYYYMMDD')] || {}
    this.setState({
      ...data,
      emojiCol: data.emoji ? `:${data.emoji}:` : '',
      date,
      editVisible: true
    })
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
    } = this.state
    
    if (!emoji) {
      return message.error('请选择一个 emoji 呦', 1500)
    }
    const dateStr = date.format('YYYYMMDD')
    const callFunc = 'save'
    const callArgs = `["", "${dateStr}", "${todo}", "${learn}", "${relationship}", "${health}", "${work}", "${financial}", "${happiness}", "${dream}", "${emoji}"]`
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
        if (result.code === 0 && result.data.status === 1) {
          // 交易成功且打包上链
          clearInterval(this.queryInterval)
          message.destroy()
          this.onModalCancel()
          message.success('日记保存成功!')
          this.getDiaryList()
        }
      })
      .catch(err => {
        clearInterval(this.queryInterval)
        message.error('日记保存失败，请重新保存')
        console.error(err)
      })
  }
  
  getDiaryList = () => {
    const callFunc = 'getDiaryList'
    const callArgs = `[]`
    nebpay.simulateCall(dappAddr, '0', callFunc, callArgs, {
      callback: testnetUrl,
      listener: resp => {
        let list = JSON.parse(resp.result) || []
        const data = {}
        list.forEach(l => {
          data[l.date] = l
        })
        this.setState({diaryData: data})
      }
    })
  }
  
  dateCellRender(date) {
    const { diaryData } = this.state
    const dateStr = date.format('YYYYMMDD')
    const data = diaryData[dateStr] || {}
    if (data.emoji) {
      return (
        <span dangerouslySetInnerHTML={{__html: emojione.shortnameToImage(`:${data.emoji}:`)}} />
      )
    }
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
      title: '帮助&反馈',
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
            <li>应用已内置经典模板，帮助您快速上手晨间日记</li>
            <li>点击相应日期即可开始书写或查看自己写过的晨间日记</li>
            <li>选择一个 emoji 作为自己一天的象征吧，日历会展示您每天的心情变化</li>
            <li>可查看历史上的今天，您都留下了怎样的记录</li>
            <li>仅保存日记需要消费少量 GAS</li>
          </ol>
          
          <h2>联系开发者</h2>
          <p>欢迎提交意见与反馈，可通过 <a href='mailto:xal821792703@gmail.com'>邮件</a> 或 <a href="https://github.com/nitta-honoka/morning-diary/issues">ISSUE</a> 的方式联系我们</p>
          
          <h2>星云激励计划</h2>
          <p>欢迎参加星云链开发者<a href="https://incentive.nebulas.io/cn/signup.html?invite=LGfSR">激励活动</a>，用一杯下午茶的时间赢取 NAS 奖励</p>
          
          <h3>现在，让我们开始享受每日清晨的奇迹时光吧！</h3>
        </div>
      ),
      onOk() {
      }
    })
  }
  
  onEmojiPick(emoji) {
    this.setState({
      emojiCol: emoji.colons,
      emoji: emoji.id
    })
  }
  
  onDiaryInput = (v, key) => {
    this.setState({[key]: v})
  }
  
  onMemorySelect = v => {
    this.setState({lastYear: v})
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
  
  get MemoryBox() {
    const { diaryData, date, lastYear } = this.state
    const dateStr = `${lastYear}${moment().format('MMDD')}`
    const data = diaryData[dateStr]
    console.log('date is %s, data is %o', dateStr, data)
    const options = (() => {
      let opts = []
      for (let i = moment().subtract(1, 'years').year(); i >= 2000; i --) {
        opts.push({label: i, value: i})
      }
      return opts
    })()
    const Title = (
      <div>
        <Select value={lastYear} style={{width: 80}} onChange={this.onMemorySelect}>
          {
            options.map(o => (
              <Select.Option value={o.value} key={o.value}>{o.label}</Select.Option>
            ))
          }
        </Select>
        <span style={{marginLeft: '8px'}}>年的今天</span>
      </div>
    )
    
    if (data) {
      return (
        <Card title={Title} bordered={false} className='memory-box'>
          {
            TITLE_CONF.map(conf => {
              if (data[conf.value]) {
                return (
                  <Card.Grid key={conf.value} style={{width: '25%'}}>
                    <h4 className="memory-header">{conf.label}</h4>
                    <p className="memory-content">{data[conf.value]}</p>
                  </Card.Grid>
                )
              }
            })
          }
        </Card>
      )
    } else {
      return (
        <Card title={Title} bordered={false} className='memory-box'>
          <Alert message='没有这一年的回忆呦' type='info' showIcon/>
        </Card>
      )
    }
  }
  
  render() {
    const {
      confirmLoading,
      editVisible,
      address,
      emojiCol,
      date,
    } = this.state
    
    return (
      <div className="App">
        <header className="App-header">
          <img src={coffee}/>
          <h2>晨间日记</h2>
        </header>
        <main>
          {
            !!address && (
              <Card bordered={false}>
                <Alert message={`您当前的钱包地址为：${address || ''}`} type='info' showIcon/>
              </Card>
            )
          }
          <Card bordered={false}>
            <Calendar value={date}
                      dateCellRender={date => this.dateCellRender(date)}
                      onSelect={date => this.onDateSelect(date)}
                      onPanelChange={date => this.setState({date})}/>
          </Card>
          {this.MemoryBox}
        </main>
        <footer>
          使用<a href='https://nebulas.io/'>星云链</a>驱动 |&nbsp;<a onClick={this.onAboutUsShow}>帮助&反馈</a>
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
          {
            TITLE_CONF.map(conf => (
              <Card title={conf.title} key={conf.value} extra={conf.extra}>
                <TextArea rows={5} value={this.state[conf.value]}
                          onChange={e => this.onDiaryInput(e.target.value, conf.value)}/>
              </Card>
            ))
          }
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

const TITLE_CONF = [{
  label: '今日待办',
  value: 'todo',
  extra: <i>吃掉那只青蛙</i>
}, {
  label: '学习·信息·阅读',
  value: 'learn',
  extra: <i>读万卷书，行万里路</i>
}, {
  label: '人际关系·家庭·朋友',
  value: 'relationship',
  extra: <i>每天做一件让人快乐的事</i>
}, {
  label: '健康·饮食·锻炼',
  value: 'health',
  extra: <i>早睡早起，劳逸结合</i>
}, {
  label: '工作',
  value: 'work',
  extra: <i>行成于思，业精于勤</i>
}, {
  label: '理财·金钱',
  value: 'financial',
  extra: <i>金钱拥有中立的能量</i>
}, {
  label: '快乐·惊喜·其他',
  value: 'happiness',
  extra: <i>真正的快乐是内在的</i>
}, {
  label: '愿望·人生的梦',
  value: 'dream',
  extra: <i>梦想是蝴蝶的翅膀</i>
}]
