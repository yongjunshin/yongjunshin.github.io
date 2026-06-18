# Yong-Jun Shin — Personal CV / Portfolio

개인 CV·포트폴리오 사이트. [Astro](https://astro.build) 정적 사이트로 빌드해 **GitHub Pages 에 무료로 배포**합니다.
주소: <https://yongjunshin.github.io/>

## 폴더 구조 (3분할)

| 폴더 | 역할 | 누가 만지나 |
|---|---|---|
| **`contents/`** | 화면에 보이는 모든 콘텐츠 (논문 `.bib`, 특허, 프로젝트, 뉴스, CV, 소개글, 이미지/PDF) | 👤 평소 여기만 |
| **`configs/site.yml`** | 이름·소셜 링크·강조색 등 안전한 설정 | 👤 가끔 |
| **`src/`** | 디자인·로직·빌드 (개인정보 0) | 🔒 안 건드림 |

> 개인정보·콘텐츠는 전부 `contents/`·`configs/` 에만 있습니다. `src/` 코드에는 개인정보가 하나도 없어서, 다른 사람도 `contents/` 만 교체하면 자기 사이트로 재사용할 수 있습니다.

## 자주 하는 작업

| 하고 싶은 것 | 어디를 |
|---|---|
| 논문 추가 | `contents/publications/papers.bib` 에 BibTeX 추가 (+ preview/pdf 파일) |
| 뉴스 추가 | `contents/news/YYYY-MM-DD.md` 새 파일 |
| 프로젝트 추가 | `contents/projects/<이름>.md` |
| 특허 추가 | `contents/patents/patents.yml` |
| CV 수정 | `contents/cv/cv.yml` |
| 이름·링크·색 변경 | `configs/site.yml` |

자세한 레시피와 배포 절차: [`docs/04-deployment-and-maintenance.md`](docs/04-deployment-and-maintenance.md)

## 로컬에서 보기

```bash
npm install
npm run dev      # http://localhost:4321
```

## 테스트

```bash
npm run test:cov       # 단위 + 통합 (커버리지 100%)
npm run test:scenario  # 콘텐츠/설정 변경 시나리오
npm run test:e2e       # 브라우저 E2E
```

## 배포

`main`/`master` 에 push → GitHub Actions 가 자동으로 빌드·게시. (비용 0)

## 문서

- [`docs/01-requirements.md`](docs/01-requirements.md) — 요구사항 명세
- [`docs/02-architecture-and-plan.md`](docs/02-architecture-and-plan.md) — 아키텍처·구조
- [`docs/03-design-spec.md`](docs/03-design-spec.md) — 디자인 스펙·시안
- [`docs/04-deployment-and-maintenance.md`](docs/04-deployment-and-maintenance.md) — 배포·유지보수
