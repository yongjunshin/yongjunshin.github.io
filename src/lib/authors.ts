import type { Author } from "./bibtex";

/** 화면 표기용 저자 이름: "Yong-Jun Shin" (firstName 없으면 lastName 만). */
export function authorDisplay(a: Author): string {
  return a.firstName ? `${a.firstName} ${a.lastName}` : a.lastName;
}

/** 비교용 정규화: 소문자 + 영숫자/한글만 남김. */
export function normalizeName(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
}

/**
 * 이 저자가 사이트 주인인지 판정 (configs 의 my_name_aliases 와 매칭).
 * "Yong-Jun Shin" / "Shin, Yong-Jun" / "Shin Yong-Jun" 등 다양한 표기를 인식.
 */
export function isMe(a: Author, aliases: string[]): boolean {
  const candidates = [
    authorDisplay(a),
    a.firstName ? `${a.lastName}, ${a.firstName}` : a.lastName,
    a.firstName ? `${a.lastName} ${a.firstName}` : a.lastName,
    a.lastName,
  ].map(normalizeName);
  const normalizedAliases = aliases.map(normalizeName);
  return candidates.some((c) => c.length > 0 && normalizedAliases.includes(c));
}
