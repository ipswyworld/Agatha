import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import os
import pickle

class RagEngine:
    """
    Retrieval-Augmented Generation Engine for Project Agatha.
    Stores mission logs, intelligence reports, and tool manuals.
    """
    def __init__(self, index_path="agatha_rag.index"):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index_path = index_path
        self.dimension = 384 # Dimension of MiniLM-L6-v2
        self.documents = []
        
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            with open(f"{self.index_path}.docs", "rb") as f:
                self.documents = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(self.dimension)

    def add_to_memory(self, text, metadata=None):
        """Add a document or log entry to the vector store."""
        embedding = self.model.encode([text])
        self.index.add(np.array(embedding).astype('float32'))
        self.documents.append({"text": text, "metadata": metadata})
        self.save()

    def query(self, text, top_k=3):
        """Retrieve relevant context for a given query."""
        if len(self.documents) == 0:
            return []
        
        embedding = self.model.encode([text])
        distances, indices = self.index.search(np.array(embedding).astype('float32'), top_k)
        
        results = []
        for i in indices[0]:
            if i != -1 and i < len(self.documents):
                results.append(self.documents[i])
        return results

    def save(self):
        """Persist the index and documents to disk."""
        faiss.write_index(self.index, self.index_path)
        with open(f"{self.index_path}.docs", "wb") as f:
            pickle.dump(self.documents, f)

if __name__ == "__main__":
    rag = RagEngine()
    rag.add_to_memory("The ShadowMarket onion site uses a modified Nginx server and leaked IP 194.5.6.7.")
    print("Query Result:", rag.query("ShadowMarket IP"))
