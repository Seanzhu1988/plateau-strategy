    function flyToPlace(lat, lon, minZoom){
        if (typeof map === 'undefined' || !map) return;
        var z = Math.max(map.getZoom() || 0, minZoom || 13);
        if (map.flyTo) map.flyTo([lat, lon], z, { duration: 0.7 });
        else map.setView([lat, lon], z);
    }

let moves = [];
let map = { getZoom: () => 11,
            flyTo: (ll,z,o) => moves.push(['flyTo', ll, z, o.duration]),
            setView: (ll,z) => moves.push(['setView', ll, z]) };
let fails = [];
const chk = (l,c) => { console.log(`  ${c?'OK  ':'FAIL'} ${l}`); if(!c) fails.push(l); };

flyToPlace(47.6205, -122.3493);
chk(`flies rather than cutting (${moves[0][0]})`, moves[0][0] === 'flyTo');
chk(`zooms in from 11 to ${moves[0][2]}`, moves[0][2] === 13);
chk(`lands on the address given (${moves[0][1]})`, moves[0][1][0] === 47.6205);
chk(`the flight is short, not a crawl (${moves[0][3]}s)`, moves[0][3] <= 1);

moves = []; map.getZoom = () => 16;
flyToPlace(47.6, -122.3);
chk(`never zooms OUT on someone already zoomed in (${moves[0][2]})`, moves[0][2] === 16);

moves = []; map.getZoom = () => 11;
flyToPlace(47.6, -122.3, 15);
chk(`honours a stronger minimum when asked (${moves[0][2]})`, moves[0][2] === 15);

moves = []; const realFly = map.flyTo; delete map.flyTo;
flyToPlace(47.6, -122.3);
chk(`falls back to setView if flyTo is unavailable (${moves[0][0]})`, moves[0][0] === 'setView');
map.flyTo = realFly;

moves = []; map = null;
flyToPlace(47.6, -122.3);
chk('does nothing at all if the map failed to load', moves.length === 0);

console.log(fails.length ? `\nFAILED: ${fails}` : '\nPASSED');
process.exit(fails.length ? 1 : 0);
