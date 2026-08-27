// 한글 조사 자동 선택 유틸
// 단어의 마지막 글자에 받침이 있는지 여부로 조사를 고른다.

// 마지막 글자에 받침이 있으면 true
export function hasFinalConsonant(word) {
  if (!word) return false
  const lastChar = word[word.length - 1]
  const code = lastChar.charCodeAt(0)
  // 한글 음절 영역이 아니면 받침 없는 것으로 처리
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

// 받침 유무에 따라 조사를 선택 (withFinal: 받침 있을 때, withoutFinal: 받침 없을 때)
export function pickParticle(word, withFinal, withoutFinal) {
  return hasFinalConsonant(word) ? withFinal : withoutFinal
}

// 자주 쓰는 조사 헬퍼
export const subjectParticle = (word) => pickParticle(word, '이', '가') // 이/가
export const topicParticle = (word) => pickParticle(word, '은', '는') // 은/는
export const objectParticle = (word) => pickParticle(word, '을', '를') // 을/를

// "서울이", "제주가" 처럼 단어에 조사를 붙여 반환
export function withSubject(word) {
  return `${word}${subjectParticle(word)}`
}
