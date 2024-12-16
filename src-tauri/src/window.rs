use tauri::{AppHandle, WebviewUrl, WebviewWindowBuilder};

pub fn create_login_window(app: &AppHandle) {
    let _ = WebviewWindowBuilder::new(
        app,
        "login",                              // 窗口的唯一标识符
        WebviewUrl::App("login.html".into()), // 指定窗口加载的页面
    )
    .title("Login Window") // 窗口标题
    .inner_size(400.0, 300.0) // 窗口大小
    .build();
}

pub fn create_main_window(app: &AppHandle) {
    let _ = WebviewWindowBuilder::new(
        app,
        "main",                               // 窗口的唯一标识符
        WebviewUrl::App("index.html".into()), // 指定窗口加载的页面
    )
    .title("Main Window") // 窗口标题
    .inner_size(800.0, 600.0) // 窗口大小
    .build();
}
