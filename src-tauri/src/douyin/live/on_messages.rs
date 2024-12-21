use flate2::read::GzDecoder;
use futures::SinkExt;
use prost::Message as _;
use std::io::{self, Read};
use tauri::AppHandle;
use tokio_tungstenite::tungstenite::Message as WsMessage;
use tokio_tungstenite::WebSocketStream; // 使用相对路径引入模块

use crate::douyin::live::process;

use crate::proto::douyin_protos::{PushFrame, Response};

fn decompress(data: &[u8]) -> io::Result<Vec<u8>> {
    let mut gz = GzDecoder::new(data);
    let mut result = Vec::new();
    gz.read_to_end(&mut result)?;
    Ok(result)
}

// 发送ack包
async fn send_ack(
    ws: &mut WebSocketStream<impl tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin>,
    log_id: &u64,
    payload_type: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let ack = PushFrame {
        log_id: *log_id,
        payload_type: payload_type.to_string(),
        seq_id: 0,                            // 示例：序列号，根据实际需要设置
        service: 1,                           // 示例：服务标识，根据实际需要设置
        method: 2,                            // 示例：方法标识，根据实际需要设置
        headers_list: Vec::new(),             // 示例：如果有头部信息，根据实际需要填充
        payload_encoding: "gzip".to_string(), // 示例：有效载荷编码方式，如 "gzip"
        payload: Vec::new(),                  // 示例：有效载荷数据，根据实际需要填充
    };

    let mut buf = Vec::new();
    ack.encode(&mut buf)?;

    ws.send(WsMessage::Binary(buf)).await?;
    println!(
        "{}",
        format!(
            "[sendAck] 发送Ack: log_id: {}, payload_type: {}",
            log_id, payload_type
        )
    );
    Ok(())
}

// 处理 onMessage
pub async fn parse_on_message_response(
    app: &AppHandle,
    ws: &mut WebSocketStream<impl tokio::io::AsyncRead + tokio::io::AsyncWrite + Unpin>,
    data: &[u8],
    live_room_id: &str, // 房间 id
    task_id: &str,      // 任务 id
) {
    let decoded_data = PushFrame::decode(data).expect("PushFrame 解码错误");
    let payload = decompress(&decoded_data.payload).expect("解压缩错误");
    let res_pay = Response::decode(&*payload).expect("Response 解码错误");

    if res_pay.need_ack {
        send_ack(ws, &decoded_data.log_id, "ack")
            .await
            .expect("发送 Ack 错误");
    }

    process::process_messages(app, &res_pay.messages_list, live_room_id, task_id).await;
}

// // 发送ack包
// async fn send_ack(
//     app: &AppHandle,
//     live_room_id: &str,
//     log_id: &u64,
//     internal_ext: &str,
// ) -> Result<(), Box<dyn std::error::Error>> {
//     let manager = app.state::<WebSocketManager>().clone();

//     let ack = PushFrame {
//         log_id: *log_id,
//         payload_type: internal_ext.to_string(),
//         seq_id: 0,                            // 示例：序列号，根据实际需要设置
//         service: 1,                           // 示例：服务标识，根据实际需要设置
//         method: 2,                            // 示例：方法标识，根据实际需要设置
//         headers_list: Vec::new(),             // 示例：如果有头部信息，根据实际需要填充
//         payload_encoding: "gzip".to_string(), // 示例：有效载荷编码方式，如 "gzip"
//         payload: Vec::new(),                  // 示例：有效载荷数据，根据实际需要填充
//     };

//     let mut buf = Vec::new();
//     ack.encode(&mut buf)?;

//     match manager.get_connection(&live_room_id).await {
//         Ok(stream) => {
//             // let mut stream = stream.lock().await; // 锁住 WebSocket 连接

//             // // 发送二进制消息
//             // if let Err(e) = stream.send(WsMessage::Binary(buf)).await {
//             //     eprintln!("[sendAck] 发送二进制消息失败: {}", e);
//             //     return Err(format!("发送二进制消息失败: {}", e).into());
//             // }

//             println!(
//                 "[sendAck] 发送Ack成功: log_id: {}, internal_ext: {}",
//                 log_id, internal_ext
//             );
//             Ok(())
//         }
//         Err(e) => Err(format!("无法找到连接: {}", e).into()),
//     }
// }

// // 处理 onMessage
// pub async fn parse_on_message_response(
//     app: &AppHandle,
//     data: &[u8],
//     live_room_id: &str, // 房间 id
// ) {
//     let decoded_data = PushFrame::decode(data).expect("PushFrame 解码错误");
//     let payload = decompress(&decoded_data.payload).expect("解压缩错误");
//     let res_pay = Response::decode(&*payload).expect("Response 解码错误");

//     send_ack(
//         app,
//         live_room_id,
//         &decoded_data.log_id,
//         &res_pay.internal_ext,
//     )
//     .await
//     .expect("发送 Ack 错误");

//     process::process_messages(app, &res_pay.messages_list, live_room_id).await;
// }
