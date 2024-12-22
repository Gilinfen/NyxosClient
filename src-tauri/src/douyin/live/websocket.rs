use crate::websocket_manager::{WebSocketConnection, WebSocketManager};
use anyhow::Result;
use flate2::bufread::GzDecoder;
use futures::{SinkExt, StreamExt};
use prost::Message as _;
use std::io::{self, Read};
use std::{collections::HashMap, sync::Arc};
use tauri::{AppHandle, State};
use tokio::sync::{mpsc, Mutex};
use tokio_tungstenite::tungstenite;
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};
use tungstenite::client::IntoClientRequest;
use tungstenite::http::{HeaderName, HeaderValue};

use crate::douyin::live::process;
use crate::proto::douyin_protos::{PushFrame, Response};

fn decompress(data: &[u8]) -> io::Result<Vec<u8>> {
    let mut gz = GzDecoder::new(data);
    let mut result = Vec::new();
    gz.read_to_end(&mut result)?;
    Ok(result)
}

#[tauri::command]
pub async fn connect_to_websocket(
    app_handle: AppHandle,
    manager: State<'_, Arc<Mutex<WebSocketManager>>>,
    url: String,
    task_id: String,                  // 任务 id
    headers: HashMap<String, String>, // 将 headers 作为参数传入
) -> Result<(), String> {
    // 1. 把 url 转换为一个可修改的 request
    let mut request = url
        .into_client_request()
        .map_err(|e| format!("Invalid WebSocket URL: {}", e))?;

    // 2. 将自定义 headers 注入到 request 中
    {
        let req_headers = request.headers_mut();
        for (k, v) in &headers {
            // 从字符串创建 HeaderName & HeaderValue
            let header_name = HeaderName::from_bytes(k.as_bytes())
                .map_err(|e| format!("Invalid header name {:?}: {}", k, e))?;
            let header_value = HeaderValue::from_str(v)
                .map_err(|e| format!("Invalid header value for {:?}: {}", k, e))?;

            req_headers.insert(header_name, header_value);
        }
    }

    // 3. 使用 connect_async(request) 发起握手
    let (ws_stream, _response) = connect_async(request)
        .await
        .map_err(|e| format!("Failed to connect : {}", e))?;

    // -------------------------
    // 以下是你原有的读/写协程及 mpsc 管理逻辑
    // -------------------------
    // 为发送端和接收端设置 mpsc 管道，方便在其他地方发送消息
    let (tx, rx) = mpsc::unbounded_channel::<Message>();

    // 把 ws_stream 拆分成 读/写
    let (write, mut read) = ws_stream.split();

    // **关键：克隆 tx 给读协程使用**
    let tx_for_read = tx.clone();

    // 读消息协程：读取服务器发来的消息并处理
    let app_handle_clone = app_handle.clone();
    let task_id_clone = task_id.clone();
    let read_handle = tokio::spawn(async move {
        while let Some(Ok(msg)) = read.next().await {
            // 如果是文本或二进制消息，可以处理一下
            if let Message::Binary(bin) = msg {
                let decoded_data = PushFrame::decode(&*bin).expect("PushFrame 解码错误");
                let payload = decompress(&decoded_data.payload).expect("解压缩错误");
                let res_pay = Response::decode(&*payload).expect("Response 解码错误");
                if res_pay.need_ack {
                    let ack = PushFrame {
                        log_id: decoded_data.log_id,
                        payload_type: "ack".to_string(),
                        seq_id: 0,                // 示例：序列号，根据实际需要设置
                        service: 1,               // 示例：服务标识，根据实际需要设置
                        method: 2,                // 示例：方法标识，根据实际需要设置
                        headers_list: Vec::new(), // 示例：如果有头部信息，根据实际需要填充
                        payload_encoding: "gzip".to_string(), // 示例：有效载荷编码方式，如 "gzip"
                        payload: Vec::new(),      // 示例：有效载荷数据，根据实际需要填充
                    };

                    let mut buf = Vec::new();
                    let _ = ack.encode(&mut buf);

                    // 收到二进制数据就回发一个文本 ack
                    if let Err(e) = tx_for_read.send(Message::Binary(buf)) {
                        eprintln!("Failed to send ack: {}", e);
                    }

                    process::process_messages(
                        &app_handle_clone,
                        &res_pay.messages_list,
                        &task_id_clone,
                    )
                }
                // 如果还需要针对 bin 做其他处理，可自行添加
            }
            // 更多类型如 Message::Text(...) 等，根据需求自行处理
        }
    });

    // 写消息协程：接受我们在后续命令中发到 tx 的消息
    let write_handle = tokio::spawn(async move {
        let mut write = write;
        let mut rx = rx;
        while let Some(msg) = rx.recv().await {
            if let Err(e) = write.send(msg).await {
                eprintln!("Error while sending msg: {}", e);
                break;
            }
        }
    });

    // 将两个协程的 handle 合并，方便后续 close 时管理
    let join_handle = tokio::spawn(async move {
        tokio::select! {
          _ = read_handle => (),
          _ = write_handle => (),
        }
    });

    // 注册到 Manager 中
    {
        let mut mgr = manager.lock().await;
        mgr.insert(
            task_id.clone(),
            WebSocketConnection {
                sender: tx,
                join_handle,
            },
        );
    }
    Ok(())
}

#[tauri::command]
pub async fn close_to_websocket(
    manager: State<'_, Arc<Mutex<WebSocketManager>>>,
    task_id: String, // 任务 id
) -> Result<(), String> {
    println!("关闭 WebSocket 任务 🆔：{}", task_id);
    // 异步锁
    let mut mgr = manager.lock().await;

    // 使用我们新增的 remove_connection 方法
    if let Some(conn) = mgr.remove_connection(&task_id) {
        // 先显式发送 Close 帧
        let _ = conn.sender.send(Message::Close(None));

        // 1. 释放发送端
        drop(conn.sender);

        // 2. 取消（或等待）协程
        conn.join_handle.abort();

        Ok(())
    } else {
        Err(format!("Connection {} not found", task_id))
    }
}
