# 02. 아키텍처 & 개발 플랜

> `01-requirements.md`를 만족시키기 위한 기술 스택, 폴더 구조, 배포 전략, 개발 단계.

---

## 1. 기술 스택 결정

### 1.1 선정: **Astro** (정적 사이트 생성기)
| 평가 기준 | Astro가 적합한 이유 |
|---|---|
| 컨텐츠/코드 분리 (NFR-MAINT) | Content Collections로 마크다운/데이터를 깔끔히 분리. `contents/` 폴더를 그대로 데이터 소스로 지정 가능. |
| `.bib` 관리 유지 (FR-PUB-4) | 빌드 시 JS로 `.bib` 파싱(`@retorquere/bibtex-parser`) → 컴포넌트로 렌더. 오너는 `.bib`만 추가. |
| 마크다운 프로젝트 페이지 (FR-PROJ-4) | 마크다운→HTML 네이티브 지원. frontmatter로 메타 관리. |
| 디자인 품질·일관성 (NFR-DESIGN) | 컴포넌트 단위로 디자인 시스템을 소유. 불필요한 런타임 JS 없음(섬 구조). |
| 성능 (NFR-PERF) | 기본이 무(無) JS 정적 HTML. Lighthouse 고득점 용이. |
| GitHub Pages 배포 (C-1/C-2) | 정적 산출물 → Pages 공식 지원. |
| 유지보수 단순성 | 빌드/의존성이 가볍고, 코드가 읽기 쉬움(기존 al-folio의 Ruby+15플러그인 대비 대폭 단순화). |

> **대안 검토**: ⓐ 순수 HTML/CSS(무빌드) — 가장 단순하나 `.bib` 자동화·재사용 컴포넌트·반응형 일관성에서 수작업 부담이 큼. ⓑ Next.js/React — 과함. **결론: Astro가 요구사항에 최적.**

### 1.2 보조 라이브러리(최소) — **전부 무료/오픈소스 (제약 C-5)**
- BibTeX 파싱: `@retorquere/bibtex-parser` (MIT, 무료).
- 스타일: 순수 CSS + CSS 변수(디자인 토큰). (무거운 UI 프레임워크 미사용)
- 폰트: **Inter** + **Newsreader**(헤딩/이름) — 둘 다 무료 OFL 라이선스. self-host(저장소에 동봉)하여 외부 유료 폰트 서비스 의존 0.
- 아이콘: 경량 오픈소스 SVG 아이콘(소셜/버튼용, 무료).
- → npm 의존성·폰트·아이콘 모두 무료. **유료 요소 없음.**

### 1.3 비용 검증 ($0 — 제약 C-5)
| 항목 | 비용 |
|---|---|
| Astro (빌드 도구) | 무료 (오픈소스 MIT) |
| GitHub Pages 호스팅 | **무료** (public repo, user 사이트) |
| GitHub Actions (빌드/배포) | **무료** (public repo 무제한 분) |
| 도메인 `yongjunshin.github.io` | **무료** (GitHub 제공 서브도메인, 커스텀 도메인 미사용) |
| 폰트/아이콘/라이브러리 | 무료 (OFL/MIT) |
| **합계** | **$0 / 월** — 기존과 동일, 서버·결제 불필요 |

---

## 2. 폴더 구조 (요구사항 §4 구현)

```
yongjunshin.github.io/
├── contents/                      # ★ 오너가 만지는 폴더 (페이지별 분리)
│   ├── home/
│   │   ├── intro.md               # 자기소개 + 연구 관심사
│   │   └── profile.jpg            # 프로필 사진
│   ├── cv/
│   │   ├── cv.yml                 # General/Employment/Education/Awards/Service
│   │   └── CV_Yong_Jun_Shin.pdf   # 다운로드용 PDF
│   ├── publications/
│   │   ├── papers.bib             # ★ 논문은 여기에 .bib로만 추가
│   │   ├── previews/              # 논문 미리보기 이미지
│   │   ├── pdfs/                  # 논문 PDF
│   │   └── slides/                # 슬라이드/포스터
│   ├── patents/
│   │   └── patents.yml            # 특허 목록(구조화)
│   ├── projects/
│   │   ├── sdi.md                 # 프로젝트별 1파일 (frontmatter + 본문 마크다운)
│   │   ├── becs.md
│   │   ├── ...
│   │   └── images/                # 프로젝트 이미지
│   └── news/
│       ├── 2026-06-17.md          # 뉴스 1건 = 파일 1개 (날짜 파일명)
│       └── ...
│
├── configs/
│   └── site.yml                   # ★ 비개발자용 안전 설정 (아래 §3)
│
├── src/                           # (code) 오너 미접근 — 디자인/로직
│   ├── components/                # Nav, Footer, PublicationItem, NewsItem, ProjectRow ...
│   ├── layouts/                   # 페이지 공통 레이아웃
│   ├── pages/                     # 라우팅 (/, /cv, /publications, /patents, /projects, /projects/[slug])
│   ├── lib/                       # bib 파서, 정렬, 저자 강조 등
│   └── styles/                    # 디자인 토큰 + 전역 스타일
│
├── public/                        # 파비콘 등 정적 패스스루
├── astro.config.mjs               # site=https://yongjunshin.github.io, base=/
├── package.json
└── .github/workflows/deploy.yml   # 빌드 → Pages 배포
```

> `contents/`와 `configs/`를 Astro content/loaders가 직접 참조하도록 설정한다(기본 `src/content` 대신 커스텀 경로). 오너 동선은 **contents/ 또는 configs/만** 만지면 끝.

> **설계 원칙 (제약 C-6)**: `src/`(코드)는 **개인정보 0**. 코드는 `contents/`·`configs/`에서 데이터를 읽어 렌더링만 한다. 이름·기관·링크·논문 등 어떤 개인 정보도 코드에 하드코딩하지 않는다. → 사이트 자체가 **재사용 가능한 템플릿**이 된다(제3자: contents 교체 + configs 수정 = 끝).

---

## 3. `configs/site.yml` 노출 항목 (확정안)

비개발자가 안전하게 다룰 수 있고 실제로 유용한 것만 노출. (간격·폰트·레이아웃 등은 제외 → 코드에서 관리)

```yaml
# 사이트 (재사용 시 여기만 바꾸면 URL/배포도 따라감 — 코드 수정 0)
site_url: "https://yongjunshin.github.io"   # astro.config가 이 값을 읽음 (하드코딩 X)

# 기본 정보
display_name: "Yong-Jun Shin"          # 화면에 표시되는 이름
role_subtitle: "Senior Researcher & Lecturer, AI Academy @ ETRI | PhD @ KAIST"

# 저자 강조: 아래 표기들과 일치하면 밑줄 처리
my_name_aliases:
  - "Yong-Jun Shin"
  - "Shin, Yong-Jun"
  - "Shin, Yong-jun"

# 소셜/외부 링크 (메인 + footer)
links:
  email: "yjshin@etri.re.kr"
  orcid: "0000-0001-6068-5054"
  google_scholar: "REwEK_wAAAAJ"
  github: "yongjunshin"
  linkedin: "yong-jun-shin"

# 메인 페이지
home_news_count: 5                     # News 노출 개수

# CV
cv_pdf_filename: "CV_Yong_Jun_Shin.pdf"

# Footer
copyright_name: "Yong-Jun Shin"        # © {year} {copyright_name}

# (선택) 강조 색 — 바꾸기 쉬운 단일 값만 노출
accent_color: "#4f46e5"
```

---

## 4. 배포 전략 (C-1 · C-2 · C-4 충족)

### 4.1 현재 상태
- 소스: `master` 브랜치 → al-folio GitHub Action이 Jekyll 빌드 → `gh-pages` 브랜치로 배포 → Pages가 `gh-pages` 서빙. CNAME 없음(기본 도메인).

### 4.2 신규 방식
- Astro를 GitHub Actions(`withastro/action` + `actions/deploy-pages`)로 빌드해 **GitHub Pages(Actions 소스)** 로 게시. `site = https://yongjunshin.github.io`, `base = /`.
- 결과 주소·경로 동일(`/`, `/cv/`, ...). → 외부 링크 영향 없음.

### 4.3 안전한 컷오버 절차
1. 신규 사이트를 **별도 브랜치**(예: `redesign`)에서 개발.
2. 로컬 빌드 + (선택) 임시 프리뷰로 전체 페이지·컨텐츠·링크 검증.
3. 기존 `master`/`gh-pages`는 보존(롤백 가능 상태 유지).
4. 검증 완료 후에만: 신규 코드를 운영 브랜치로 머지하고 Pages 소스를 신규 워크플로로 전환.
5. 배포 직후 스모크 체크(주요 URL·PDF·이미지·외부링크). 문제 시 즉시 롤백.

---

## 5. 개발 단계 (Milestones)

| 단계 | 산출물 | 핵심 작업 |
|---|---|---|
| **M0. 셋업** | 빈 Astro 프로젝트 + 폴더 골격 + 디자인 토큰 | 스택 초기화, `contents/`·`configs/` 배선, 전역 스타일/토큰, Nav/Footer/Layout |
| **M1. 컨텐츠 이관** | `contents/`로 데이터 이전 | about/intro, cv.yml, papers.bib(+자산), patents.yml, projects/*.md(+날짜필드), news/*.md, 프로필/이미지/PDF 전수 이관 |
| **M2. 페이지 구현** | 5개 페이지 + 프로젝트 상세 | 메인, CV, Publications(.bib 렌더+버튼+저자밑줄), Patents, Projects 리스트, Project 상세(markdown) |
| **M3. 디자인 마감** | 디자인 시스템 적용 완료 | 반응형, 인터랙션(hover/active), 일관 간격·타이포, 접근성, 파비콘/메타 |
| **M4. 검증** | 체크리스트 통과 | 컨텐츠 누락 0 대조, 링크/이미지/PDF 점검, Lighthouse, 모바일 확인, **`src/` 개인정보 0건 grep 테스트(C-6)**, **유료 의존성 0 확인(C-5)** |
| **M5. 배포·컷오버** | 운영 반영 | 배포 워크플로, Pages 소스 전환, 스모크 체크, 롤백 준비 |

> 각 단계 종료 시 오너 리뷰 포인트를 둔다. M2~M3에서 실제 화면을 보며 디테일을 조정.

---

## 6. 리스크 & 대응
| 리스크 | 대응 |
|---|---|
| `.bib` 커스텀 필드 파싱 누락 | 기존 28개 항목 회귀 대조 테이블로 검증 |
| 컨텐츠 이관 중 누락/오타 | M4에서 구→신 1:1 대조 체크리스트 |
| 한/영 혼용 컨텐츠 깨짐 | 폰트/인코딩 점검, 다국어 텍스트 렌더 테스트 |
| 배포 경로 변경으로 링크 깨짐 | 주요 경로 보존(C-3) + 스모크 체크 |
| Pages 소스 전환 실수 | 컷오버 전 기존 브랜치 보존, 롤백 절차 문서화 |
