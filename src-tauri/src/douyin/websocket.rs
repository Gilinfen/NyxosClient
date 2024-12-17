use std::collections::HashMap;
use tokio_tungstenite::{
    connect_async, tungstenite::http::Request, tungstenite::protocol::Message,
};

#[tauri::command]
pub async fn connect_to_websocket(
    url: &str,
    headers: HashMap<String, String>, // 将headers作为参数传入
) -> Result<(), String> {
    println!("开始连接到"); // 修改为中文提示

    let mut request_builder = Request::builder().uri(url);

    // 遍历headers并添加到请求中
    for (key, value) in headers {
        request_builder = request_builder.header(key, value);
    }

    let request = request_builder.body(()).unwrap();

    // 尝试建立异步 WebSocket 连接
    match connect_async(request).await {
        Ok((stream, _response)) => {
            println!("WebSocket connection success");
        }
        Err(e) => {
            println!("WebSocket connection error: {}", e);
        }
    };

    Ok(())
}
