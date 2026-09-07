// pdftext.js  -  extract the full text of a PDF with no install of any kind.
//
// Why this file exists: three landmark-routine runs recorded MoMA and the
// National Museum of American History as blocked because a source was a PDF
// and "there is no pdftotext, the Read tool needs pdftoppm which is not
// installed, and system python has no Quartz". All true, and all beside the
// point: macOS ships PDFKit, and JavaScript for Automation reaches it through
// the Objective-C bridge. Nothing is installed and nothing is downloaded.
//
//   osascript -l JavaScript pdftext.js /path/to/file.pdf
//
// Prints every page with a === PAGE n === header. Scanned pages with no text
// layer come back empty, which is itself the answer: that PDF needs an image
// route, not a text one.
ObjC.import('Quartz');
function run(argv) {
  if (!argv || !argv.length) { return "usage: osascript -l JavaScript pdftext.js FILE.pdf"; }
  var doc = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(argv[0]));
  if (!doc.js) { return "NULLDOC: not a readable PDF at " + argv[0]; }
  var n = doc.pageCount, out = [];
  for (var i = 0; i < n; i++) {
    out.push("=== PAGE " + (i + 1) + " ===\n" + doc.pageAtIndex(i).string.js);
  }
  return out.join("\n");
}
