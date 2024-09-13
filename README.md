# Stackup |Bounty - Simple File Server

# Start your server

cargo run

# Test root directory

curl http://localhost:5500

# Test file serving

curl http://localhost:5500/styles.css
curl http://localhost:5500/script.js

# Test subdirectory access

curl http://localhost:5500/subdirectory/

# Test file with CJK characters

curl http://localhost:5500/测试.txt

# Test backtracking (should fail)

curl http://localhost:5500/../Cargo.toml

# Test non-existent file (should return 404)

curl http://localhost:5500/nonexistent.file
