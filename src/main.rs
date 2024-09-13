use std::net::TcpListener;
use std::io::{Read, Write};
use std::fs;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:5500").unwrap();
    println!("Server listening on http://127.0.0.1:5500");

    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        println!("Connected stream...");

        let mut buffer = [0; 1024];
        stream.read(&mut buffer).unwrap();

        let request = String::from_utf8_lossy(&buffer[..]);
        let request_line = request.lines().next().unwrap_or("");
        println!("Request: {}", request_line);

        let response = handle_request(request_line);
        stream.write(response.as_bytes()).unwrap();
        stream.flush().unwrap();
    }
}

fn handle_request(request: &str) -> String {
    let path = request.split_whitespace().nth(1).unwrap_or("/");
    
    if path == "/Cargo.toml" {
        match fs::read_to_string("Cargo.toml") {
            Ok(content) => {
                let content_length = content.len();
                format!(
                    "HTTP/1.1 200 OK\r\n\
                    Content-Type: text/plain\r\n\
                    Content-Length: {}\r\n\
                    Accept-Ranges: bytes\r\n\
                    \r\n\
                    {}",
                    content_length,
                    content
                )
            },
            Err(_) => {
                "HTTP/1.1 404 NOT FOUND\r\nContent-Length: 23\r\n\r\nError: Cargo.toml not found".to_string()
            }
        }
    } else {
        "HTTP/1.1 404 NOT FOUND\r\nContent-Length: 13\r\n\r\n404 Not Found".to_string()
    }
}
