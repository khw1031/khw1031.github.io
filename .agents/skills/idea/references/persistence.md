# The /idea route: how it is served and what to check

`/idea`는 `notes`/`specs`와 동일한 **unlisted 컬렉션 라우트**다. 별도 빌드 스텝·암호화·키가 없다 —
평문 마크다운을 커밋하면 그대로 배포된다.

## 동작 방식

- `idea`는 Astro 콘텐츠 컬렉션(`src/content.config.ts`, `baseFrontmatter` 스키마)이다.
- `src/pages/idea/[...slug].astro`가 `src/content/idea/**/*.md`를 렌더한다(notes/specs와 같은 패턴:
  허브 `{slug}/index.md` + 자식 `{slug}/{child}.md`, 허브는 직속 자식 목차 자동 렌더).
- 노출 제외는 기존 코드가 처리한다: 사이트맵 필터(`astro.config.mjs`)와 `robots.txt.ts`가 `/idea`를
  제외하고, `SEARCHABLE_COLLECTIONS`에 없으므로 pagefind 인덱스에도 안 들어간다.
- 푸터(`src/components/Footer.astro`)에는 idea 링크가 **없다** — 직접 URL로만 도달한다.

이 라우팅/노출 코드는 이 스킬이 수정하지 않는다. 바꿔야 하면 escalate.

## 등록 절차

1. 평문을 `src/content/idea/{slug}.md`에 OKF 형식으로 쓴다(doc-template.md).
2. frontmatter 무결성을 `/lint`로 확인한다(`baseFrontmatter`: `title`·`pubDate` 필수).
3. (선택) dev에서 `/idea/{slug}/` 렌더를 확인한다.
4. 사용자에게 URL을 알린다:

   ```
   https://khw1031.github.io/idea/{slug}/
   ```

## 인박스 승격 (소스가 `idea/inbox/`일 때)

`ideabox`가 만든 `src/content/idea/inbox/{slug}.md`를 발전시킬 때는 **이동**으로 처리한다:

1. 발전 노트를 `src/content/idea/{slug}.md`에 쓴다(인박스의 질문·레퍼런스를 흡수).
2. 원본 `src/content/idea/inbox/{slug}.md`를 삭제한다(`git rm` 권장 — 리뷰·복구 용이).
3. 결과적으로 `/idea/inbox/{slug}/`는 사라지고 `/idea/{slug}/`가 생긴다.

인박스 목록(`/idea/inbox/`)은 스테이징이므로, 승격되면 자동으로 목록에서 빠진다. 승격 슬러그는
인박스 슬러그와 달라도 된다(발전하며 제목이 바뀔 수 있음).

## 주의

- 본문은 공개 repo에 평문으로 커밋된다. URL을 알거나 repo를 뒤지면 읽힌다(검색엔 안 잡힘).
  **비밀값·민감정보 금지.** 슬러그에도 민감정보를 넣지 않는다.
- 하위 아이디어로 나눌 때는 `{slug}/index.md`(허브) + `{slug}/{child}.md` 구조를 쓴다(notes와 동일).
