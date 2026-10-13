function getLocalizedText(value) {
  if (value === null || typeof value === 'undefined') return '';
  if (typeof value === 'string') return value;
  if (typeof window !== 'undefined' && typeof window.L === 'function') {
    return window.L(value);
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value.uk || value.en || '';
  }
  return String(value);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function formatInlineMarkup(rawText) {
  const text = escapeHtml(getLocalizedText(rawText));
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(.+?)\*(?!\*)/g, '$1<em>$2</em>');
}

function renderTableBlock(block) {
  const head = (block.head || []).map((cell) => `<th>${formatInlineMarkup(cell)}</th>`).join('');
  const rows = (block.rows || []).map((row) => {
    const cells = (row || []).map((cell) => `<td>${formatInlineMarkup(cell)}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    <table class="gr-table">
      <thead>
        <tr>${head}</tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderNoteBlock(block) {
  const icon = block.icon ? getIconSvg(block.icon) : '';
  const title = block.title ? `${icon} <b>${formatInlineMarkup(block.title)}</b>` : icon;
  const text = block.text ? `<span>${formatInlineMarkup(block.text)}</span>` : '';
  return `<div class="gr-note-box">${title ? `${title}${text ? ' ' : ''}` : ''}${text}</div>`;
}

function renderExamplesBlock(block) {
  const items = (block.items || []).map((item) => {
    const title = item.title ? `<div class="gr-example-title">${formatInlineMarkup(item.title)}</div>` : '';
    const text = item.text ? `<div class="gr-example-text">${formatInlineMarkup(item.text)}</div>` : '';
    return `<div class="gr-example-item">${title}${text}</div>`;
  }).join('');

  return `<div class="gr-example-list">${items}</div>`;
}

function renderRulesBlock(block) {
  const items = (block.items || []).map((item) => `<li>${formatInlineMarkup(item)}</li>`).join('');
  return `<div class="gr-rules"><ul>${items}</ul></div>`;
}

function renderBlocks(blocks) {
  if (!Array.isArray(blocks)) return '';

  return blocks.map((block) => {
    switch (block?.type) {
      case 'table':
        return renderTableBlock(block);
      case 'note':
        return renderNoteBlock(block);
      case 'examples':
        return renderExamplesBlock(block);
      case 'rules':
        return renderRulesBlock(block);
      default:
        return '';
    }
  }).join('');
}

if (typeof window !== 'undefined') {
  window.renderBlocks = renderBlocks;
}
