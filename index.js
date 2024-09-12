module.exports = function markdownItBidi(md) {
  const blockRules = [
    'heading_open',
    'blockquote_open',
    'paragraph_open',
    'bullet_list_open',
    'ordered_list_open',
    'table_open',
    'th_open',
    'td_open'
  ];

  const inlineRules = [
    'code_inline'
  ];

  const bidi = defaultRenderer => (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    
    // Special handling for table headers and cells
    if (token.type === 'th_open' || token.type === 'td_open') {
      token.attrSet('dir', 'auto');
    }
    
    // Add 'dir' attribute to other block elements
    if (blockRules.includes(token.type)) {
      token.attrSet('dir', 'auto');
    }
    
    return defaultRenderer(tokens, idx, opts, env, self);
  };

  const proxy = (tokens, idx, opts, _, self) => {
    return self.renderToken(tokens, idx, opts);
  };

  blockRules.forEach(rule => {
    const defaultRenderer = md.renderer.rules[rule] || proxy;
    md.renderer.rules[rule] = bidi(defaultRenderer);
  });

  inlineRules.forEach(rule => {
    const defaultRenderer = md.renderer.rules[rule] || proxy;
    md.renderer.rules[rule] = (tokens, idx, opts, env, self) => {
      const token = tokens[idx];
      token.attrSet('dir', 'ltr');
      return defaultRenderer(tokens, idx, opts, env, self);
    };
  });

  // Override fence rule
  const defaultFenceRenderer = md.renderer.rules.fence || proxy;
  md.renderer.rules.fence = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    const info = token.info ? ` class="language-${token.info.trim()}"` : '';
    const content = token.content.trim();
    return `<pre dir="ltr"><code${info}>${md.utils.escapeHtml(content)}</code></pre>\n`;
  };
};