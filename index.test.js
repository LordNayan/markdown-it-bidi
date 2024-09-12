const markdownIt = require('markdown-it');
const mdBidi = require('./index');

const md = markdownIt().use(mdBidi);

describe('markdown-it-bidi', () => {
  test('Add Bidi support to isolated elements', () => {
    // Headings
    expect(md.render('# Heading 1')).toEqual('<h1 dir="auto">Heading 1</h1>\n');
    expect(md.render('## Heading 2')).toEqual('<h2 dir="auto">Heading 2</h2>\n');
    expect(md.render('### Heading 3')).toEqual('<h3 dir="auto">Heading 3</h3>\n');
    expect(md.render('#### Heading 4')).toEqual('<h4 dir="auto">Heading 4</h4>\n');
    expect(md.render('##### Heading 5')).toEqual('<h5 dir="auto">Heading 5</h5>\n');
    expect(md.render('###### Heading 6')).toEqual('<h6 dir="auto">Heading 6</h6>\n');
    
    // Paragraphs
    expect(md.render('Some text')).toEqual('<p dir="auto">Some text</p>\n');
    expect(md.render('Some\ntext')).toEqual('<p dir="auto">Some\ntext</p>\n');

    // Lists
    expect(md.render('- item 1\n- item 2')).toEqual('<ul dir="auto">\n<li>item 1</li>\n<li>item 2</li>\n</ul>\n');
    expect(md.render('1. item 1\n1. item 2')).toEqual('<ol dir="auto">\n<li>item 1</li>\n<li>item 2</li>\n</ol>\n');
    expect(md.render('1. item 1\n2. item 2')).toEqual('<ol dir="auto">\n<li>item 1</li>\n<li>item 2</li>\n</ol>\n');
  });

  test('Add Bidi support to nested elements', () => {
    // Lists
    expect(
      md.render('- item 1\n    - item 2')
    ).toEqual('<ul dir="auto">\n<li>item 1\n<ul dir="auto">\n<li>item 2</li>\n</ul>\n</li>\n</ul>\n');
    expect(
      md.render('1. item 1\n    1. item 2')
    ).toEqual('<ol dir="auto">\n<li>item 1\n<ol dir="auto">\n<li>item 2</li>\n</ol>\n</li>\n</ol>\n');
  });

  test('Handle inline code blocks', () => {
    expect(md.render('This is `inline code`')).toEqual('<p dir="auto">This is <code dir="ltr">inline code</code></p>\n');
  });

  test('Handle fenced code blocks', () => {
    const input = '```javascript\nconst x = 1;\nconsole.log(x);\n```';
    const expected = '<pre dir="ltr"><code class="language-javascript">const x = 1;\nconsole.log(x);</code></pre>\n';
    expect(md.render(input)).toEqual(expected);
  });

  test('Handle tables', () => {
    const input = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
    const expected = '<table dir="auto">\n<thead>\n<tr>\n<th dir="auto">Header 1</th>\n<th dir="auto">Header 2</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td dir="auto">Cell 1</td>\n<td dir="auto">Cell 2</td>\n</tr>\n</tbody>\n</table>\n';
    expect(md.render(input)).toEqual(expected);
  });

  test('Handle blockquotes', () => {
    const input = '> This is a blockquote';
    const expected = '<blockquote dir="auto">\n<p dir="auto">This is a blockquote</p>\n</blockquote>\n';
    expect(md.render(input)).toEqual(expected);
  });
});