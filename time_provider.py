from datetime import datetime
import pytz
import time

est_tz = pytz.timezone("America/New_York")


_last_ping_time = None

def get_current_date_MMDDYYYY():
    now_est = datetime.now(est_tz)
    return now_est.strftime("%m/%d/%Y")

def get_current_time_12hr():
    now_est = datetime.now(est_tz)
    return now_est.strftime("%I:%M:%S %p")

def ping():
    global _last_ping_time

    current_time = time.time()
    if _last_ping_time is None:
        _last_ping_time = current_time
        return {"seconds": 0.0, "milliseconds": 0.0}
    else:
        elapsed_seconds = current_time - _last_ping_time
        _last_ping_time = current_time
        return {
            "seconds": elapsed_seconds,
            "milliseconds": elapsed_seconds * 1000
        }

def get_current_time_est():
    est = pytz.timezone("America/New_York")
    return datetime.now(est)
    return datetime.now(est_tz)