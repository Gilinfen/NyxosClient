use crate::proto::douyin_protos;
use prost::Message;
use tauri::{AppHandle, Emitter};

// 聊天消息
pub async fn un_pack_webcast_chat_message(
    app: &AppHandle,
    task_id: &str,
    payload: &[u8],
) -> Result<(), String> {
    let chat = douyin_protos::ChatMessage::decode(payload);
    if let Ok(chat_message) = chat {
        let msg_id = chat_message.common.as_ref().map(|c| c.msg_id).unwrap_or(0);
        let content = chat_message.content.clone();
        let sec_uid = chat_message
            .user
            .as_ref()
            .map(|u| u.sec_uid.clone())
            .unwrap_or_default();
        let nick_name = chat_message
            .user
            .as_ref()
            .map(|u| u.nick_name.clone())
            .unwrap_or_default();

        let json_message = serde_json::json!({
            "message_id": msg_id,
            "message": content,
            "user_id": sec_uid,
            "user_name": nick_name,
            "task_id": task_id, // 添加 task_id
        });

        // 发送到前端
        if let Err(e) = app.emit("DouyinWebcastChatMessage", json_message) {
            eprintln!("发送聊天消息到前端失败: {}", e);
        }
    } else {
        eprintln!("解码聊天消息失败: {:?}", chat.err()); // 打印解码失败原因
    }

    Ok(())
    // 处理逻辑...
}

// 反对分数消息
// pub fn un_pack_match_against_score_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
//     let against_score = douyin_protos::MatchAgainstScoreMessage::decode(payload);
//     // println!("against_score :{:?}", against_score);
//     // 处理逻辑...
// }

// // 点赞数
// pub fn un_pack_webcast_like_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
//     let like: Result<douyin_protos::LikeMessage, prost::DecodeError> =
//         douyin_protos::LikeMessage::decode(payload);
// }

// 成员进入直播间消息
pub fn un_pack_webcast_member_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
    let member = douyin_protos::MemberMessage::decode(payload);
    // println!("member :{:?}", member);
    if let Ok(member_message) = member {
        let msg_id = member_message
            .common
            .as_ref()
            .map(|c| c.msg_id)
            .unwrap_or(0);
        let sec_uid = member_message
            .user
            .as_ref()
            .map(|u| u.sec_uid.clone())
            .unwrap_or_default();
        let nick_name = member_message
            .user
            .as_ref()
            .map(|u| u.nick_name.clone())
            .unwrap_or_default();
        let member_count = member_message.member_count.clone();
        let json_message = serde_json::json!({
            "message_id":msg_id,
            "member_count": member_count,
            "user_url": sec_uid,
            "user_name": nick_name,
            "task_id": task_id, // 添加 task_id
        });

        // 发送到前端
        if let Err(e) = app.emit("DouyinWebcastMemberMessage", json_message) {
            eprintln!("成员进入消息到前端失败: {}", e);
        }
    } else {
        println!("解码成员进入消息失败");
    }
}

// 礼物消息
pub fn un_pack_webcast_gift_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
    let gift: Result<douyin_protos::GiftMessage, prost::DecodeError> =
        douyin_protos::GiftMessage::decode(payload);

    if let Ok(gift_message) = gift {
        let msg_id = gift_message.common.as_ref().map(|c| c.msg_id).unwrap_or(0);
        let sec_uid = gift_message
            .user
            .as_ref()
            .map(|u| u.sec_uid.clone())
            .unwrap_or_default();
        let nick_name = gift_message
            .user
            .as_ref()
            .map(|u| u.nick_name.clone())
            .unwrap_or_default();
        let group_count = gift_message.group_count.clone();
        let repeat_count = gift_message.repeat_count.clone();
        let combo_count = gift_message.combo_count.clone();
        let priority = gift_message
            .priority
            .as_ref()
            .map(|p| {
                serde_json::json!({
                    "queue_sizes_list": p.queue_sizes_list,
                    "self_queue_priority": p.self_queue_priority,
                    "priority": p.priority,
                })
            })
            .unwrap_or(serde_json::json!(null));

        let gift = gift_message.gift.as_ref().map(|gif| {
            serde_json::json!({
                "name": gif.name,
                "id": gif.id,
            })
        });

        let image = gift_message
            .gift
            .as_ref()
            .and_then(|g| g.image.as_ref())
            .map(|img| {
                serde_json::json!({
                    "url_list_list": img.url_list_list,
                    "uri": img.uri,
                    "height": img.height,
                    "width": img.width,
                    "avg_color": img.avg_color,
                    "image_type": img.image_type,
                    "open_web_url": img.open_web_url,
                    "content": img.content.as_ref().map(|c| {
                        serde_json::json!({
                            "name": c.name,
                            "font_color": c.font_color,
                            "level": c.level,
                            "alternative_text": c.alternative_text,
                        })
                    }),
                    "is_animated": img.is_animated,
                    "flex_setting_list": img.flex_setting_list.as_ref().map(|f| {
                        serde_json::json!({
                            "setting_list_list": f.setting_list_list,
                        })
                    }),
                    "text_setting_list": img.text_setting_list.as_ref().map(|t| {
                        serde_json::json!({
                            "setting_list_list": t.setting_list_list,
                        })
                    }),
                })
            })
            .unwrap_or(serde_json::json!(null));

        let json_message = serde_json::json!({
            "message_id": msg_id,
            "group_count": group_count,
            "repeat_count": repeat_count,
            "combo_count": combo_count,
            "priority": priority,
            "user_id": sec_uid,
            "user_name": nick_name,
            "task_id": task_id, // 添加 task_id
            "image": image, // 添加 image
            "gift": gift, // 添加 image
        });

        // 发送到前端
        if let Err(e) = app.emit("DouyinWebcastGiftMessage", json_message) {
            eprintln!("礼物消息发送到前端失败: {}", e);
        }
    } else {
        println!("解码礼物消息失败");
    }
}

// // 联谊会消息
// pub fn un_pack_webcast_social_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
//     let social = douyin_protos::SocialMessage::decode(payload);
//     // println!("social :{:?}", social);
//     // 处理逻辑...
// }

// // 房间用户发送消息
// pub fn un_pack_webcast_room_user_seq_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
//     let room_user_seq = douyin_protos::RoomUserSeqMessage::decode(payload);
//     // println!("room_user_seq :{:?}", room_user_seq);
//     // 处理逻辑...
// }

// // 更新粉丝票
// pub fn un_pack_webcast_update_fan_ticket_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
//     let update_fan_ticket = douyin_protos::UpdateFanTicketMessage::decode(payload);
//     // println!("update_fan_ticket :{:?}", update_fan_ticket);
//     // 处理逻辑...
// }

// // 公共文本消息
// pub fn un_pack_webcast_common_text_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
//     let common_text = douyin_protos::CommonTextMessage::decode(payload);
//     // println!("common_text :{:?}", common_text);
//     // 处理逻辑...
// }

// // 这里是处理函数的示例
// pub fn un_pack_webcast_product_change_message(app: &AppHandle, task_id: &str, payload: &[u8]) {
//     let product_change = douyin_protos::ProductChangeMessage::decode(payload);
//     // println!("product_change :{:?}", product_change);
//     // 处理逻辑...
// }
