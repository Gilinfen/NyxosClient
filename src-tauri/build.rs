fn main() {
    tauri_build::build();
    prost_build::compile_protos(&["protos/dy.proto"], &["protos/"])
        .expect("Failed to compile protos");
}
