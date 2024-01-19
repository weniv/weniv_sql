const resetBtn = document.querySelector('.btn-reset');
resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  window.editor.setValue('');
});

const copyBtn = document.querySelector('.btn-copy');
copyBtn.addEventListener('click', (e) => {
  const copyCode = window.editor.getValue();
  navigator.clipboard.writeText(copyCode).then((res) => {
    alert('코드가 클립보드에 복사되었습니다.');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  window.editor = CodeMirror.fromTextArea(
    document.getElementById('codeMirrorTextarea'),
    {
      mode: 'text/x-sqlite',
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      autofocus: true,
      extraKeys: { Tab: 'autocomplete' },
    },
  );
  window.editor.setValue('SELECT * FROM 상품;');

  window.editor.on('keyup', (cm, event) => {
    if (
      (!event.ctrlKey && event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122) ||
      (event.keyCode >= 46 && event.keyCode <= 57)
    ) {
      CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
    }
  });
});
