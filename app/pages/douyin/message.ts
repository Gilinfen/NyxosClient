import type { MessageType } from '~/db/douyin/message'
export class Message implements MessageType {
  WebcastChatMessage = { label: '聊天消息', dev_status: true } as const
  WebcastMatchAgainstScoreMessage = {
    label: '反对分数消息',
    dev_status: false
  } as const
  WebcastLikeMessage = { label: '点赞消息', dev_status: false } as const
  WebcastMemberMessage = {
    label: '成员进入直播间消息',
    dev_status: false
  } as const
  WebcastGiftMessage = { label: '礼物消息', dev_status: false } as const
  WebcastSocialMessage = { label: '联谊会消息', dev_status: false } as const
  WebcastRoomUserSeqMessage = {
    label: '房间用户发送消息',
    dev_status: false
  } as const
  WebcastUpdateFanTicketMessage = {
    label: '更新粉丝票消息',
    dev_status: false
  } as const
  WebcastCommonTextMessage = {
    label: '公共文本消息',
    dev_status: false
  } as const
  WebcastProductChangeMessage = {
    label: '商品改变消息',
    dev_status: false
  } as const
  WebcastRoomStatsMessage = {
    label: '房间统计消息',
    dev_status: false
  } as const
  WebcastGiftVoteMessage = { label: '礼物投票消息', dev_status: false } as const
  WebcastRanklistHourEntranceMessage = {
    label: '排行榜小时入口消息',
    dev_status: false
  } as const
  WebcastInRoomBannerMessage = {
    label: '房间内横幅消息',
    dev_status: false
  } as const
  WebcastRoomStreamAdaptationMessage = {
    label: '房间流适应消息',
    dev_status: false
  } as const
}
