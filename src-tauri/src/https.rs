use reqwest::Client;
use std::collections::HashMap;

#[tauri::command]
pub async fn make_https_request(
    url: &str,
    method: &str,
    headers: Option<HashMap<String, String>>,
    body: Option<String>,
) -> Result<(String, HashMap<String, String>), String> {
    // 修改返回类型为包含响应头的元组
    let client = Client::new();
    let request_builder = match method.to_lowercase().as_str() {
        "get" => client.get(url),
        "post" => client.post(url),
        "put" => client.put(url),
        "delete" => client.delete(url),
        _ => return Err("Unsupported HTTP method".into()),
    };

    // 直接使用传入的headers覆盖原有的headers
    let request_builder = request_builder.headers(
        headers
            .map(|headers| {
                headers
                    .into_iter()
                    .map(|(k, v)| {
                        (
                            reqwest::header::HeaderName::from_bytes(k.as_bytes()).unwrap(),
                            reqwest::header::HeaderValue::from_str(&v).unwrap(),
                        )
                    })
                    .collect()
            })
            .unwrap_or_default(),
    );

    let request_builder = if let Some(body) = body {
        request_builder.body(body)
    } else {
        request_builder
    };

    match request_builder.send().await {
        Ok(response) => {
            let headers = response
                .headers()
                .iter()
                .map(|(k, v)| (k.to_string(), v.to_str().unwrap_or("").to_string()))
                .collect::<HashMap<_, _>>(); // 获取响应头
            match response.text().await {
                Ok(text) => Ok((text, headers)), // 返回响应文本和响应头
                Err(err) => Err(format!("Failed to read response text: {}", err)),
            }
        }
        Err(err) => Err(format!("Request failed: {}", err)),
    }
}
