const createTable = (db, tableName, columns, values) => {
  let sqlStr = `CREATE TABLE IF NOT EXISTS ${tableName} `;
  sqlStr += ` (${columns
    .map((column, idx) => {
      `${column} ${getModifedType(values[0][idx])})}`;
    })
    .join(',')})`;
  db.run(sqlStr);

  const stmt = db.prepare(
    `INSERT INTO ${tableName} VALUES (${columns.map(() => '?').join(',')})`,
  );
  values.forEach((value) => stmt.run(value));
  stmt.free();
};

const getModifiedType = (value) => {
  switch (typeof value) {
    case 'string':
      return 'TEXT';
    case 'number':
      return Number.isInteger(value) ? 'INTEGER' : 'REAL';
    case 'boolean':
      return 'INTEGER';
    default:
      return 'TEXT';
  }
};

const getJsonToTable = async (db, file) => {
  const response = await fetch(`./src/data/${file}.json`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  const data = await response.json();

  const columns = Object.keys(data[0]);
  const values = data.map((value) => Object.values(value));

  createTable(db, file, columns, values);
};

const getResultTable = (data) => {
  const columns = data?.columns;
  const values = data?.values;

  const $result = document.querySelector('.table-cont');
  const table = $result.querySelector('table');
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

document.addEventListener('DOMContentLoaded', async () => {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  const db = new SQL.Database();

  const tableList = [];

  await Promise.all(tableList.map((file) => getJsonToTable(db, file)));

  const runSQL = (db) => {
    try {
      const sqlStr = window.editor.getValue();
      const res = db.exec(sqlStr)[0];
      res && getResultTable(res);
    } catch (err) {
      alert(err);
    }
  };

  const $btnRun = document.querySelector('.run-btn');
  $btnRun.addEventListener('click', () => runSQL(db));
});
