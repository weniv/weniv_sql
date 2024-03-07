# 테이블에서 출력하기

```sql
SELECT (10 + 2) / 2;
-- 사칙연산이 가능합니다.
```

```sql
SELECT 'hello', 'world';
-- column을 나누어 출력합니다.
```

```sql
SELECT 이름 AS 성명, 이름 || '의 지도교수는 ' || 지도교수 || '입니다. ' AS 지도교수 FROM student;
-- student 테이블에서 이름을 가져오는데 성명으로 가져오고, column을 통해 새로운 문장을 만듭니다. 사칙연산도 들어갈 수 있습니다.
```
