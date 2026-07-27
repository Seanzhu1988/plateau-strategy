/* Plateau Strategy Solution Lab — single-active-identity guard (privacy).
   A browser may hold at most ONE portal login at a time. Signing into (or
   actively entering) one portal clears the others, so a person using the site
   is never silently still logged in somewhere else. */
(function () {
  var ROLE_KEYS = { customer: "customer", driver: "renter_id", agent: "agent_id" };

  function clearOthers(role) {
    for (var r in ROLE_KEYS) {
      if (r !== role) { try { localStorage.removeItem(ROLE_KEYS[r]); } catch (e) {} }
    }
  }

  window.PS = {
    ROLE_KEYS: ROLE_KEYS,
    // Mark `role` as the one active identity; wipe any other portal's token.
    activate: function (role) {
      if (!ROLE_KEYS[role]) return;
      clearOthers(role);
    },
    // Full sign-out from every portal identity in this browser.
    clearAll: function () {
      for (var r in ROLE_KEYS) { try { localStorage.removeItem(ROLE_KEYS[r]); } catch (e) {} }
    },
    // How many portal identities are currently stored (should never exceed 1).
    activeCount: function () {
      var n = 0;
      for (var r in ROLE_KEYS) { if (localStorage.getItem(ROLE_KEYS[r])) n++; }
      return n;
    }
  };
})();
