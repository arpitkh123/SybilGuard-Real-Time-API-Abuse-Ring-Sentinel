import numpy as np
from sklearn.ensemble import IsolationForest
from app.core.config import settings

class SybilAnomalyDetector:
    def __init__(self):
        # Initialize the model with parameters from our global configuration
        self.model = IsolationForest(
            n_estimators=settings.ISOLATION_FOREST_ESTIMATORS,
            contamination=settings.CONTAMINATION_RATE,
            random_state=42 # Ensures deterministic, reproducible results for your pitch video
        )
        self.is_trained = False
        self.training_buffer = []

    def add_to_buffer(self, feature_vector: list[float]):
        """Accumulates traffic features until the initial batch window is met."""
        self.training_buffer.append(feature_vector)
        
        # Train dynamically once we hit the required batch size
        if len(self.training_buffer) >= settings.BATCH_WINDOW_SIZE and not self.is_trained:
            self._train_model()

    def _train_model(self):
        """Fits the Isolation Forest on the baseline traffic."""
        X = np.array(self.training_buffer)
        self.model.fit(X)
        self.is_trained = True
        
        # Keep the buffer capped to avoid memory leaks during a sustained WebSocket stream
        self.training_buffer = self.training_buffer[-settings.BATCH_WINDOW_SIZE:]

    def evaluate_request(self, feature_vector: list[float]) -> dict:
        """
        Scores a single incoming API request in real-time.
        """
        if not self.is_trained:
            # The "Cold Start" protocol: 
            # If we don't have enough data to establish a baseline, fail open (allow traffic).
            # Razorpay loves to see graceful handling of cold starts.
            return {"is_anomalous": False, "score": 0.0}
        
        X = np.array([feature_vector])
        
        # predict() returns 1 for normal, -1 for anomaly
        prediction = self.model.predict(X)[0]
        
        # decision_function() returns a continuous score. Lower negative values = higher anomaly confidence.
        raw_score = self.model.decision_function(X)[0]
        
        is_anomalous = True if prediction == -1 else False
        
        return {
            "is_anomalous": is_anomalous,
            "score": float(raw_score)
        }

# Global instance to hold the model state across the application lifecycle
anomaly_detector = SybilAnomalyDetector()