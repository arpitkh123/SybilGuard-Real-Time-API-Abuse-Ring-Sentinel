import numpy as np
from collections import defaultdict, deque
from app.models.schemas import IncomingTraffic

class NetworkFeatureExtractor:
    def __init__(self, window_size: int = 50):
        self.window_size = window_size
        # State tracking: mapping ASNs to a sliding window of recent timestamps
        self.asn_history = defaultdict(lambda: deque(maxlen=window_size))
        
    def extract_features(self, traffic: IncomingTraffic) -> list[float]:
        """
        Converts raw network and payload data into a 2D numerical vector
        for the Isolation Forest to process.
        """
        asn = traffic.network_telemetry.asn
        current_time = traffic.network_telemetry.timestamp
        
        # 1. Update the state with the current request
        self.asn_history[asn].append(current_time)
        
        # 2. Calculate ASN Velocity (Requests per network segment)
        # A sudden spike from a single ASN is a strong botnet indicator.
        asn_velocity = len(self.asn_history[asn])
        
        # 3. Calculate Network Jitter (Variance in time between requests)
        jitter = 0.0
        if asn_velocity > 1:
            # Extract the raw timestamps for this ASN
            timestamps = list(self.asn_history[asn])
            # Calculate the delta (in seconds) between each consecutive request
            time_diffs = [
                (timestamps[i] - timestamps[i-1]).total_seconds() 
                for i in range(1, asn_velocity)
            ]
            # Jitter is the statistical variance of these time differences
            if len(time_diffs) > 0:
                jitter = np.var(time_diffs)
                
        # 4. Extract Payload Features
        # Botnets often test specific low-value amounts repeatedly.
        transaction_amount = traffic.payment_payload.amount
        
        # Return the extracted feature vector
        # [Velocity, Jitter, Amount]
        return [float(asn_velocity), float(jitter), float(transaction_amount)]

# Instantiate a global extractor to hold state across API requests
feature_extractor = NetworkFeatureExtractor()