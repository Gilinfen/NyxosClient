// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod https;
mod window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![https::make_https_request])
        .setup(|app| {
            let app_handle = app.handle(); // 获取 AppHandle
            window::create_main_window(app_handle);
            window::create_login_window(app_handle);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
