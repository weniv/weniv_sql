const getModifiedType = (value) => {
  switch (typeof value) {
    case 'number':
      return Number.isInteger(value) ? 'INTEGER' : 'REAL';
    case 'boolean':
      return 'INTEGER';
    case 'string':
      return 'TEXT';
    case 'object':
      if (value instanceof Array || value instanceof Uint8Array) {
        return 'BLOB';
      }
    case 'null':
      return 'NULL';
    default:
      return 'TEXT';
  }
};

const createTable = (db, name, columns, values) => {
  try {
    const tableName = name;

    columns.map((column, index) => {
      return `column ${column}`;
    });

    let sqlStr = `CREATE TABLE ${tableName} `;
    sqlStr += ` (${columns
      .map((column, idx) => {
        return `${column} ${getModifiedType(values[0][idx])}`;
      })
      .join(', ')})`;
    db.run(sqlStr);

    const stmt = db.prepare(
      `INSERT INTO ${tableName} VALUES (${columns.map(() => '?').join(',')})`,
    );
    values.forEach((value) => stmt.run(value));
    stmt.free();

    return name;
  } catch (err) {
    showErrorMessage(err);
  }
};

const getJsonToTable = async (db, name) => {
  const response = await fetch(`./src/data/${name}.json`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const data = await response.json();
  const columns = Object.keys(data[0]);
  const values = data.map((value) => Object.values(value));

  createTable(db, name, columns, values);
};

const getResultTable = (data) => {
  const columns = data?.columns;
  const values = data?.values;

  const errorMsg = document.querySelector('.error-msg');
  errorMsg.classList.add('hidden');

  const table = document.querySelector('.result-table');
  table.innerHTML = '';

  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const tr = document.createElement('tr');
  columns.forEach((column) => {
    const th = document.createElement('th');
    th.textContent = column;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  values.forEach((value, index) => {
    const tr = document.createElement('tr');

    value.forEach((v) => {
      const td = document.createElement('td');
      td.textContent = v;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
};

const showAlertMessage = (err) => {
  const alertMsg = document.querySelector('.alert-msg');
  alertMsg.classList.remove('hidden');
  alertMsg.textContent = err;
  return alertMsg;
};

const showErrorMessage = (err) => {
  const errorMsg = document.querySelector('.error-msg');
  errorMsg.classList.remove('hidden');
  errorMsg.firstElementChild.innerText = err;
  return errorMsg;
};
const $errorCloseBtn = document.querySelector('.error-msg .btn-close');
$errorCloseBtn.addEventListener('click', () => {
  const errorMsg = document.querySelector('.error-msg');
  errorMsg.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', async () => {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  const db = new SQL.Database();

  // set use database
  const tableList = [
    '상품',
    '카테고리',
    '고객',
    '주문',
    '주문상세',
    '공급업체',
  ];
  tableList.map((file) => getJsonToTable(db, file));

  const sessionTableList = JSON.parse(sessionStorage.getItem('table_list'));

  const runSQL = (db) => {
    try {
      const sqlStr = window.editor.getValue();
      const res = db.exec(sqlStr)[0];
      res && getResultTable(res);
    } catch (err) {
      showErrorMessage(err);
    }
  };

  const $btnRun = document.querySelector('.run-btn');
  $btnRun.addEventListener('click', () => {
    changeTab('result');
    runSQL(db);
  });

  const $fileCont = document.querySelector('.cont-filemodal');
  const $tableName = document.getElementById('table-name');
  const $tableInput = document.getElementById('table-file');
  const $tableLabel = document.querySelector('label[for="table-file"]');
  const $btnTableUpload = document.getElementById('btn-table-upload');

  const $closeBtn = $fileCont.querySelector('.btn-close');
  const $fileModalBtn = document.querySelector('.btn-file-modal');

  window.addEventListener('click', (e) => {
    if (e.target === $fileModalBtn) {
      $fileCont.classList.toggle('show');
    } else if ($fileCont.classList.contains('show')) {
      if (e.target === $closeBtn) {
        $fileCont.classList.remove('show');
      } else if ($fileCont.contains(e.target)) {
        e.stopPropagation();
      } else {
        $fileCont.classList.remove('show');
      }
    }
  });

  $tableInput.addEventListener('change', (e) => {
    const csvType = document.getElementById('csv-type');
    const csvCont = document.querySelector('label[for="csv-type"]');

    $fileCont.querySelector('.file-name').textContent = e.target.files[0].name;

    if (e.target.files[0].type == 'text/csv') {
      csvCont.classList.remove('hidden');
    } else {
      csvCont.classList.add('hidden');
    }
  });

  $btnTableUpload.addEventListener('click', () => {
    const file = $tableInput.files[0];
    const tableName = $tableName.value;
    console.log('file', file);
    console.log('name', tableName);

    if (!file || !tableName) {
      const err = showErrorMessage('올바른 파일과 테이블 이름을 입력해주세요.');
      hideMessage(err, 2000);
      return;
    }
    try {
      if (file.type == 'application/json') {
        const reader = new FileReader();
        reader.onload = function (e) {
          columns = Object.keys(JSON.parse(e.target.result)[0]);
          values = JSON.parse(e.target.result).map((value) =>
            Object.values(value),
          );
          const state = createTable(db, tableName, columns, values);
          if (state) {
            const alert = showAlertMessage(
              `${tableName} 테이블이 생성되었습니다`,
            );
            hideMessage(alert, 2000);
            resetUplaodForm();
          }
        };
        reader.readAsText(file);
      } else if (file.type == 'text/csv') {
        const reader = new FileReader();
        reader.onload = function (e) {
          const csv = e.target.result;
          const lines = csv.split('\n');
          const type = document.getElementById('csv-type').value;
          const columns = lines[0].split(type);
          const values = lines.slice(1).map((line) => line.split(type));
          const state = createTable(db, tableName, columns, values);
          if (state) {
            const alert = showAlertMessage(
              `${tableName} 테이블이 생성되었습니다`,
            );
            hideMessage(alert, 2000);
            resetUplaodForm();
          }
        };
        reader.readAsText(file);
      }
    } catch (err) {}
  });
});

function resetUplaodForm() {
  document.getElementById('table-name').value = '';
  document.getElementById('table-file').value = '';
  document.querySelector('.cont-filemodal .file-name').textContent = '';
}

function saveUploadedTable(name, columns, values) {
  // table_name의 형태로 세션 스토리지에 저장
  sessionStorage.setItem(`table_${name}`, JSON.stringify({ columns, values }));
  const tableList = JSON.parse(sessionStorage.getItem('table_list')) || [];
  tableList.push(name);
  sessionStorage.setItem('table_list', JSON.stringify(tableList));
}

function hideMessage(elem, time) {
  setTimeout(() => {
    elem.classList.add('hidden');
  }, time);
}
