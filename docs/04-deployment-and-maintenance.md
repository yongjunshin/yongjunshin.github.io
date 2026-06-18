# 04. 배포 & 유지보수 가이드

> 기존 주소(`https://yongjunshin.github.io/`)·호스팅을 그대로 유지하며 새 사이트를 올리는 절차와, 이후 콘텐츠를 추가/수정하는 방법.

---

## A. 안전한 배포 컷오버 (기존 주소·호스팅 유지, 비용 0)

> 새 사이트는 GitHub Actions 가 자동 빌드해 GitHub Pages 로 게시한다. 도메인 `yongjunshin.github.io` 와 모든 경로(`/cv/`, `/publications/` …)가 그대로 유지된다.

### 1단계 — 기존 사이트 백업 (롤백 대비)
```bash
git clone https://github.com/yongjunshin/yongjunshin.github.io.git site-deploy
cd site-deploy
git branch backup-al-folio          # 기존 al-folio 사이트 보존
git push origin backup-al-folio     # 원격에도 백업 브랜치 푸시
```

### 2단계 — 새 프로젝트 파일로 교체
```bash
git rm -r --quiet .                 # 기존 파일 제거 (.git 히스토리는 유지)
# 새 프로젝트 파일 복사 (개발 산출물 제외)
rsync -a \
  --exclude='.git' --exclude='node_modules' --exclude='dist' \
  --exclude='legacy' --exclude='screenshots' --exclude='coverage' \
  --exclude='test-results' --exclude='playwright-report' \
  /home/yjshin/dev/aispace/cv-website/ ./
git add -A
git commit -m "Redesign: migrate to Astro (preserve URL & all content)"
git push origin master              # 기본 브랜치가 main 이면 main
```

### 3단계 — Pages 소스를 "GitHub Actions" 로 전환 (단 한 번)
GitHub 저장소 → **Settings → Pages → Build and deployment → Source = GitHub Actions** 로 변경.
(기존엔 `gh-pages` 브랜치에서 서빙했지만, 이제 Actions 가 빌드·게시한다.)

### 4단계 — 자동 배포 확인
- push 시 `.github/workflows/deploy.yml` 가 실행 → 빌드 → 게시.
- 저장소 **Actions** 탭에서 진행 확인. 완료되면 `https://yongjunshin.github.io/` 에 새 사이트가 뜬다.
- 스모크 체크: `/`, `/cv/`, `/publications/`, `/patents/`, `/projects/`, 그리고 CV PDF·논문 PDF 링크.

### 롤백 (문제 시)
```bash
git checkout backup-al-folio -- .     # 또는 Settings→Pages 소스를 gh-pages 브랜치로 되돌림
```

> 💸 비용: GitHub Pages·Actions(public repo) 모두 **무료**. 커스텀 도메인을 쓰지 않으므로 추가 비용 0.

---

## B. 평소 유지보수 — `contents/` 와 `configs/` 만 보면 됩니다

코드(`src/`)는 건드릴 필요가 없습니다. 변경 후 push 하면 자동 배포됩니다.

### 논문 추가 (Publications)
1. `contents/publications/papers.bib` 에 BibTeX 항목을 추가합니다 (기존과 동일 형식).
2. 옵션 필드로 에셋을 연결합니다 (파일은 모두 `contents/` 안에, bib 에는 파일명만 적습니다):
   - `preview={파일명.jpg}` → 이미지 파일을 `contents/publications/previews/` 에 넣기
   - `pdf={파일명.pdf}` → `contents/publications/pdfs/`
   - `slides={파일명.pdf}` / `poster={파일명.pdf}` → `contents/publications/slides/`
   - `website={URL}` , `selected={true}` (메인 Highlighted 에 노출)
   - `pdf`/`slides` 에 `https://...` 외부 URL 을 그대로 넣어도 됩니다(파일 대신).
   - 본인 이름은 `configs/site.yml` 의 `my_name_aliases` 와 일치하면 자동으로 밑줄 표시됩니다.

> 📂 **모든 콘텐츠는 `contents/` 한 곳에**: 텍스트(bib/yaml/md)든 파일(PDF/이미지)이든 전부 `contents/` 안에 두면 됩니다. `contents/` 가 곧 사이트의 정적 서빙 폴더라, 그 안의 파일은 그대로 링크되어 열립니다. 따로 찾아다닐 다른 폴더는 없습니다.

### 뉴스 추가 (News)
`contents/news/YYYY-MM-DD.md` 새 파일:
```markdown
---
date: 2026-07-01
---

🎉 내용을 여기에 적습니다.
```
최신순 자동 정렬. 메인에는 최신 N개(기본 5, `configs` 의 `home_news_count`)가 보입니다.

### 프로젝트 추가 (Projects)
`contents/projects/<슬러그>.md`:
```markdown
---
title: 프로젝트명
description: 한 줄 설명
institution: ETRI
role: 내 역할
period: 2026 – Present
start_year: 2026      # 정렬 기준(필수)
end_year: null        # 진행중이면 null, 끝났으면 연도
importance: 1
---

본문은 자유롭게 마크다운으로 작성. 이미지는 contents/projects/images/ 에 넣고
![설명](./images/그림.png) 로 넣으면 됩니다.
```
이름 클릭 → 상세 페이지로 이동합니다.

### 특허 추가 (Patents)
`contents/patents/patents.yml` 에 항목 추가 (최신순 자동 정렬):
```yaml
- title: 한글 제목
  title_en: English Title
  status: Application (출원)      # 또는 Granted (등록)
  agency: Korean Intellectual Property Office
  number: 10-2026-0000000
  inventors: 신용준, ...
  date: "2026-07-01"
```

### CV 수정
`contents/cv/cv.yml` 에서 섹션 항목을 수정/추가합니다.
- `type: map` (General Information): `name` / `value` 쌍
- `type: timeline` (경력·학력·수상·활동): `title` / `institution` / `year` / `url` / `details[]`
- CV PDF 교체: `contents/cv/` 의 PDF 를 바꾸고 `configs/site.yml` 의 `cv_pdf_filename` 을 맞추세요.

### 이름 · 링크 · 강조색 변경
`configs/site.yml` — `display_name`, `role_subtitle`, `links`(이메일/ORCID/Scholar/GitHub/LinkedIn), `copyright_name`, `accent_color`(한 줄로 전체 색 변경), `home_news_count` 등.

---

## C. 로컬 작업 명령
```bash
npm install            # 최초 1회
npm run dev            # 개발 서버 (http://localhost:4321), 저장 시 즉시 반영
npm run build          # 정적 빌드 (dist/)
npm run preview        # 빌드 결과 미리보기

npm run test:cov       # 단위 + 통합 테스트 (커버리지)
npm run test:scenario  # 콘텐츠/설정 변경 시나리오 테스트
npm run test:e2e       # 브라우저 E2E 테스트
node scripts/screenshot.mjs   # 주요 페이지 스크린샷 재생성 (preview 서버 필요)
```

## D. 재사용 (다른 사람이 이 사이트를 쓰려면)
개인정보는 코드에 전혀 없습니다(제약 C-6). `contents/` 를 자기 것으로 교체하고 `configs/site.yml` 만 수정하면 됩니다 — 코드(`src/`)는 한 줄도 고칠 필요가 없습니다.
