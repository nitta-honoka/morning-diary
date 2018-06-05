/**
 * Created by honoka on 18/5/31.
 */
"use strict"
let DiaryItem = function (text) {
  if (text) {
    const obj = JSON.parse(text)
    // this.author = obj.author
    // this.content = obj.content
    this.id = obj.id
    this.date = obj.date
    this.todo = obj.todo
    this.learn = obj.learn
    this.relationship = obj.relationship
    this.health = obj.health
    this.work = obj.work
    this.financial = obj.financial
    this.happiness = obj.happiness
    this.dream = obj.dream
    this.emoji = obj.emoji
  } else {
    // this.author = ''
    this.date = ''
    this.id = ''
    this.todo = ''
    this.learn = ''
    this.relationship = ''
    this.health = ''
    this.work = ''
    this.financial = ''
    this.happiness = ''
    this.dream = ''
    this.emoji = ''
  }
}

DiaryItem.prototype = {
  toString: function () {
    return JSON.stringify(this)
  }
}

let MorningDiary = function () {
  // LocalContractStorage.defineProperty(this, 'id')
  LocalContractStorage.defineMapProperty(this, 'userList')
  LocalContractStorage.defineMapProperty(this, 'diaryList', {
    stringify: function (obj) {
      return obj.toString()
    },
    parse: function (o) {
      return new DiaryItem(o)
    }
  })
}

MorningDiary.prototype = {
  init: function () {
    // this.id = new BigNumber(0)
  },

  save: function (author, date, todo, learn, relationship, health, work, financial, happiness, dream, emoji) {
    if (!date) {
      throw new Error('empty date')
    }
    author = author || Blockchain.transaction.from
    if (!Blockchain.verifyAddress(author)) {
      throw new Error('invalid author')
    }
    const id = author + '-' + date
    const diaryItem = new DiaryItem()
    diaryItem.id = id
    diaryItem.date = date
    diaryItem.todo = todo
    diaryItem.learn = learn
    diaryItem.relationship = relationship
    diaryItem.health = health
    diaryItem.work = work
    diaryItem.financial = financial
    diaryItem.happiness = happiness
    diaryItem.dream = dream
    diaryItem.emoji = emoji

    this.diaryList.put(id, diaryItem)
    this._saveUserList(author, id)
    return 'success'
  },

  // _deletePreDiary: function(id, author) {
  //   const ids = this.userList.get(author) || []
  //   if (ids.indexOf(id) > -1) {
  //     this.diaryList.delete(id)
  //   }
  // },

  _saveUserList: function(author, id) {
    let ids = this.userList.get(author) || []
    if (ids.indexOf(id) > -1) {
      // id 已存在，不重复保存
      return
    }
    this.userList.put(author, ids.concat(id))
  },

  getDiaryList: function (author) {
    author = author || Blockchain.transaction.from
    if (!author || !Blockchain.verifyAddress(author)) {
      throw new Error('invalid author')
    }
    const ids = this.userList.get(author) || []
    return this._getAllDiaryList(ids)
  },

  _getAllDiaryList: function(ids) {
    let result = []
    if (ids && ids.length) {
      ids.forEach(id => {
        const list = this.diaryList.get(id)
        result = result.concat(list)
      })
    }
    return result
  },
}

module.exports = MorningDiary
