# 01. 요구사항 명세서 (Requirements Specification)

> **목적**: CV/포트폴리오 홈페이지의 refactoring + migration + redesign 프로젝트를 위한 개발팀용 요구사항 명세.
> **입력 원본**: `../requirement-specification.md` (오너가 작성한 사용자 관점 초안).
> **이 문서의 역할**: 초안의 사용자 요구사항을 정제하고, 누락된 비기능 요구사항·기술 요구사항을 보강해 구현 가능한 형태로 만든다.
> **상태**: Draft v1 — 오너 검토 대기.

---

## 0. 프로젝트 개요

### 0.1 배경
기존 사이트는 오픈소스 학술 포트폴리오 템플릿 **al-folio**(Jekyll/Ruby + 약 15개 플러그인) 기반이다. 무겁고, 컨텐츠가 템플릿 문법(Liquid)과 뒤섞여 있어 유지보수가 어렵고, 디자인 만족도가 낮다.

### 0.2 목표
1. 오픈소스 템플릿 의존성을 제거하고, **우리가 100% 소유·이해 가능한** 코드베이스로 재구축한다.
2. **기존 컨텐츠를 100% 보존**한다 (손실 0).
3. 디자인 품질을 "전문 디자이너 수준"으로 끌어올린다.
4. **컨텐츠 추가/수정 동선을 단순화**한다 — 비개발자도 정해진 폴더만 만지면 되도록.
5. **재사용 가능한 템플릿화** — 개인정보가 코드에 전혀 없어, 컨텐츠 교체만으로 누구나 자기 사이트로 쓸 수 있게 한다.
6. **비용 0원** — GitHub 무료 호스팅/도메인만으로 운영한다.

### 0.3 핵심 제약 (Hard Constraints)
- **C-1 (URL 보존)**: 사이트 주소는 `https://yongjunshin.github.io/` 로 유지한다.
- **C-2 (호스팅 보존)**: GitHub Pages 호스팅을 계속 사용한다. 저장소(`yongjunshin/yongjunshin.github.io`)를 그대로 사용한다.
- **C-3 (경로 보존)**: 기존 주요 페이지 URL 경로(`/`, `/cv/`, `/publications/`, `/patents/`, `/projects/`)를 유지한다 (외부 링크·북마크·SEO 보호).
- **C-4 (안전한 컷오버)**: 신규 사이트는 별도 브랜치에서 개발·검증 후, 검증 완료 시점에만 운영에 반영한다. 기존 사이트는 git 히스토리로 언제든 롤백 가능해야 한다.
- **C-5 (비용 0원 — 절대 제약)**: 호스팅·도구·의존성·폰트·서비스 일체가 **무료**여야 한다. **GitHub 무료 도메인(`*.github.io`)과 GitHub Pages/Actions 무료 티어만** 사용한다. 유료 서버, 유료 커스텀 도메인, 유료 SaaS, 유료 폰트/아이콘, 유료 CDN/분석 도입을 일절 금지한다. (오너는 서버·도메인·예산이 없음.)
- **C-6 (개인정보 코드 분리 — 절대 제약)**: 오너의 모든 개인 컨텐츠·개인정보는 오직 `contents/`와 `configs/`에만 존재한다. 코드(`src/`)에는 개인정보를 단 하나도 하드코딩하지 않는다. → 제3자가 코드 수정 없이 `contents/` 교체 + `configs/` 편집만으로 자신의 사이트를 만들 수 있어야 한다(사이트가 곧 재사용 가능한 템플릿). 상세: `NFR-MAINT-5`.

---

## 1. 정보 구조 (Information Architecture)

| 페이지 | URL | 네비게이션 노출 | 비고 |
|---|---|---|---|
| About (메인) | `/` | (홈/로고) | 랜딩 페이지 |
| CV | `/cv/` | ✅ | |
| Publications | `/publications/` | ✅ | |
| Patents | `/patents/` | ✅ | |
| Projects | `/projects/` | ✅ | 리스트 |
| Project 상세 | `/projects/<slug>/` | ❌ | 리스트에서 진입 |
| ~~Repositories~~ | — | — | **삭제** (요구사항 §Repositories) |
| ~~Blog~~ | — | — | **범위 외** (기존 거의 미사용, §6 참조) |

전역 네비게이션 순서: **About · CV · Publications · Patents · Projects**

---

## 2. 기능 요구사항 (Functional Requirements)

### 2.1 메인(About) 페이지 — `FR-MAIN`
- **FR-MAIN-1** 이름을 표시한다.
- **FR-MAIN-2** 프로필 사진을 표시한다.
- **FR-MAIN-3** 개인 소개 글(자기소개 + 연구 관심사)을 표시한다.
- **FR-MAIN-4** News 섹션에 **최신 5개**를 표시한다. 각 항목은 **날짜 + 내용**을 보여준다. (노출 개수는 설정값으로 조정 가능 — §4)
- **FR-MAIN-5** Highlighted Publications 섹션에, 논문 데이터에서 **highlight로 마킹된 논문들**만 표시한다. 표시 형식은 Publications 페이지(§2.3)의 항목 표시 형식과 **동일**하다.
- **FR-MAIN-6** 외부 개인 링크 버튼을 표시한다: **Email, ORCID, Google Scholar, GitHub, LinkedIn**.
- **FR-MAIN-7** (전역) 모든 페이지 하단에 copyright를 표시한다. → `FR-GLOBAL-1`로 일반화.

### 2.2 CV 페이지 — `FR-CV`
- **FR-CV-1** 오너가 별도 관리하는 **CV PDF 파일을 여는 버튼**을 제공한다.
- **FR-CV-2** 다음 섹션을 기존 컨텐츠 누락 없이 표시한다: **General Information, Employment, Education, Honors and Awards, Academic Service**.
- **FR-CV-3** Publications / Patents / Projects 는 CV 페이지에 나열하지 않고, **각 전용 페이지로 이동하는 링크**로 대체한다.
- **FR-CV-4** 모든 시간표성 섹션에서 **기간(연도) 표기의 위치와 스타일이 일관**되어야 한다 (예: 우측 정렬된 연도 컬럼).
- **FR-CV-5** 페이지 내 특정 섹션으로 점프하는 버튼/사이드 목차(TOC)는 **제거**한다 (단정·간결).

### 2.3 Publications 페이지 — `FR-PUB`
- **FR-PUB-1** 연도별 그룹핑을 하지 않는다. **시간 역순(최신→과거) 단일 정렬**만 적용한다.
- **FR-PUB-2** 각 논문 항목은 다음을 표시한다:
  - 제목
  - 저자 — **오너 본인 이름은 밑줄** 강조
  - 출판지(venue) 정보
  - 연도
  - **preview 이미지**
- **FR-PUB-3** 각 논문 항목에 액션 버튼을 (해당 데이터가 있을 때) 제공한다: **BibTeX 복사**, **PDF 열기**, **Website 이동**, **Slides 열기**.
- **FR-PUB-4** 논문 데이터는 **BibTeX(.bib) 형식**으로 관리하며, 추가 시 기존과 동일하게 `.bib` 항목만 추가하면 반영되어야 한다.
- **FR-PUB-5** 버튼은 해당 메타데이터가 없는 논문에서는 **자동으로 숨김** 처리한다.

### 2.4 Patents 페이지 — `FR-PAT`
- **FR-PAT-1** 기존 특허 정보 전체를 깔끔하게 표시한다. 항목별 필드: 제목(국문/영문), 상태(출원/등록), 특허청, 특허번호, 발명자, 일자.
- **FR-PAT-2** 시간 역순 정렬.

### 2.5 Projects 페이지 — `FR-PROJ`
- **FR-PROJ-1** 현재/과거 그룹 구분을 제거하고 **시간 역순 단일 정렬**만 적용한다.
- **FR-PROJ-2** 카드형이 아닌 **리스트형**으로 표시한다.
- **FR-PROJ-3** 각 항목의 **프로젝트 이름을 클릭하면 해당 프로젝트 상세 페이지로 이동**한다.
- **FR-PROJ-4** 프로젝트 상세 페이지는 **마크다운으로 작성**하며, 작성된 컨텐츠(텍스트, 이미지, 링크)가 그대로 렌더링되어 보여야 한다.

### 2.6 전역 — `FR-GLOBAL`
- **FR-GLOBAL-1** 모든 페이지 하단 footer에 copyright(이름 + 연도)를 표시한다.
- **FR-GLOBAL-2** 모든 페이지 상단에 일관된 전역 네비게이션을 제공한다. 현재 페이지를 시각적으로 표시한다.
- **FR-GLOBAL-3** 반응형(데스크톱/태블릿/모바일)으로 동작한다.

---

## 3. 비기능 요구사항 (Non-Functional Requirements)

### 3.1 디자인 — `NFR-DESIGN`
- **NFR-DESIGN-1** **단일 라이트 모드**만 제공한다. 다크 모드는 만들지 않는다.
- **NFR-DESIGN-2** 톤: 라이트, 모던한 "computer scientist의 CV 홈페이지" 스타일.
- **NFR-DESIGN-3** 전 페이지가 **일관된 디자인 시스템**(색·타이포·간격·컴포넌트)을 따른다.
- **NFR-DESIGN-4** 품질 기준: 전문 디자이너가 만든 수준의 완성도. (상세 디자인 스펙은 `03-design-spec.md`)

### 3.2 성능 — `NFR-PERF`
- **NFR-PERF-1** 정적 사이트로 빌드해 빠른 로딩을 보장한다 (목표 Lighthouse Performance ≥ 95).
- **NFR-PERF-2** 이미지는 적절히 최적화(반응형/지연로딩)한다.

### 3.3 유지보수성 — `NFR-MAINT` (★ 본 프로젝트 최우선 가치)
- **NFR-MAINT-1** 컨텐츠와 코드(디자인/로직)를 **물리적으로 분리**한다.
- **NFR-MAINT-2** 폴더 구조는 §4의 3-폴더 모델을 따른다.
- **NFR-MAINT-3** "컨텐츠 1건 추가 = 정해진 폴더에 파일 1개 추가/수정" 수준으로 동선이 단순해야 한다.
- **NFR-MAINT-4** 컨텐츠 폴더에는 마크다운/`.bib`/이미지/PDF 등 **사람이 읽는 형식**만 둔다. 코드/템플릿 문법이 섞이지 않는다.
- **NFR-MAINT-5 (개인정보 0 in 코드 / 재사용성)** ← 제약 C-6 구현. 모든 개인 컨텐츠·개인정보(이름, 소개글, 소셜 링크, CV 데이터, 논문, 특허, 프로젝트, 뉴스, 프로필 사진/PDF/이미지, **사이트 URL·copyright 이름**까지)는 `contents/` 또는 `configs/`에만 존재한다. `src/`(코드)에는 어떤 개인정보도 하드코딩하지 않는다.
  - **수용 기준(테스트)**: `src/` 전체를 검색했을 때 개인정보(이름/이메일/기관명/논문 제목/소셜 ID 등) **0건**. 코드는 전적으로 `contents/`·`configs/`에서 데이터를 읽어 렌더링만 한다.
  - **재사용 시나리오**: 제3자가 저장소를 복제 → `contents/`를 자기 것으로 교체하고 `configs/site.yml`만 수정 → 코드 0줄 수정으로 본인 사이트 완성.

### 3.4 호환성/접근성 — `NFR-COMPAT`
- **NFR-COMPAT-1** 최신 Chrome/Edge/Safari/Firefox 및 모바일 브라우저 지원.
- **NFR-COMPAT-2** 시맨틱 마크업 및 기본 접근성(대비, alt text, 키보드 포커스) 준수.

---

## 4. 컨텐츠·설정 관리 요구사항 (★ 핵심) — `FR-MANAGE`

오너가 기존 프로젝트에서 가장 불편했던 지점("컨텐츠 바꿀 때마다 고쳐야 하는 파일 위치가 제각각")을 해소하기 위한 **3-폴더 모델**.

```
repo-root/
├── contents/      ← 오너가 평소 만지는 거의 유일한 폴더. 페이지별 sub-directory로 분리.
├── configs/       ← 비개발자가 안전하게 바꿀 수 있는 소수의 설정만 노출.
└── (code)/        ← 디자인/로직/빌드. 오너는 열지 않음. (실제 폴더명은 프레임워크 관례를 따름)
```

- **FR-MANAGE-1 (contents)** 각 페이지의 출력 컨텐츠(마크다운, `.bib`, PDF, 이미지 등)만 `contents/` 아래에 둔다. 페이지별 하위 폴더로 구분한다 (`contents/home`, `contents/cv`, `contents/publications`, `contents/patents`, `contents/projects`, `contents/news`).
- **FR-MANAGE-2 (configs)** 비개발자가 다뤄도 안전하고 유용한 설정만 `configs/`에 노출한다. (노출 후보 목록은 `02-architecture-and-plan.md` §설정 항목 참조.)
  - 노출 **포함** 예: 표시 이름, 저자 목록에서 밑줄 처리할 본인 이름 문자열, 소셜 링크(이메일/ORCID/Scholar/GitHub/LinkedIn), copyright 문구, 메인 News 노출 개수, CV PDF 파일명, (선택) 강조 색상.
  - 노출 **제외** 예: 간격/여백/폰트 크기/레이아웃 규칙 등 — 이는 코드 내부에서 개발자가 책임지고 일관되게 관리한다.
- **FR-MANAGE-3 (code)** 디자인·로직·빌드 설정은 별도(코드) 폴더에 두며, 일반 유지보수 동선에서 건드릴 필요가 없어야 한다.

---

## 5. 기술 요구사항 (Technical Requirements) — 개발팀이 보강

> 오너 초안에 없던, 위 사용자 요구사항을 만족시키기 위해 필요한 기술적 사항.

- **TR-1 (정적 사이트)** 정적 사이트 생성기로 빌드한 정적 산출물을 GitHub Pages로 배포한다. (스택 선정: `02-architecture-and-plan.md`)
- **TR-2 (BibTeX 파싱)** 빌드 시 `contents/publications/*.bib`를 파싱해 Publications/Highlighted 항목을 생성한다. 기존 bib 커스텀 필드(`selected`, `preview`, `pdf`, `website`, `slides`, `poster`, `supp`, `bibtex_show`)를 해석한다.
- **TR-3 (정렬 키 보강)** 시간 역순 정렬을 위해 정렬 키가 필요하다.
  - Publications: bib의 `year`(필요 시 month) 사용.
  - Projects: 각 프로젝트 마크다운 frontmatter에 **정렬용 날짜/연도 필드 추가** (기존엔 본문에만 존재).
  - Patents/News: 일자 필드 사용.
- **TR-4 (저자 강조)** 저자 문자열에서 설정값(본인 이름)과 매칭되는 부분에 밑줄을 적용한다. 다양한 표기(`Shin, Yong-Jun` / `Yong-Jun Shin`)를 함께 인식한다.
- **TR-5 (자산 처리)** preview 이미지·PDF·슬라이드 등 자산을 빌드에 포함하고 안정적인 경로로 서빙한다.
- **TR-6 (배포 파이프라인)** push → 빌드 → GitHub Pages 게시까지 자동화한다. 운영 컷오버 전까지는 프리뷰/검증 단계를 거친다 (C-4).
- **TR-7 (URL 라우팅)** §1의 URL 경로를 라우팅으로 보존한다 (C-3).

---

## 6. 범위 외 / 삭제 (Out of Scope)
- **OOS-1** Repositories 페이지 — 삭제 (요구사항 명시).
- **OOS-2** 다크 모드 — 만들지 않음.
- **OOS-3** Blog/Posts — 본 마이그레이션 범위에서 제외(기존 거의 미사용, 샘플 위주). *추후 필요 시 별도 확장.*
- **OOS-4** GitHub 통계 카드/트로피, Disqus/Giscus 댓글, Altmetric/Dimensions 배지 등 al-folio 부가 기능 — 미이관.

---

## 7. 가정 및 확인 필요 (Assumptions / Open Questions)
- **A-1** 기존 컨텐츠는 현 시점 저장소 `master` 브랜치 기준으로 100% 이관한다.
- **Q-1** Projects 정렬용 연도는 기존 본문의 "수행 기간"에서 추출해 frontmatter로 옮긴다 (개발팀이 1차 작성, 오너 확인).
- **Q-2** Patents는 가독성·일관 스타일을 위해 자유 마크다운 대신 **구조화 데이터(YAML)**로 이관 제안 (출력 결과는 동일/개선). 오너 확인.
- ~~**Q-3** 디자인 방향~~ → **확정**: 헤딩/이름 = 세리프(Newsreader), 본문 = Inter / 강조색 = Indigo `#4F46E5`.
