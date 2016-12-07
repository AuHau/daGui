export default function selectRange(el, start, end) {
  el.focus();
  const range = document.createRange();
  range.setStart(el.childNodes[0], (!start || start == 'all' ? 0 : start));
  range.setEnd(el.childNodes[0], (!end || end == 'all' ? el.textContent.length : end));

  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}
