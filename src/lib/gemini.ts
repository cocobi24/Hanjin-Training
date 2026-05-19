const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string
const MODEL = (import.meta.env.VITE_GEMINI_MODEL as string) ?? 'gemini-2.0-flash'
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

export interface GeminiOptions {
  temperature?: number
  maxOutputTokens?: number
  signal?: AbortSignal
}

/**
 * Gemini REST API 단일 호출.
 * history 에 이전 turns 을 넘기면 멀티턴 대화가 됩니다.
 */
export async function callGemini(
  prompt: string,
  history: GeminiMessage[] = [],
  options: GeminiOptions = {},
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      'VITE_GEMINI_API_KEY 환경변수가 없습니다. .env.local 파일을 확인하세요.',
    )
  }

  const contents: GeminiMessage[] = [
    ...history,
    { role: 'user', parts: [{ text: prompt }] },
  ]

  const res = await fetch(`${BASE_URL}?key=${encodeURIComponent(API_KEY)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 8192,
      },
    }),
    signal: options.signal,
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Gemini API 오류 (${res.status}): ${body.slice(0, 300)}`)
  }

  const data = await res.json()
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!text) throw new Error('Gemini 응답이 비어 있습니다.')
  return text
}

/** 파일 내용을 포함해 Gemini에게 분석을 요청합니다. */
export async function analyzeWithGemini(
  systemInstruction: string,
  fileContent: string,
  options: GeminiOptions = {},
): Promise<string> {
  const prompt = `${systemInstruction}\n\n---\n${fileContent}`
  return callGemini(prompt, [], options)
}
