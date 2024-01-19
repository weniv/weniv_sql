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

/* 다운로드 기능 미제공으로 삭제 */
// const downloadBtn = document.querySelector('.btn-code-download');
// downloadBtn.addEventListener('click', (e) => {
//   const downloadCode = window.editor.getValue();
//   const blob = new Blob([downloadCode], { type: 'text/plain' });
//   const url = window.URL.createObjectURL(blob);
//   const a = document.createElement('a');
//   a.href = url;
//   a.download = `${dateFormat()}.sql`;
//   a.click();
// });

const addStatement = (sqlSyntax) => {
  const DEFAULT_SQL_VALUES = {
    SELECT: `SELECT * FROM student;`,
    GROUP_BY: `SELECT * FROM student GROUP BY 학년;`,
    ORDER_BY: `SELECT 학번, 학년, 이름 FROM student ORDER BY 학년 DESC;`,
    UPDATE: `UPDATE student SET 학년 = '졸업' WHERE 학년 = 4;`,
    INSERT_INTO: `INSERT INTO student\nVALUES (202300000, '신입생', '컴퓨터공학과', '일호준', 1, '1997-01-01', '011-3344-5566', '제주특별자치시도 제주시 위니구', 10);`,
    WHERE: `SELECT * FROM student WHERE 학번 > 202100000;`,
    DELETE: `DELETE FROM student WHERE 학년 = 4;`,
    INNER_JOIN: `SELECT * FROM student\nINNER JOIN grade\nON student.학번 = grade.학번;`,
    INSERT_INTO_SELECT: `INSERT INTO tuition\nSELECT * FROM mileage;`,
    LIMIT: `SELECT * FROM student LIMIT 10;`,
    AND: `SELECT * FROM student WHERE 학과='컴퓨터공학과' AND 학년 > 2;`,
    OR: `SELECT * FROM student WHERE 학과= '수학과' OR 학과= '약학과';`,
    NOT: `SELECT * FROM student WHERE NOT 학년 = 4;`,
    IS_NULL: `SELECT * FROM scholarship WHERE 성적장학금 IS NULL;`,
    IS_NOT_NULL: `SELECT * FROM scholarship WHERE 성적장학금 IS NOT NULL;`,
    IN: `SELECT * FROM student WHERE 지도교수 IN ("일호준", "이호준", "삼호준");`,
    LIKE: `SELECT 학번, 학년, 이름, 지도교수 FROM student\nWHERE 지도교수 LIKE '%호준';`,
    BETWEEN: `SELECT * FROM student WHERE 마일리지 BETWEEN 100 AND 200;`,
    COUNT: `SELECT COUNT(*) AS '3학년인원' FROM student WHERE 학년 = 3;`,
    SUM: `SELECT SUM(마일리지) AS '마일리지 총합' FROM student WHERE 마일리지 > 0;`,
    MIN: `SELECT MIN(마일리지) AS '100이상 마일리지 최소 값' FROM student WHERE 마일리지 > 100;`,
    MAX: `SELECT MAX(마일리지) AS '100이상 마일리지 최대 값' FROM student WHERE 마일리지 > 100;`,
    AVG: `SELECT AVG(마일리지) AS '마일리지 평균' FROM student WHERE 마일리지 > 0;`,
    AS: `SELECT 학번, 이름 AS 성명, 연락처 AS 휴대폰번호 FROM student;`,
    HAVING: `SELECT * FROM student WHERE 학년 > 1\nGROUP BY 지도교수 HAVING MAX(학년);`,
    CASE: `SELECT 이름, 마일리지, CASE\n    WHEN 마일리지 < 100 THEN '낮은 마일리지'\n    WHEN 마일리지 < 300 THEN '보통 마일리지'\n    WHEN 마일리지 < 600 THEN '높은 마일리지'\n    ELSE '최상위 마일리지'\nEND AS '마일리지 분류'\nFROM student;`,
    DISTINCT: `SELECT DISTINCT 학과 FROM student;`,
    LEFT_JOIN: `SELECT * FROM student LEFT JOIN grade ON student.학번 = grade.학번;`,
    RIGHT_JOIN: `SELECT * FROM grade RIGHT JOIN student ON grade.학번 = student.학번;`,
    FULL_OUTER_JOIN: `SELECT * FROM student FULL OUTER JOIN grade\nON student.학번 = grade.학번\nWHERE 학년 = 3`,
    UNION: `SELECT 지도교수 AS "교수&학생" FROM student\nUNION\nSELECT 이름 FROM student;`,
    UNION_ALL: `SELECT 지도교수 AS "중복된 교수&학생" FROM student\nUNION ALL\nSELECT 이름 FROM student;`,
    EXISTS: `SELECT 이름 FROM student\nWHERE EXISTS (SELECT 학번 FROM scholarship WHERE student.학번 = scholarship.학번 AND 학년 < 3);`,
    ANY: `SELECT 학번, 이름 FROM student\nWHERE 학번 = ANY(SELECT 학번 FROM grade WHERE 1학년1학기 > 4);`,
    ALL: `SELECT 학번, 이름 FROM student\nWHERE 학번 = ALL(SELECT 학번 FROM grade WHERE 1학년1학기 > 4);`,
    SELECT_INTO: `SELECT * INTO student_copy FROM (SELECT 학번,이름,지도교수,학년 FROM student);`,
  };
  window.editor.setValue(DEFAULT_SQL_VALUES[sqlSyntax] || sqlSyntax);
};

const AUTOCOMPLETE_TABLES = {
  // department: ['학과번호', '학과이름', '학과담당자', '학과전화번호'],
  // grade: ['학번', '학기', '평균학점'],
  // mileage: ['연도', '금액(1마일리지)'],
  // professor: [
  //   '교원번호',
  //   '이름',
  //   '학과',
  //   '이메일',
  //   '연구실전화번호',
  //   '생년월일',
  //   '연구실',
  // ],
  // scholarship: ['학번', '성적장학금', '근로장학금', '국가장학금'],
  // ['school expenses']: ['연도', '금액'],
  // student: [
  //   '학번',
  //   '이름',
  //   '학과',
  //   '지도교수',
  //   '학년',
  //   '생년월일',
  //   '연락처',
  //   '주소',
  //   '마일리지',
  // ],
  // subject: [
  //   '과목',
  //   '번호',
  //   '교수번호',
  //   '학과번호',
  //   '과목명',
  //   '전필/전선/교양',
  //   '학점',
  // ],
};

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
      theme: 'monokai',
    },
  );
  window.editor.setValue('SELECT * FROM 상품;');
});
