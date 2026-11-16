// The browser bundle (lib/marked.js) ships in the package alongside src/,
// so it must not be vulnerable to the block.def and inline.reflink/nolink
// ReDoS (CVE-2022-21680, CVE-2022-21681) either.
const marked = require('../../lib/marked.js');

const cases = [
  {
    name: 'block.def cubic backtracking',
    markdown: `[x]:${' '.repeat(1500)}x ${' '.repeat(1500)} x`,
    html: `<p>[x]:${' '.repeat(1500)}x ${' '.repeat(1500)} x</p>\n`
  },
  {
    name: 'inline.reflink/nolink exponential backtracking',
    markdown: '[x]: x\n\n[' + '\\[\\]('.repeat(30) + '[\n',
    html: '<p>[' + '[]('.repeat(30) + '[</p>\n'
  }
];

describe('ReDOS in lib/marked.js', () => {
  cases.forEach((c) => {
    it(`should not hang on ${c.name}`, () => {
      const before = process.hrtime();
      const html = marked(c.markdown);
      const elapsed = process.hrtime(before);
      expect(html).toBe(c.html);
      expect(elapsed[0]).toBe(0);
    });
  });
});
