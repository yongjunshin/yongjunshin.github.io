# Yong-Jun Shin — Personal CV / Portfolio

개인 CV·포트폴리오 사이트. [Astro](https://astro.build) 정적 사이트로 빌드해 **GitHub Pages 에 무료로 배포**합니다.
주소: <https://yongjunshin.github.io/>

---

# 🛠️ 유지보수 가이드 (내가 수정하는 곳)

> 코드를 몰라도 됩니다. **`contents/` 와 `configs/` 두 폴더만** 만지면 됩니다.
> `src/`(코드)는 열 필요가 없습니다.

| 폴더 | 무엇 | 언제 만지나 |
|---|---|---|
| **`contents/`** | 화면에 보이는 모든 콘텐츠 — 글·논문·특허·프로젝트·뉴스·CV + **PDF·이미지 파일까지 전부** | 내용을 추가/수정할 때 |
| **`configs/site.yml`** | 이름·소셜 링크·강조색 등 사이트 설정 | 가끔 |

수정 후에는 [미리보기](#-수정-후-미리보기) 로 확인하고 [배포](#-배포하기) 하면 끝입니다.

---

## 📁 `contents/` 폴더 안내

```
contents/
├── home/
│   ├── intro.md            # 메인 페이지 소개 글
│   └── profile.jpg         # 프로필 사진
├── cv/
│   ├── cv.yml              # CV 내용 (경력·학력·수상·활동)
│   └── CV_Yong_Jun_Shin.pdf# 다운로드용 CV PDF
├── publications/
│   ├── papers.bib          # 논문 목록 (BibTeX)
│   ├── previews/           # 논문 미리보기 이미지
│   ├── pdfs/               # 논문 PDF
│   └── slides/             # 슬라이드·포스터 PDF
├── patents/
│   └── patents.yml         # 특허 목록
├── projects/
│   ├── sdi.md ...          # 프로젝트 1개 = 파일 1개
│   └── images/             # 프로젝트 본문 이미지
└── news/
    └── 2026-06-17.md ...   # 뉴스 1건 = 파일 1개
```

> 💡 **규칙 하나**: 텍스트든 PDF든 이미지든, 콘텐츠는 전부 `contents/` 안에 둡니다. PDF·이미지는 위 폴더에 파일을 넣고, 글/목록 파일에서 그 파일명을 가리키기만 하면 됩니다.

---

## ✍️ 콘텐츠 수정 가이드

### 1) 소개 글 · 프로필 사진 (메인 페이지)
- **소개 글**: `contents/home/intro.md` 를 열어 본문을 마크다운으로 수정. (맨 위 `---` 사이는 비워두세요.)
- **프로필 사진**: `contents/home/profile.jpg` 파일을 새 사진으로 교체. (파일명은 `profile.jpg` 유지)

### 2) News 추가
`contents/news/` 에 **`YYYY-MM-DD.md`** 이름으로 새 파일을 만듭니다. 날짜순은 자동 정렬되고, 메인에는 최신 5개가 보입니다(`/news/` 페이지엔 전체).
```markdown
---
date: 2026-07-01
---

🎉 여기에 한 줄로 소식을 적습니다.
```

### 3) Publication(논문) 추가
1. `contents/publications/papers.bib` 에 BibTeX 항목을 추가합니다.
2. 관련 파일을 폴더에 넣고 bib 에서 **파일명만** 가리킵니다:
   - `preview={그림.jpg}` → 파일을 `contents/publications/previews/` 에
   - `pdf={논문.pdf}` → `contents/publications/pdfs/` 에
   - `slides={슬라이드.pdf}` 또는 `poster={포스터.pdf}` → `contents/publications/slides/` 에
```bibtex
@article{shin2026example,
  title   = {My Great Paper Title},
  author  = {Shin, Yong-Jun and Doe, Jane},
  journal = {Journal of Awesome Research},
  year    = {2026}

  ,selected={true}
  ,preview={example.jpg}
  ,pdf={example.pdf}
  ,website={https://doi.org/...}
  ,slides={example_slides.pdf}
}
```
표준 필드(`title`, `author`, `journal`/`booktitle`, `year`) 뒤에 한 줄 띄우고 아래 보조 필드를 `,` 로 이어 적습니다(기존 항목들과 동일한 형식):
- `selected={true}` → 메인 'Highlighted Publications' 에 노출
- `preview={파일명.jpg}` / `pdf={파일명.pdf}` / `slides={파일명.pdf}` → 각 폴더의 파일명
- `website={URL}` → 'Website' 버튼 링크

추가 안내:
- 최신순 정렬은 `year` 기준 자동. 저자 목록에서 **내 이름은 자동으로 밑줄**(아래 `my_name_aliases` 기준).
- `pdf`/`slides` 에 파일 대신 `https://...` 링크를 그대로 넣어도 됩니다.
- 표준 BibTeX 에는 `%` 주석이 없으니, 항목 안에 주석을 적지 마세요.

### 4) Patent(특허) 추가
`contents/patents/patents.yml` 에 항목을 추가합니다(날짜순 자동 정렬).
```yaml
- title: 한글 특허 제목
  title_en: English Patent Title
  status: Application (출원)        # 또는 Granted (등록)
  agency: Korean Intellectual Property Office
  number: 10-2026-0000000
  inventors: 신용준, 홍길동
  date: "2026-07-01"              # 따옴표 꼭 유지
```

### 5) Project 추가
`contents/projects/` 에 **`<영문이름>.md`** 파일을 만듭니다. 이름을 클릭하면 이 파일 내용이 상세 페이지로 열립니다.
```markdown
---
title: 프로젝트 이름
description: 한 줄 설명
institution: ETRI
role: 내 역할
period: 2026 – Present
start_year: 2026          # 정렬 기준 (필수, 숫자)
end_year: null            # 진행중이면 null, 끝났으면 연도(예: 2028)
importance: 1
---

본문을 자유롭게 마크다운으로 작성합니다.

## 소제목

- 항목
- 항목

이미지는 contents/projects/images/ 에 넣고 아래처럼 넣습니다:

![설명](./images/그림.png)
```
> 그림이 너무 큰 원본(가로 2000px 이상)이면 적당히 줄여서 넣는 게 좋습니다(페이지가 가벼워집니다).

### 6) CV 수정
`contents/cv/cv.yml` 을 수정합니다. 섹션은 두 종류입니다.
- **`type: map`** (General Information): `name`/`value` 쌍
- **`type: timeline`** (경력·학력·수상·활동): `title`, `institution`, `year`, `url`(선택), `details`(선택, 여러 줄)
```yaml
- title: Employment
  type: timeline
  contents:
    - title: Senior Researcher
      institution: ETRI, South Korea
      url: https://www.etri.re.kr/eng/main/main.etri
      year: 2025 - Present
      details:
        - 한 줄 설명 (선택)
```
- **CV PDF 교체**: `contents/cv/` 의 PDF 파일을 바꾸고, 파일명이 바뀌면 `configs/site.yml` 의 `cv_pdf_filename` 도 맞춰주세요.

---

## ⚙️ `configs/site.yml` 설정

| 항목 | 설명 |
|---|---|
| `site_url` | 사이트 주소. (재사용 시에만 변경) |
| `site_title` | 브라우저 탭 제목 |
| `nav_brand` | 좌상단에 보이는 짧은 이름 |
| `display_name` | 메인에 크게 보이는 이름 |
| `role_subtitle` | 이름 아래 한 줄 소개 |
| `my_name_aliases` | 논문 저자 목록에서 **밑줄 칠 내 이름** 표기들 (여러 변형을 적어두세요) |
| `links` | 이메일·ORCID·Google Scholar·GitHub·LinkedIn (비우면 해당 아이콘 숨김) |
| `home_news_count` | 메인에 보일 News 개수 (기본 5) |
| `cv_pdf_filename` | `contents/cv/` 안의 CV PDF 파일명 |
| `copyright_name` | 푸터 © 뒤에 들어갈 이름 |
| `accent_color` | 강조 색 (이 한 줄만 바꾸면 링크·버튼·밑줄 색이 전부 바뀜) |

---

## 👀 수정 후 미리보기

```bash
npm install      # 최초 1회만
npm run dev      # http://localhost:4321 에서 실시간 확인 (저장하면 자동 새로고침)
```

## 🚀 배포하기

수정한 내용을 GitHub 저장소의 `main`(또는 `master`) 브랜치에 push 하면, GitHub Actions 가 자동으로 빌드·게시합니다. 잠시 후 <https://yongjunshin.github.io/> 에 반영됩니다. (비용 0)

> 최초 1회 전환 절차(기존 사이트에서 갈아끼우기)는 [`docs/04-deployment-and-maintenance.md`](docs/04-deployment-and-maintenance.md) 참고.

---

## 🚫 건드리지 않아도 되는 것
- **`src/`** — 사이트의 디자인·동작 코드. 콘텐츠/설정이 전부 분리돼 있어 여기를 열 일이 없습니다. (개인정보도 들어있지 않습니다.)
- **`dist/`, `node_modules/`** — 자동 생성물.

---

## 🧪 (선택) 테스트
개발자용 검증 명령입니다. 평소엔 안 써도 됩니다.
```bash
npm run test:cov       # 단위 + 통합 테스트 (커버리지)
npm run test:scenario  # 콘텐츠/설정 변경 시나리오
npm run test:e2e       # 브라우저 E2E
```

## 📚 문서
- [`docs/01-requirements.md`](docs/01-requirements.md) — 요구사항 명세
- [`docs/02-architecture-and-plan.md`](docs/02-architecture-and-plan.md) — 아키텍처·구조
- [`docs/03-design-spec.md`](docs/03-design-spec.md) — 디자인 스펙·시안
- [`docs/04-deployment-and-maintenance.md`](docs/04-deployment-and-maintenance.md) — 배포·유지보수 상세
