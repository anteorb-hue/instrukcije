import axios from 'axios'
import jwt from 'jsonwebtoken'

// Zoom Integration
export async function createZoomMeeting(params: {
  topic: string
  startTime: Date
  duration: number // in minutes
  tutorEmail: string
}) {
  const { topic, startTime, duration, tutorEmail } = params

  try {
    const response = await axios.post(
      `https://api.zoom.us/v2/users/${tutorEmail}/meetings`,
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime.toISOString(),
        duration,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: false,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: 'both',
          auto_recording: 'cloud',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${await getZoomAccessToken()}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return {
      meetingId: response.data.id.toString(),
      meetingUrl: response.data.join_url,
      password: response.data.password,
    }
  } catch (error) {
    console.error('Error creating Zoom meeting:', error)
    throw new Error('Failed to create Zoom meeting')
  }
}

async function getZoomAccessToken() {
  // For Server-to-Server OAuth
  try {
    const response = await axios.post(
      'https://zoom.us/oauth/token',
      null,
      {
        params: {
          grant_type: 'account_credentials',
          account_id: process.env.ZOOM_ACCOUNT_ID,
        },
        auth: {
          username: process.env.ZOOM_CLIENT_ID!,
          password: process.env.ZOOM_CLIENT_SECRET!,
        },
      }
    )

    return response.data.access_token
  } catch (error) {
    console.error('Error getting Zoom access token:', error)
    throw new Error('Failed to authenticate with Zoom')
  }
}

// Google Meet Integration
export async function createGoogleMeetMeeting(params: {
  summary: string
  startTime: Date
  duration: number
  attendees: string[]
}) {
  const { summary, startTime, duration, attendees } = params

  try {
    const endTime = new Date(startTime.getTime() + duration * 60000)
    const accessToken = await getGoogleAccessToken()

    // Create calendar event with Google Meet
    const response = await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        summary,
        description: 'Sesija putem Instrukcije.hr platforme',
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'Europe/Zagreb',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'Europe/Zagreb',
        },
        attendees: attendees.map((email) => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 15 },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          conferenceDataVersion: 1,
        },
      }
    )

    const meetingUrl = response.data.conferenceData?.entryPoints?.find(
      (ep: { entryPointType?: string; uri?: string }) => ep.entryPointType === 'video'
    )?.uri || response.data.hangoutLink

    return {
      meetingId: response.data.conferenceData?.conferenceId || `meet-${Date.now()}`,
      meetingUrl,
      password: undefined,
    }
  } catch (error: unknown) {
    const errorData = error && typeof error === 'object' && 'response' in error ? (error as { response?: { data?: unknown } }).response?.data : error
    console.error('Error creating Google Meet meeting:', errorData)
    throw new Error('Failed to create Google Meet meeting')
  }
}

async function getGoogleAccessToken() {
  // Service Account OAuth2 for server-to-server
  try {
    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }

    const jwtClient = {
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    }

    // Create JWT token
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      iss: jwtClient.email,
      scope: jwtClient.scopes.join(' '),
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    }

    // Sign JWT (requires jose or jsonwebtoken library)
    const token = jwt.sign(payload, jwtClient.key, { algorithm: 'RS256' })

    // Exchange JWT for access token
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return response.data.access_token
  } catch (error) {
    console.error('Error getting Google access token:', error)
    throw new Error('Failed to authenticate with Google')
  }
}

// Microsoft Teams Integration
export async function createTeamsMeeting(params: {
  subject: string
  startTime: Date
  duration: number
}) {
  const { subject, startTime, duration } = params

  try {
    const endTime = new Date(startTime.getTime() + duration * 60000)
    const accessToken = await getTeamsAccessToken()

    // Create online meeting via Microsoft Graph API
    const response = await axios.post(
      'https://graph.microsoft.com/v1.0/me/onlineMeetings',
      {
        subject,
        startDateTime: startTime.toISOString(),
        endDateTime: endTime.toISOString(),
        participants: {
          attendees: [],
        },
        lobbyBypassSettings: {
          scope: 'organization',
          isDialInBypassEnabled: false,
        },
        allowedPresenters: 'everyone',
        allowMeetingChat: 'enabled',
        allowTeamworkReactions: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return {
      meetingId: response.data.id,
      meetingUrl: response.data.joinWebUrl || response.data.joinUrl,
      password: undefined,
    }
  } catch (error: unknown) {
    const errorData = error && typeof error === 'object' && 'response' in error ? (error as { response?: { data?: unknown } }).response?.data : error
    console.error('Error creating Teams meeting:', errorData)
    throw new Error('Failed to create Microsoft Teams meeting')
  }
}

async function getTeamsAccessToken() {
  // Client Credentials OAuth2 flow for app-only access
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    return response.data.access_token
  } catch (error) {
    console.error('Error getting Teams access token:', error)
    throw new Error('Failed to authenticate with Microsoft Teams')
  }
}

export async function createMeeting(
  provider: 'ZOOM' | 'GOOGLE_MEET' | 'MICROSOFT_TEAMS',
  params: {
    topic: string
    startTime: Date
    duration: number
    tutorEmail: string
    studentEmail: string
  }
) {
  switch (provider) {
    case 'ZOOM':
      return await createZoomMeeting(params)
    case 'GOOGLE_MEET':
      return await createGoogleMeetMeeting({
        summary: params.topic,
        startTime: params.startTime,
        duration: params.duration,
        attendees: [params.tutorEmail, params.studentEmail],
      })
    case 'MICROSOFT_TEAMS':
      return await createTeamsMeeting({
        subject: params.topic,
        startTime: params.startTime,
        duration: params.duration,
      })
    default:
      throw new Error('Unsupported video provider')
  }
}
