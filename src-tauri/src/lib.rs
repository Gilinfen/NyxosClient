// use tauri_plugin_sql::{Migration, MigrationKind};
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::Arc;
use tokio::sync::Mutex;

mod db;
mod douyin;
mod https;
mod proto;
mod websocket_manager;

// 引入 WebSocketManager
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 调用 db 模块中的创建表函数
    let douyin_migrations = db::create_douyin_tables();
    tauri::Builder::default()
        // 在 Tauri 中把我们的 Manager 注入到全局 state
        .manage(Arc::new(Mutex::new(
            websocket_manager::WebSocketManager::new(),
        )))
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
