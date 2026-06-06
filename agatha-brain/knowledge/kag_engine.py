import networkx as nx
import json
import os

class KagEngine:
    """
    Knowledge-Augmented Generation Engine for Project Agatha.
    Maintains a semantic graph of tools, threats, and counter-measures.
    """
    def __init__(self, graph_path="agatha_kag.json"):
        self.graph = nx.DiGraph()
        self.graph_path = graph_path
        if os.path.exists(self.graph_path):
            self.load()
        else:
            self._initialize_base_knowledge()

    def _initialize_base_knowledge(self):
        """Seed the graph with basic cybersecurity relationships."""
        # Example relationships: Threat -> Vulnerability -> Shadow (Attack) -> Pillar (Defense)
        self.add_relationship("Ransomware", "Data Integrity", "THREATENS")
        self.add_relationship("SQL Injection", "Database", "EXPLOITS")
        self.add_relationship("SQL Injection", "Input Validation", "COUNTERED_BY")
        self.add_relationship("Rootkit", "Kernel", "INFECTS")
        self.add_relationship("Rootkit", "Kernel Integrity Check", "COUNTERED_BY")
        self.save()

    def add_relationship(self, source, target, relation_type):
        """Add a semantic link between two concepts."""
        self.graph.add_edge(source, target, relation=relation_type)

    def get_related_concepts(self, concept):
        """Find all nodes linked to a concept."""
        if concept not in self.graph:
            return []
        
        related = []
        for neighbor in self.graph.neighbors(concept):
            edge_data = self.graph.get_edge_data(concept, neighbor)
            related.append({"concept": neighbor, "relation": edge_data['relation']})
        return related

    def suggest_counter_measure(self, threat):
        """Traverse the graph to find a defense for a threat."""
        related = self.get_related_concepts(threat)
        for r in related:
            if r['relation'] == "COUNTERED_BY":
                return r['concept']
        return None

    def save(self):
        """Save graph to JSON."""
        data = nx.node_link_data(self.graph)
        with open(self.graph_path, 'w') as f:
            json.dump(data, f)

    def load(self):
        """Load graph from JSON."""
        with open(self.graph_path, 'r') as f:
            data = json.load(f)
            self.graph = nx.node_link_graph(data)

if __name__ == "__main__":
    kag = KagEngine()
    print("Related to Rootkit:", kag.get_related_concepts("Rootkit"))
    print("Counter-measure for SQL Injection:", kag.suggest_counter_measure("SQL Injection"))
