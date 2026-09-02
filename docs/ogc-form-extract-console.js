// Paste in Chrome DevTools Console while on the OGC form (logged in).
// Copies a JSON map of entry IDs to the clipboard.

(() => {
  const data = window.FB_PUBLIC_LOAD_DATA_;
  if (!data) {
    console.error("FB_PUBLIC_LOAD_DATA_ not found. Open the form fully, then re-run.");
    return;
  }

  // Questions live around data[1][1]
  const questions = data?.[1]?.[1];
  if (!Array.isArray(questions)) {
    console.error("Unexpected form shape. Dumping raw top-level keys for debug:");
    console.log(data);
    return;
  }

  const rows = [];
  for (const q of questions) {
    if (!q) continue;
    const id = q[0];
    const title = q[1];
    const type = q[3]; // 0 short, 1 para, 2 mc, 3 dropdown, 4 checkboxes, 5 linear, 7 grid, 8 section, 9 date...
    const fields = q[4];
    if (!fields) {
      rows.push({ id, type, title, entries: [] });
      continue;
    }
    const entries = [];
    for (const f of fields) {
      if (!f) continue;
      const entryId = f[0];
      const options = Array.isArray(f[1])
        ? f[1].map((o) => (Array.isArray(o) ? o[0] : o)).filter(Boolean)
        : null;
      const required = !!f[2];
      entries.push({ entryId, options, required });
    }
    rows.push({ id, type, title, entries });
  }

  const text = JSON.stringify(rows, null, 2);
  console.log(text);
  console.log(`\n// ${rows.length} items extracted`);
  try {
    copy(text);
    console.log("// copied to clipboard — paste back into chat");
  } catch (e) {
    console.log("// copy() failed — select the JSON above and paste it");
  }
  return rows;
})();
