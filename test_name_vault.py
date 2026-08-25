import base64, json, os, sys, tempfile
d = tempfile.mkdtemp()
os.environ["DATA_DIR"] = d
os.environ["NAME_KEY_A"] = base64.b64encode(os.urandom(32)).decode()
os.environ["NAME_KEY_B"] = base64.b64encode(os.urandom(32)).decode()
os.environ["NAME_INDEX_KEY"] = base64.b64encode(os.urandom(32)).decode()
sys.path.insert(0, os.path.expanduser("~/Claude/worktrees/site"))
import name_vault as V

ok = fail = 0
def check(label, cond):
    global ok, fail
    if cond: ok += 1; print("  pass  %s" % label)
    else: fail += 1; print("  FAIL  %s" % label)

print("splitting")
check("two words split", V.split_name("Sarah Chen") == ("Sarah", "Chen"))
check("one word is a given name", V.split_name("Prince") == ("Prince", ""))
check("middle stays with given", V.split_name("Maria de la Cruz") == ("Maria de la", "Cruz"))
check("empty is empty", V.split_name("") == ("", ""))
check("initials mask", V.initials("Sarah Chen") == "S C")

print("sealing")
s = V.seal("Sarah Chen")
blob = json.dumps(s)
check("plain name absent from the record", "Sarah" not in blob and "Chen" not in blob)
check("round trips", V.unseal(s) == "Sarah Chen")
check("one-word name round trips", V.unseal(V.seal("Prince")) == "Prince")
check("nonce differs per seal", V.seal("Sarah Chen")["a"] != V.seal("Sarah Chen")["a"])

print("a stolen vault is worthless")
# an attacker with vault B AND key B still only gets the surname
fam = V._open_one(s["b"], "NAME_KEY_B")
check("vault B yields only the surname", fam == "Chen")
# key A cannot open vault B
try:
    V._open_one(s["b"], "NAME_KEY_A"); check("wrong key refused", False)
except Exception: check("wrong key refused", True)

print("blind index")
check("same surname, same index", V.seal("Ann Chen")["idx"] == V.seal("Bob chen")["idx"])
check("different surname, different index", V.seal("Ann Chen")["idx"] != V.seal("Ann Diaz")["idx"])
check("index is not the name", "Chen" not in V.seal("Ann Chen")["idx"])

print("the chain")
n1 = V.record_access("sean", "dispatch", "bk1")
n2 = V.record_access("sean", "dispatch", "bk2")
check("first links to genesis", n1["prev"] == V.GENESIS)
check("second links to first", n2["prev"] == n1["hash"])
okc, cnt, bad = V.verify_chain()
check("intact chain verifies", okc and cnt == 2)

print("tampering is provable")
p = V.audit_path()
lines = open(p).read().splitlines()
e = json.loads(lines[0]); e["reason"] = "something else"
lines[0] = json.dumps(e, sort_keys=True)
open(p, "w").write("\n".join(lines) + "\n")
okc, cnt, bad = V.verify_chain()
check("edited entry detected", not okc and bad == 1)
# deletion too
open(p, "w").write("\n".join(lines[1:]) + "\n")
okc2, _, bad2 = V.verify_chain()
check("deleted entry detected", not okc2)

print("the only door")
os.remove(p)
before = len(open(p).read().splitlines()) if os.path.exists(p) else 0
name, entry = V.reveal(s, "sean", "driver needs the pickup name", "bk9")
after = len(open(p).read().splitlines())
check("reveal returns the name", name == "Sarah Chen")
check("reveal wrote exactly one record", after - before == 1)
check("the record carries the reason", entry["reason"] == "driver needs the pickup name")

print("fails closed")
saved = os.environ.pop("NAME_KEY_A")
try:
    V.seal("Sarah Chen"); check("no key means refuse, not plaintext", False)
except RuntimeError: check("no key means refuse, not plaintext", True)
os.environ["NAME_KEY_A"] = saved
check("configured() true with all keys", V.configured())
os.environ["NAME_KEY_B"] = "too-short"
check("configured() false on a bad key", not V.configured())

print("\n%d passed, %d failed" % (ok, fail))
sys.exit(1 if fail else 0)
