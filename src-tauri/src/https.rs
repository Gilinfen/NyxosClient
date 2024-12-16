use reqwest::Client;
use std::collections::HashMap;

#[tauri::command]
pub async fn make_https_request(
    url: &str,
    method: &str,
    headers: Option<HashMap<String, String>>,
    body: Option<String>,
) -> Result<String, String> {
    let client = Client::new();
    let request_builder = match method.to_lowercase().as_str() {
        "get" => client.get(url),
        "post" => client.post(url),
        "put" => client.put(url),
        "delete" => client.delete(url),
        _ => return Err("Unsupported HTTP method".into()),
    };
    let request_builder = if let Some(headers) = headers {
        let headers = headers
            .into_iter()
            .map(|(k, v)| {
                (
                    reqwest::header::HeaderName::from_bytes(k.as_bytes()).unwrap(),
                    reqwest::header::HeaderValue::from_str(&v).unwrap(),
                )
            })
            .collect();
        request_builder.headers(headers)
    } else {
        request_builder
    };

    let request_builder = if let Some(body) = body {
        request_builder.body(body)
    } else {
        request_builder
    };

    match request_builder.send().await {
        Ok(response) => match response.text().await {
            Ok(text) => Ok(text),
            Err(err) => Err(format!("Failed to read response text: {}", err)),
        },
        Err(err) => Err(format!("Request failed: {}", err)),
    }
}
