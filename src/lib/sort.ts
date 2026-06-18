/** 정렬 유틸 (순수 함수). 모두 새 배열을 반환하며 입력을 변형하지 않는다. */

/** 논문: 연도 내림차순. 동일 연도는 입력 순서 유지(안정 정렬). */
export function sortByYearDesc<T extends { year: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => b.year - a.year);
}

interface ProjectLike {
  start_year: number;
  end_year?: number | null;
  importance?: number;
}

/**
 * 프로젝트: 시작연도 내림차순 → 종료연도 내림차순(진행중=Infinity 우선) → importance 오름차순.
 */
export function sortProjects<T extends ProjectLike>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    if (b.start_year !== a.start_year) return b.start_year - a.start_year;
    const ae = a.end_year ?? Number.POSITIVE_INFINITY;
    const be = b.end_year ?? Number.POSITIVE_INFINITY;
    if (be !== ae) return be - ae;
    return (a.importance ?? Number.POSITIVE_INFINITY) - (b.importance ?? Number.POSITIVE_INFINITY);
  });
}

/** date 문자열("YYYY-MM-DD") 내림차순 (특허). */
export function sortByDateDesc<T extends { date: string }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

/** 뉴스 컬렉션 엔트리(data.date: Date) 내림차순. */
export function sortNewsEntries<T extends { data: { date: Date } }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
