# 03. 디자인 스펙 & 시안 (Design Spec & Mockups)

> 최종 결과물의 룩앤필 정의 + 페이지별 레이아웃 와이어프레임.
> 톤: 라이트 모드, 모던한 computer scientist의 CV 사이트. 전문 디자이너 수준의 완성도.

---

## 1. 디자인 시스템 (Design Tokens)

### 1.1 컬러 (Light only)
| 토큰 | 값 | 용도 |
|---|---|---|
| `bg` | `#FFFFFF` | 페이지 배경 |
| `bg-subtle` | `#F7F8FA` | 섹션/카드 미묘한 배경, 구분 |
| `text` | `#18181B` | 본문 (거의 검정) |
| `text-muted` | `#52525B` | 메타(날짜, venue, 보조 정보) |
| `border` | `#E4E4E7` | 헤어라인, 구분선 |
| `accent` | `#4F46E5` (Indigo 600) | 링크, 활성 nav, 버튼 hover, 이름 밑줄 강조 |
| `accent-hover` | `#4338CA` | 강조 hover |

> 강조색은 `configs/site.yml`의 `accent_color` 단일 값으로 교체 가능 (예: 차분한 블루 `#2563EB`, 슬레이트 `#475569`, 무채색 모노 등).

### 1.2 타이포그래피 — **확정**
- **본문/UI**: `Inter` (variable), 폴백 system-ui. — *무료 OFL, self-host*
- **헤딩/이름(디스플레이)**: 세리프 `Newsreader` — 학술적 무게감 + 정제됨. — *무료 OFL, self-host*
  - 적용 범위: Hero 이름, 페이지 타이틀, 섹션 헤더(serif). 그 외 모든 본문/메타/버튼/nav는 Inter.
- **타입 스케일**:
  - 이름(Hero) 40px / 700
  - 페이지 타이틀 30px / 600
  - 섹션 헤더 19px / 600
  - 본문 16–17px / 400, 줄간격 1.65
  - 메타·캡션 14px / 500, `text-muted`

### 1.3 레이아웃 & 간격
- 콘텐츠 컬럼 최대폭 **~760px** (읽기 편한 1단). nav/footer는 풀폭, 콘텐츠는 중앙 정렬.
- 간격 스케일: 4/8/12/16/24/32/48/64 px (일관 적용 — 코드에서만 관리, 설정 비노출).
- 라운드: 카드/버튼 8px, 이미지 6px.
- 그림자: 거의 없음(미묘한 1px 보더 위주) → 깔끔·플랫·학술적.

### 1.4 인터랙션
- 링크: 기본 `text`, hover 시 `accent` + 밑줄. 부드러운 전환(150ms).
- Nav 활성 항목: `accent` 컬러 + 하단 2px 밑줄.
- 버튼(PDF/Web/Slides/BibTeX): 아웃라인 + 아이콘, hover 시 배경 `bg-subtle` 또는 `accent` 보더.
- 이미지: 부드러운 호버(살짝 확대 또는 보더 강조), 선택적 클릭 확대.

---

## 2. 전역 레이아웃

```
┌──────────────────────────────────────────────────────────────┐
│  YJ Shin                       About  CV  Publications  ...   │  ← sticky nav (활성=accent 밑줄)
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     [ 페이지 콘텐츠 760px ]                   │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│           ✉  ORCID  Scholar  GitHub  LinkedIn               │
│              © 2026 Yong-Jun Shin                            │  ← footer (전 페이지)
└──────────────────────────────────────────────────────────────┘
```

---

## 3. 페이지별 시안

### 3.1 메인 (About) — `/`
```
┌──────────────────────────────────────────────────────────────┐
│  YJ Shin                      About  CV  Publications  ...    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────┐    Yong-Jun Shin                              │
│   │          │    Senior Researcher & Lecturer, AI Academy   │
│   │  프로필   │    @ ETRI  |  PhD @ KAIST                     │
│   │  사진     │                                              │
│   │          │    ✉  ORCID  Scholar  GitHub  LinkedIn        │
│   └──────────┘                                               │
│                                                              │
│   I'm a senior researcher at ETRI ... (소개 문단)             │
│   My research interests include:                             │
│     · model-based software engineering                       │
│     · SW verification and validation                         │
│     · self-adaptive system  ...                              │
│                                                              │
│   ── News ───────────────────────────────────────────────    │
│   2026.06.17   🎤 Completed first 3-day intensive lecture...  │
│   2026.05.18   🎉 Paper accepted in IJSEKE...                │
│   2026.04.27   🎉 Single-authored paper accepted in IST...   │
│   2026.02.05   🎤 Invited talk at KCSE 2026...               │
│   2025.10.01   👏 Appointed lecturer at ETRI AI Academy...   │
│                                            (최신 5개)        │
│                                                              │
│   ── Highlighted Publications ───────────────────────────     │
│   ┌────┐  Runtime verification of cause–effect latency...    │
│   │img │  <u>Y-J Shin</u>.  Info. & Software Technology, 2026 │
│   └────┘  [BibTeX] [PDF] [Website]                           │
│   ┌────┐  A Platform-Independent ... Workflow Modeling ...    │
│   │img │  <u>Y-J Shin</u>, W. Utz.  ACM SAC, 2025            │
│   └────┘  [BibTeX] [PDF] [Website] [Slides]                  │
│   ... (selected=true 논문들, Publications와 동일 형식)        │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 CV — `/cv/`
```
┌──────────────────────────────────────────────────────────────┐
│  Curriculum Vitae                        [ ⬇ Download PDF ]   │
│  (TOC/점프버튼 없음 — 단정하게)                                │
│                                                              │
│  General Information                                          │
│    Name        Yong-Jun Shin                                 │
│    Position    Senior Researcher, ETRI, South Korea          │
│    Email       yjshin@etri.re.kr                             │
│    Homepage    yongjunshin.github.io                         │
│                                                              │
│  Employment                                                  │
│    Senior Researcher — ETRI                    2025 – Present │  ← 연도 우측 정렬
│    Researcher — ETRI                              2023 – 2025 │     (모든 섹션 일관)
│                                                              │
│  Education                                                   │
│    Ph.D., School of Computing — KAIST             2017 – 2023 │
│      Advisor: Doo-Hwan Bae · Area: Software engineering      │
│    B.S. — Handong Global University               2013 – 2017 │
│                                                              │
│  Honors and Awards                                           │
│    Best Artifact Paper Award (SEAMS)                    2021 │
│    Best Paper Award (KCC)                               2019 │
│    ...                                                       │
│                                                              │
│  Academic Service                                           │
│    Board Member — KIISE SE Society            2025 – Present │
│    Program Committee — SESoS / SEKE           2024 – Present │
│    ...                                                       │
│                                                              │
│  ── See also ──────────────────────────────────────────       │
│   [ Publications → ]  [ Patents → ]  [ Projects → ]          │  ← 나열 대신 링크
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Publications — `/publications/`
```
┌──────────────────────────────────────────────────────────────┐
│  Publications                            (시간 역순, 그룹 없음) │
│                                                              │
│  ┌──────┐   Runtime verification of cause–effect latency in  │
│  │      │   black-box systems                                │
│  │ prev │   <u>Yong-Jun Shin</u>                             │
│  │ img  │   Information and Software Technology · 2026        │
│  └──────┘   [ BibTeX ]  [ PDF ]  [ Website ]                 │
│  ──────────────────────────────────────────────────────────  │
│  ┌──────┐   MALE: A Multi-Objective Evaluation Method for AI │
│  │ prev │   J. Lee, <u>Y-J Shin</u>, S. Kang                 │
│  │ img  │   IEEE SMC · 2025                                  │
│  └──────┘   [ BibTeX ]  [ PDF ]  [ Website ]                 │
│  ──────────────────────────────────────────────────────────  │
│  ┌──────┐   A Platform-Independent Software-Intensive ...    │
│  │ prev │   <u>Y-J Shin</u>, W. Utz                          │
│  │ img  │   ACM SAC · 2025                                   │
│  └──────┘   [ BibTeX ]  [ PDF ]  [ Website ]  [ Slides ]     │
│  ...                                                         │
│                                                              │
│  · 버튼은 데이터 있는 것만 노출  · [BibTeX]→클립보드 복사     │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 Patents — `/patents/`
```
┌──────────────────────────────────────────────────────────────┐
│  Patents                                     (시간 역순)      │
│                                                              │
│  소프트웨어 정의형 모빌리티 디바이스와 인프라스트럭쳐 간 ...     │
│  SYSTEM AND METHOD FOR REAL-TIME PERFORMANCE VERIFICATION...  │
│    Status 출원(Application) · KIPO · 10-2024-0194553          │
│    Inventors 신용준, 강성주, 고동범 · 2024-12-23              │
│  ──────────────────────────────────────────────────────────  │
│  효율적인 사이버 물리 시스템 목표 검증을 위한 ...               │
│  DATA-DRIVEN ENVIRONMENT MODEL GENERATION ...                │
│    Status 출원 · KIPO · 10-2023-0083390                       │
│    Inventors 배두환, 신용준, 신동환 · 2023-06-28              │
│  ...                                                         │
└──────────────────────────────────────────────────────────────┘
```

### 3.5 Projects — `/projects/` (리스트형)
```
┌──────────────────────────────────────────────────────────────┐
│  Projects                                    (시간 역순)      │
│                                                              │
│  2024 – Present   SDI →                                      │
│                   Software-Defined Infrastructure for Future │
│                   Mobility (ETRI)                            │
│  ──────────────────────────────────────────────────────────  │
│  2020 – 2022      BECS →                                     │
│                   Dependable Big Data Platform in Edge Clouds│
│  ──────────────────────────────────────────────────────────  │
│  2019 – 2020      CybWin →                                   │
│                   Cybersecurity Platform for Critical Infra. │
│  ──────────────────────────────────────────────────────────  │
│  2017 – 2022      SESoS →                                    │
│                   Model-based Analysis & Verification ...    │
│  ...   (이름 클릭 → 상세 페이지)                              │
└──────────────────────────────────────────────────────────────┘
```

### 3.6 Project 상세 — `/projects/<slug>/`
```
┌──────────────────────────────────────────────────────────────┐
│  ← Projects                                                  │
│                                                              │
│  SDI                                                         │
│  Development of Software-Defined Infrastructure ... (설명)    │
│  2024 – Present · ETRI                                       │
│                                                              │
│  [ 마크다운 본문 그대로 렌더 ]                                 │
│   과제 개요                                                  │
│   [그림]                                                     │
│   다양한 미래 모빌리티 디바이스의 HW 이종성을 고려한 ...         │
│   참여 기관 / 연구 범위 / 오픈소스 저장소 링크 ...             │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. 반응형
- 데스크톱: 760px 단일 컬럼 중앙. 메인 hero는 사진+텍스트 2단.
- 모바일: 모든 2단 → 1단 스택(사진 위, 텍스트 아래 / 논문 썸네일 위, 정보 아래). nav는 컴팩트(축약 또는 토글).

## 5. 디자인 품질 체크리스트 (NFR-DESIGN)
- [ ] 전 페이지 동일 타입스케일·간격·컬러 토큰 사용
- [ ] 연도/날짜 정렬 위치 전 섹션 일관 (CV·Projects·Patents·News)
- [ ] 링크/버튼 hover·focus 상태 일관
- [ ] 한/영 혼용 시 자간·줄간격 자연스러움
- [ ] 여백 충분(빽빽하지 않게), 1px 헤어라인 위주의 절제된 구분
- [ ] 접근성: 대비 AA, 포커스 링, alt text
