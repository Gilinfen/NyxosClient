export interface DouyinMessageType {
  /** 反对分数消息 */
  DouyinWebcastMatchAgainstScoreMessage: {
    label: '反对分数消息'
    dev_status: false
  }
  /** 点赞消息 */
  DouyinWebcastLikeMessage: {
    label: '点赞消息'
    dev_status: false
  }
  /** 成员进入直播间消息 */
  DouyinWebcastMemberMessage: {
    label: '成员进入直播间消息'
    dev_status: false
    payload?: {
      message_id: string
      member_count: number
      user_id: string
      user_name: string
    }
  }
  /** 礼物消息 */
  DouyinWebcastGiftMessage: {
    label: '礼物消息'
    dev_status: false
  }
  /** 聊天消息 */
  DouyinWebcastChatMessage: {
    label: '聊天消息'
    dev_status: true
    payload?: {
      message_id: string
      user_id: string
      user_name: string
      message: string
    }
  }
  /** 联谊会消息 */
  DouyinWebcastSocialMessage: {
    label: '联谊会消息'
    dev_status: false
  }
  /** 房间用户发送消息 */
  DouyinWebcastRoomUserSeqMessage: {
    label: '房间用户发送消息'
    dev_status: false
  }
  /** 更新粉丝票消息 */
  DouyinWebcastUpdateFanTicketMessage: {
    label: '更新粉丝票消息'
    dev_status: false
  }
  /** 公共文本消息 */
  DouyinWebcastCommonTextMessage: {
    label: '公共文本消息'
    dev_status: false
  }
  /** 商品改变消息 */
  DouyinWebcastProductChangeMessage: {
    label: '商品改变消息'
    dev_status: false
  }
  /** 房间统计消息 */
  DouyinWebcastRoomStatsMessage: {
    label: '房间统计消息'
    dev_status: false
  }
  /** 礼物投票消息 */
  DouyinWebcastGiftVoteMessage: {
    label: '礼物投票消息'
    dev_status: false
  }
  /** 排行榜小时入口消息 */
  DouyinWebcastRanklistHourEntranceMessage: {
    label: '排行榜小时入口消息'
    dev_status: false
  }
  /** 房间内横幅消息 */
  DouyinWebcastInRoomBannerMessage: {
    label: '房间内横幅消息'
    dev_status: false
  }
  /** 房间流适应消息 */
  DouyinWebcastRoomStreamAdaptationMessage: {
    label: '房间流适应消息'
    dev_status: false
  }
  // 其他字段可以根据需要添加
}
