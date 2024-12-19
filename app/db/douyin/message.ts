export interface MessageType {
  /** 反对分数消息 */
  WebcastMatchAgainstScoreMessage: {
    label: '反对分数消息'
    dev_status: false
  }
  /** 点赞消息 */
  WebcastLikeMessage: {
    label: '点赞消息'
    dev_status: false
  }
  /** 成员进入直播间消息 */
  WebcastMemberMessage: {
    label: '成员进入直播间消息'
    dev_status: false
  }
  /** 礼物消息 */
  WebcastGiftMessage: {
    label: '礼物消息'
    dev_status: false
  }
  /** 聊天消息 */
  WebcastChatMessage: {
    label: '聊天消息'
    dev_status: true
  }
  /** 联谊会消息 */
  WebcastSocialMessage: {
    label: '联谊会消息'
    dev_status: false
  }
  /** 房间用户发送消息 */
  WebcastRoomUserSeqMessage: {
    label: '房间用户发送消息'
    dev_status: false
  }
  /** 更新粉丝票消息 */
  WebcastUpdateFanTicketMessage: {
    label: '更新粉丝票消息'
    dev_status: false
  }
  /** 公共文本消息 */
  WebcastCommonTextMessage: {
    label: '公共文本消息'
    dev_status: false
  }
  /** 商品改变消息 */
  WebcastProductChangeMessage: {
    label: '商品改变消息'
    dev_status: false
  }
  /** 房间统计消息 */
  WebcastRoomStatsMessage: {
    label: '房间统计消息'
    dev_status: false
  }
  /** 礼物投票消息 */
  WebcastGiftVoteMessage: {
    label: '礼物投票消息'
    dev_status: false
  }
  /** 排行榜小时入口消息 */
  WebcastRanklistHourEntranceMessage: {
    label: '排行榜小时入口消息'
    dev_status: false
  }
  /** 房间内横幅消息 */
  WebcastInRoomBannerMessage: {
    label: '房间内横幅消息'
    dev_status: false
  }
  /** 房间流适应消息 */
  WebcastRoomStreamAdaptationMessage: {
    label: '房间流适应消息'
    dev_status: false
  }
  // 其他字段可以根据需要添加
}
