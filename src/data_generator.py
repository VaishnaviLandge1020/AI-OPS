import time, random, requests

while True:
    cpu_usage = random.randint(10, 95)
    memory_usage = random.randint(30, 90)
    disk_usage = random.randint(20, 95)

    data = f"cpu_usage {cpu_usage}\nmemory_usage {memory_usage}\ndisk_usage {disk_usage}\n"
    requests.post("http://localhost:9091/metrics/job/aiops_synthetic", data=data)
    
    print(f"Sent metrics: CPU={cpu_usage}, MEM={memory_usage}, DISK={disk_usage}")
    time.sleep(5)
