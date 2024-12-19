use tauri::Manager;
// use tauri_plugin_sql::{Migration, MigrationKind};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod db;
mod douyin;
mod https;
mod proto;
mod websocket_manager; // 引入模块 // 引入新的 db 模块

// 引入 WebSocketManager
use crate::websocket_manager::WebSocketManager; // 使用相对路径引入模块

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 调用 db 模块中的创建表函数
    let douyin_migrations = db::create_douyin_tables();
    tauri::Builder::default()
        .setup(|app| {
            // 在启动时创建 WebSocket 管理器并注入到全局状态
            let manager = WebSocketManager::new();
            app.manage(manager);
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:douyin.db", douyin_migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            https::make_https_request,
            douyin::live::websocket::connect_to_websocket,
            douyin::live::websocket::close_to_websocket,
            douyin::live::websocket::send_to_websocket,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
