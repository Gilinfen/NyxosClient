use prost::Message;
use tauri::AppHandle;

use crate::proto::douyin_protos;

// 聊天消息
pub fn un_pack_webcast_chat_message(app: &AppHandle, payload: &[u8]) {
    let chat = douyin_protos::ChatMessage::decode(payload);
    println!("chat :{:?}", chat);
    // 处理逻辑...
}

// 反对分数消息
pub fn un_pack_match_against_score_message(app: &AppHandle, payload: &[u8]) {
    let against_score = douyin_protos::MatchAgainstScoreMessage::decode(payload);
    // println!("against_score :{:?}", against_score);
    // 处理逻辑...
}

// 点赞数
pub fn un_pack_webcast_like_message(app: &AppHandle, payload: &[u8]) {
    let like: Result<douyin_protos::LikeMessage, prost::DecodeError> =
        douyin_protos::LikeMessage::decode(payload);
}

// 成员进入直播间消息
pub fn un_pack_webcast_member_message(app: &AppHandle, payload: &[u8]) {
    let member = douyin_protos::MemberMessage::decode(payload);
    // println!("member :{:?}", member);
}

// 礼物消息
pub fn un_pack_webcast_gift_message(app: &AppHandle, payload: &[u8]) {
    let gift: Result<douyin_protos::GiftMessage, prost::DecodeError> =
        douyin_protos::GiftMessage::decode(payload);
}

// 联谊会消息
pub fn un_pack_webcast_social_message(app: &AppHandle, payload: &[u8]) {
    let social = douyin_protos::SocialMessage::decode(payload);
    // println!("social :{:?}", social);
    // 处理逻辑...
}
// 房间用户发送消息
pub fn un_pack_webcast_room_user_seq_message(app: &AppHandle, payload: &[u8]) {
    let room_user_seq = douyin_protos::RoomUserSeqMessage::decode(payload);
    // println!("room_user_seq :{:?}", room_user_seq);
    // 处理逻辑...
}
// 更新粉丝票
pub fn un_pack_webcast_update_fan_ticket_message(app: &AppHandle, payload: &[u8]) {
    let update_fan_ticket = douyin_protos::UpdateFanTicketMessage::decode(payload);
    // println!("update_fan_ticket :{:?}", update_fan_ticket);
    // 处理逻辑...
}
// 公共文本消息
pub fn un_pack_webcast_common_text_message(app: &AppHandle, payload: &[u8]) {
    let common_text = douyin_protos::CommonTextMessage::decode(payload);
    // println!("common_text :{:?}", common_text);
    // 处理逻辑...
}
// 这里是处理函数的示例
pub fn un_pack_webcast_product_change_message(app: &AppHandle, payload: &[u8]) {
    let product_change = douyin_protos::ProductChangeMessage::decode(payload);
    // println!("product_change :{:?}", product_change);
    // 处理逻辑...
}
