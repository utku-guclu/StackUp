import torch
import chromadb
from PIL import Image
import gradio as gr
import time
from transformers import CLIPProcessor, CLIPModel
from sklearn.metrics.pairwise import cosine_similarity
import os
from typing import List, Tuple, Dict, Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VectorSearchEngine:
    def __init__(self, collection_name: str = "multimedia_collection"):
        """Initialize the vector search engine with CLIP model and ChromaDB."""
        self.client = chromadb.PersistentClient(path="./chroma_db")
        self.collection_name = collection_name
        self.setup_collection()
        self.load_models()
        self.performance_metrics = {
            'total_queries': 0,
            'avg_query_time': 0,
            'avg_accuracy': 0
        }

    def setup_collection(self) -> None:
        """Setup ChromaDB collection with proper error handling."""
        try:
            # Try to get existing collection
            self.collection = self.client.get_collection(name=self.collection_name)
            logger.info(f"Retrieved existing collection: {self.collection_name}")
        except Exception as e:
            logger.info(f"Collection not found, creating new one: {self.collection_name}")
            # Create new collection if not found
            self.collection = self.client.create_collection(
                name=self.collection_name,
                metadata={"description": "Multimedia vector search collection"}
            )

    def load_models(self) -> None:
        """Load CLIP model and processor with error handling."""
        try:
            self.model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
            self.processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
            logger.info("Successfully loaded CLIP model and processor")
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            raise

    def process_image(self, image_path: str) -> torch.Tensor:
        """Process single image and return embedding."""
        try:
            image = Image.open(image_path)
            inputs = self.processor(images=image, return_tensors="pt", padding=True)
            with torch.no_grad():
                return self.model.get_image_features(**inputs)
        except Exception as e:
            logger.error(f"Error processing image {image_path}: {str(e)}")
            raise

    def ingest_images(self, image_paths: List[str]) -> Dict:
        """Ingest multiple images with performance tracking."""
        start_time = time.time()
        embeddings = []
        processed_paths = []

        for path in image_paths:
            try:
                embedding = self.process_image(path)
                embeddings.append(embedding.numpy().tolist()[0])
                processed_paths.append(path)
                logger.info(f"Successfully processed: {path}")
            except Exception as e:
                logger.error(f"Failed to process {path}: {str(e)}")
                continue

        # Add to collection if we have processed images
        if processed_paths:
            try:
                self.collection.add(
                    embeddings=embeddings,
                    metadatas=[{"path": path, "type": "image"} for path in processed_paths],
                    ids=[f"img_{i}" for i in range(len(processed_paths))]
                )
                logger.info(f"Successfully added {len(processed_paths)} images to collection")
            except Exception as e:
                logger.error(f"Error adding to collection: {str(e)}")
                raise

        end_time = time.time()
        metrics = {
            "ingestion_time": end_time - start_time,
            "processed_images": len(processed_paths),
            "failed_images": len(image_paths) - len(processed_paths)
        }
        
        return metrics

    def search(self, query: str, top_k: int = 3) -> Tuple[List[str], Dict]:
        """Perform vector search with detailed metrics."""
        start_time = time.time()
        
        try:
            # Generate query embedding
            inputs = self.processor(text=query, return_tensors="pt", padding=True)
            with torch.no_grad():
                query_embedding = self.model.get_text_features(**inputs).numpy().tolist()

            # Perform search
            results = self.collection.query(
                query_embeddings=query_embedding,
                n_results=top_k
            )

            # Calculate metrics
            query_time = time.time() - start_time
            
            # Update performance metrics
            self.performance_metrics['total_queries'] += 1
            self.performance_metrics['avg_query_time'] = (
                (self.performance_metrics['avg_query_time'] * (self.performance_metrics['total_queries'] - 1) +
                 query_time) / self.performance_metrics['total_queries']
            )

            metrics = {
                "query_time": query_time,
                "results_found": len(results['metadatas'][0]),
                "distances": results['distances'][0]
            }

            return [meta["path"] for meta in results['metadatas'][0]], metrics
        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            raise

def create_gradio_interface(search_engine: VectorSearchEngine):
    """Create Gradio interface with enhanced features."""
    def search_and_display(query: str) -> Tuple[List[Image.Image], str, str]:
        if not query.strip():
            return [], "Please enter a query", ""

        try:
            paths, metrics = search_engine.search(query)
            images = [Image.open(path) for path in paths]
            
            # Format metrics for display
            metrics_display = (
                f"Query Time: {metrics['query_time']:.4f}s\n"
                f"Results Found: {metrics['results_found']}\n"
                f"Average Similarity: {sum(metrics['distances'])/len(metrics['distances']):.4f}"
            )
            
            return images, metrics_display, ""
        except Exception as e:
            return [], f"Error: {str(e)}", str(e)

    # Create interface
    with gr.Blocks(title="Enhanced Vector Search") as interface:
        gr.Markdown("# Advanced Vector Search Engine")
        
        with gr.Row():
            with gr.Column(scale=2):
                query_input = gr.Textbox(
                    placeholder="Enter your search query...",
                    label="Search Query"
                )
                search_button = gr.Button("Search", variant="primary")
            
            with gr.Column(scale=3):
                gallery = gr.Gallery(
                    label="Search Results",
                    show_label=True,
                    columns=3,  # Updated: using columns parameter instead of style
                    height="auto"
                )
                
        metrics_output = gr.Textbox(label="Search Metrics")
        error_output = gr.Textbox(label="Status/Error Messages")

        # Bind search function
        search_button.click(
            fn=search_and_display,
            inputs=[query_input],
            outputs=[gallery, metrics_output, error_output]
        )

    return interface

def main():
    """Main function to initialize and run the application."""
    try:
        # Initialize search engine
        search_engine = VectorSearchEngine()

        # Sample image directory
        image_dir = "images"
        if not os.path.exists(image_dir):
            os.makedirs(image_dir)
            logger.info(f"Created image directory: {image_dir}")

        # Ingest images
        image_paths = [os.path.join(image_dir, f) for f in os.listdir(image_dir) 
                      if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        if image_paths:
            try:
                metrics = search_engine.ingest_images(image_paths)
                logger.info(f"Ingestion metrics: {metrics}")
            except Exception as e:
                logger.error(f"Error during image ingestion: {str(e)}")
        else:
            logger.warning(f"No images found in {image_dir}")

        # Create and launch Gradio interface
        interface = create_gradio_interface(search_engine)
        interface.launch(share=True)
        
    except Exception as e:
        logger.error(f"Application error: {str(e)}")
        raise

if __name__ == "__main__":
    main()
