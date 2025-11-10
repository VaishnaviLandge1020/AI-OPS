import numpy as np
from sklearn.ensemble import IsolationForest
import time

model = IsolationForest(contamination=0.1)
data = []

while True:
    metric = np.random.randint(10, 95)
    data.append(metric)

    if len(data) > 30:
        X = np.array(data[-30:]).reshape(-1, 1)
        preds = model.fit_predict(X)

        if preds[-1] == -1:
            print(f"[ALERT] Anomaly detected! Metric value: {metric}")
        else:
            print(f"Metric OK: {metric}")

    time.sleep(2)
