const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
const CHAT_WEBHOOK = import.meta.env.VITE_GOOGLE_CHAT_WEBHOOK_URL as string

// Gmail + Calendar 모두 사용하므로 두 scope를 포함
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar.events',
].join(' ')

declare const google: {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string
        scope: string
        callback: (response: { access_token?: string; error?: string }) => void
      }): { requestAccessToken(): void }
    }
  }
}

/** Google OAuth 팝업을 띄우고 access_token을 반환합니다. */
export function getGoogleAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID) {
      reject(new Error('VITE_GOOGLE_CLIENT_ID 환경변수가 없습니다. .env.local을 확인하세요.'))
      return
    }
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (res) => {
        if (res.error) reject(new Error(`Google 인증 실패: ${res.error}`))
        else resolve(res.access_token!)
      },
    })
    client.requestAccessToken()
  })
}

export interface GmailPayload {
  to: string
  subject: string
  body: string
}

/** Gmail로 메일을 발송합니다. accessToken은 getGoogleAccessToken()으로 획득하세요. */
export async function sendGmail(accessToken: string, payload: GmailPayload): Promise<void> {
  const raw = btoa(
    [
      `To: ${payload.to}`,
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(payload.subject)))}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: base64',
      '',
      btoa(unescape(encodeURIComponent(payload.body))),
    ].join('\r\n'),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gmail 발송 실패 (${res.status}): ${err.slice(0, 200)}`)
  }
}

export interface CalendarEvent {
  summary: string
  description?: string
  startDateTime: string
  endDateTime: string
  attendees?: string[]
}

/** Google Calendar에 일정을 생성합니다. */
export async function createCalendarEvent(
  accessToken: string,
  event: CalendarEvent,
): Promise<string> {
  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startDateTime, timeZone: 'Asia/Seoul' },
        end: { dateTime: event.endDateTime, timeZone: 'Asia/Seoul' },
        attendees: event.attendees?.map((email) => ({ email })),
      }),
    },
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Calendar 생성 실패 (${res.status}): ${err.slice(0, 200)}`)
  }

  const data = await res.json()
  return data.htmlLink as string
}

/** Google Chat Webhook으로 메시지를 발송합니다. (OAuth 불필요) */
export async function sendGoogleChat(message: string): Promise<void> {
  if (!CHAT_WEBHOOK) {
    throw new Error('VITE_GOOGLE_CHAT_WEBHOOK_URL 환경변수가 없습니다. .env.local을 확인하세요.')
  }

  const res = await fetch(CHAT_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Google Chat 발송 실패 (${res.status}): ${err.slice(0, 200)}`)
  }
}
