def resolve_alert(alert_type):
    if alert_type == "cpu":
        print("Trying to stop unnecessary processes... ✅ Resolved")
    else:
        print("Alert sent to admin 🚨")

# Example usage
resolve_alert("cpu")
