# Three.js, pinned for the architectural preview

Version: 0.180.0, npm package `three`, MIT license.

Copied without modification from the official package:

- `build/three.module.min.js`
- `build/three.core.min.js`
- `examples/jsm/controls/OrbitControls.js`
- `LICENSE`

Only the private architecture preview loads this dependency. Existing live tour
pages and their audio players remain unchanged. Serving the library locally
avoids runtime CDN requests and a third-party dependency during a tour.

Upstream: https://github.com/mrdoob/three.js/tree/r180
