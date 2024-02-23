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
      mode: 'text/x-sql',
      indentWithTabs: true,
      smartIndent: true,
      lineNumbers: true,
      matchBrackets: true,
      autofocus: true,
      //extraKeys: { Tab: 'autocomplete' },
    },
  );
  window.editor.setValue('SELECT * FROM product;');

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

const SQLTableList = {
  product: [
    '상품ID',
    '상품명',
    '카테고리ID',
    '가격',
    '재고',
    '설명',
    '공급업체ID',
  ],
  category: ['카테고리ID', '카테고리명'],
  customer: ['고객ID', '이름', '이메일', '연락처', '주소', '가입일'],
  purchase: ['주문ID', '고객ID', '주문날짜', '배송주소', '총주문금액'],
  purchaseDetail: ['주문상세ID', '주문ID', '상품ID', '수량', '단가'],
  supply: ['공급업체ID', '회사명', '연락처', '주소'],
};

CodeMirror.commands.autocomplete = function (cm) {
  CodeMirror.showHint(cm, CodeMirror.hint.sql, {
    tables: SQLTableList,
    completeSingle: false,
  });
};
