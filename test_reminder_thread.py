# -*- coding: utf-8 -*-
"""The dispatch reminder thread must exist in production, not only on a laptop.

Production is gunicorn (render.yaml), which imports app and never runs the
__main__ block. The reminder thread used to start only inside __main__, so on
the real site it never existed: no uncovered-ride nudge ever fired, and the
only place reminders worked was `python app.py` on a laptop. The start now
lives at import scope, like discovery right beside it, and this proves the
three properties that matter:

  * importing app starts the reminder thread, and exactly one of it;
  * asking again does not add a second one, gunicorn must be free to import
    however it likes without multiplying background loops;
  * DISPATCH_REMINDERS=false keeps it from starting at all, which is what
    every other test in this directory relies on when it imports app.

    python3 test_reminder_thread.py
"""
import os
import sys
import tempfile
import threading

# Before app is imported: an empty board of its own, so the thread's first
# scan can never touch real data, and the production default for the switch.
os.environ["DATA_DIR"] = tempfile.mkdtemp()
os.environ.pop("DISPATCH_REMINDERS", None)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import app as A                                              # noqa: E402

fails = []


def chk(label, cond):
    print("  %s %s" % ("OK  " if cond else "FAIL", label))
    if not cond:
        fails.append(label)


def reminder_threads():
    return [t for t in threading.enumerate() if t.name == "dispatch-reminders"]


# 1. The import alone started it, exactly once, no __main__ involved.
chk("import starts the reminder thread", len(reminder_threads()) == 1)
chk("it is a daemon, never blocks shutdown",
    bool(reminder_threads()) and reminder_threads()[0].daemon)

# 2. The app serves while it runs, the way gunicorn imports then serves.
A.app.config["TESTING"] = True
client = A.app.test_client()
r = client.get("/")
chk("app serves with the thread running (GET / is 200)", r.status_code == 200)
chk("still exactly one thread after requests", len(reminder_threads()) == 1)

# 3. A second start call is a no-op, not a second loop.
again = A._start_reminder_thread()
chk("second start call hands back the running thread",
    bool(reminder_threads()) and again is reminder_threads()[0])
chk("and does not add another", len(reminder_threads()) == 1)

# 4. DISPATCH_REMINDERS=false refuses a start. The guard variable is parked
#    aside so the switch, not the alive-check, is what decides here.
saved = A._REMINDER_THREAD
A._REMINDER_THREAD = None
os.environ["DISPATCH_REMINDERS"] = "false"
try:
    chk("switch off: start refuses", A._start_reminder_thread() is None)
    chk("switch off: no new thread appeared", len(reminder_threads()) == 1)
finally:
    A._REMINDER_THREAD = saved
    os.environ.pop("DISPATCH_REMINDERS", None)

print()
if fails:
    print("FAILED (%d): %s" % (len(fails), "; ".join(fails)))
    sys.exit(1)
print("all good: the reminder loop exists wherever app is imported")
