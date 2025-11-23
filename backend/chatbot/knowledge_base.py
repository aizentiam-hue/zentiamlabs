import chromadb
from chromadb.config import Settings
import os
from typing import List, Dict
import logging
import requests
from bs4 import BeautifulSoup
from sentence_transformers import SentenceTransformer
import PyPDF2
import io
from pptx import Presentation

logger = logging.getLogger(__name__)

class KnowledgeBase:
    def __init__(self):
        # Initialize ChromaDB for vector storage (new API)
        self.client = chromadb.PersistentClient(
            path="/app/backend/chroma_db"
        )
        
        # Create or get collection
        try:
            self.collection = self.client.get_or_create_collection(
                name="zentiam_knowledge",
                metadata={"hnsw:space": "cosine"}
            )
        except Exception as e:
            logger.error(f"Error creating collection: {e}")
            self.collection = self.client.create_collection(name="zentiam_knowledge")
        
        # Initialize embedding model
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        logger.info("Knowledge Base initialized")
    
    def add_document(self, doc_id: str, text: str, metadata: Dict = None):
        """Add a document to the knowledge base"""
        try:
            # Split text into chunks for better retrieval
            chunks = self._chunk_text(text)
            
            for i, chunk in enumerate(chunks):
                chunk_id = f"{doc_id}_chunk_{i}"
                embedding = self.embedder.encode(chunk).tolist()
                
                self.collection.add(
                    documents=[chunk],
                    embeddings=[embedding],
                    ids=[chunk_id],
                    metadatas=[metadata or {}]
                )
            
            logger.info(f"Added document {doc_id} with {len(chunks)} chunks")
            return True
        except Exception as e:
            logger.error(f"Error adding document: {e}")
            return False
    
    def query(self, question: str, n_results: int = 3) -> List[str]:
        """Query the knowledge base"""
        try:
            query_embedding = self.embedder.encode(question).tolist()
            
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )
            
            if results and results['documents']:
                return results['documents'][0]
            return []
        except Exception as e:
            logger.error(f"Error querying knowledge base: {e}")
            return []
    
    def _chunk_text(self, text: str, chunk_size: int = 500) -> List[str]:
        """Split text into chunks"""
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            current_chunk.append(word)
            current_size += len(word) + 1
            
            if current_size >= chunk_size:
                chunks.append(' '.join(current_chunk))
                current_chunk = []
                current_size = 0
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks
    
    def crawl_website(self, base_url: str) -> bool:
        """Crawl website pages and add to knowledge base"""
        try:
            pages = [
                f"{base_url}/",
                f"{base_url}/about",
                f"{base_url}/services",
                f"{base_url}/products",
            ]
            
            for page_url in pages:
                try:
                    response = requests.get(page_url, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        
                        # Remove script and style elements
                        for script in soup(["script", "style"]):
                            script.decompose()
                        
                        # Get text
                        text = soup.get_text()
                        lines = (line.strip() for line in text.splitlines())
                        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                        text = ' '.join(chunk for chunk in chunks if chunk)
                        
                        # Add to knowledge base
                        doc_id = page_url.replace(base_url, '').replace('/', '_') or 'home'
                        self.add_document(
                            doc_id=f"website_{doc_id}",
                            text=text,
                            metadata={"source": "website", "url": page_url}
                        )
                        logger.info(f"Crawled: {page_url}")
                except Exception as e:
                    logger.error(f"Error crawling {page_url}: {e}")
            
            return True
        except Exception as e:
            logger.error(f"Error in website crawl: {e}")
            return False
    
    def add_pdf(self, file_content: bytes, filename: str) -> bool:
        """Add PDF content to knowledge base"""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            self.add_document(
                doc_id=f"pdf_{filename}",
                text=text,
                metadata={"source": "pdf", "filename": filename}
            )
            return True
        except Exception as e:
            logger.error(f"Error adding PDF: {e}")
            return False
    
    def add_pptx(self, file_content: bytes, filename: str) -> bool:
        """Add PowerPoint content to knowledge base"""
        try:
            prs = Presentation(io.BytesIO(file_content))
            text = ""
            
            for slide in prs.slides:
                for shape in slide.shapes:
                    if hasattr(shape, "text"):
                        text += shape.text + " "
            
            self.add_document(
                doc_id=f"pptx_{filename}",
                text=text,
                metadata={"source": "pptx", "filename": filename}
            )
            return True
        except Exception as e:
            logger.error(f"Error adding PPTX: {e}")
            return False

# Global instance
knowledge_base = KnowledgeBase()
