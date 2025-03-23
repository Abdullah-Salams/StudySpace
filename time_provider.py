from datetime import datetime
import pytz


def get_current_time_est():
    est = pytz.timezone("America/New_York")
    return datetime.now(est)
