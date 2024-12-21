use futures_util::{SinkExt, StreamExt};
use std::collections::HashMap;
use tauri::AppHandle;
use tokio_tungstenite::{
    connect_async, tungstenite::http::Request, tungstenite::protocol::Message,
}; // 用于处理流和发送消息

use crate::douyin::live::on_messages::parse_on_message_response;

#[tauri::command]
pub async fn connect_to_websocket(
    app: AppHandle,
    url: &str,
    live_room_id: &str,               // 房间 id
    task_id: &str,                    // 任务 id
    headers: HashMap<String, String>, // 将headers作为参数传入
) -> Result<(), String> {
    println!("开始连接到 WebSocket：{}", url);

    let live_room_id = live_room_id.to_string(); // 将 live_room_id 转换为 String
    let task_id = task_id.to_string(); // 将 live_room_id 转换为 String

    let mut request_builder = Request::builder().uri(url);

    // 遍历headers并添加到请求中
    for (key, value) in headers {
        request_builder = request_builder.header(key, value);
    }

    let request = request_builder.body(()).unwrap();

    // 尝试建立异步 WebSocket 连接
    match connect_async(request).await {
        Ok((mut stream, _response)) => {
            println!("WebSocket 连接成功");
            // 异步处理消息
            tokio::spawn(async move {
                // 循环接收消息
                while let Some(message) = stream.next().await {
                    match message {
                        Ok(Message::Text(text)) => {
                            println!("接收到文本消息: {}", text);
                            // 在这里处理收到的文本消息
                        }
                        Ok(Message::Binary(bin)) => {
                            // println!("接收到二进制消息: {:?}", bin);
                            parse_on_message_response(
                                &app,
                                &mut stream,
                                &bin,
                                &live_room_id,
                                &task_id,
                            )
                            .await;
                            // 使用 &live_room_id
                            // 在这里处理收到的二进制消息
                        }
                        Ok(Message::Ping(ping)) => {
                            println!("接收到 Ping 消息: {:?}", ping);
                            // 发送 Pong 响应
                            if let Err(e) = stream.send(Message::Pong(ping)).await {
                                eprintln!("发送 Pong 响应失败: {}", e);
                            }
                        }
                        Ok(Message::Pong(pong)) => {
                            println!("接收到 Pong 消息: {:?}", pong);
                        }
                        Ok(Message::Close(close)) => {
                            println!("接收到关闭消息: {:?}", close);
                            break; // 如果收到关闭消息，则退出循环
                        }
                        Err(e) => {
                            eprintln!("接收消息时出错: {}", e);
                            break;
                        }
                    }
                }
            });
        }
        Err(e) => {
            println!("WebSocket 连接失败: {}", e);
            return Err(format!("WebSocket connection error: {}", e));
        }
    };

    Ok(())
}
