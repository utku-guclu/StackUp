# Advanced Vector Search Engine 🔍

## Overview

This project implements an advanced vector search engine using ChromaDB and CLIP model for efficient image retrieval based on natural language queries. The system provides high-performance search capabilities with detailed metrics and a user-friendly interface.

### Key Features

- 🎯 Efficient vector search using ChromaDB
- 🖼️ CLIP model for image and text embedding
- 📊 Detailed performance metrics
- 🚀 Real-time search with sub-second response
- 💻 User-friendly Gradio interface
- 🔄 Automatic error handling and recovery
- 📈 Performance monitoring and logging

## Installation

### Prerequisites

- Python 3.8+
- PyTorch
- CUDA-capable GPU (optional, but recommended)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/vector-search-engine.git
cd vector-search-engine
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create an images directory and add your images:

```bash
mkdir images
# Add your .jpg, .jpeg, or .png images to the images directory
```

4. Run the application:

```bash
python app.py
```

## Usage

1. The application will automatically index all images in the `images` directory on startup
2. Access the web interface at `http://localhost:7860`
3. Enter natural language queries to search for images
4. View results and performance metrics in real-time

## Performance Metrics

The system tracks several key performance metrics:

- Ingestion time per image
- Query response time
- Search accuracy based on cosine similarity
- System resource usage

## Technical Details

- Vector Database: ChromaDB
- Embedding Model: CLIP (ViT-B/32)
- Frontend: Gradio
- Performance Monitoring: Custom metrics system

## Project Structure

```
vector-search-engine/
├── app.py              # Main application file
├── images/            # Directory for image storage
├── requirements.txt   # Project dependencies
└── README.md         # Project documentation
```

## Performance Optimizations

1. Batch processing for image ingestion
2. Efficient vector similarity search using ChromaDB
3. Caching of frequently accessed embeddings
4. Asynchronous image processing pipeline

## Demo Video 🎥

[Link to demo video]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Contact

For questions or feedback, please open an issue in the repository.
