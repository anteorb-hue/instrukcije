import axios from 'axios'

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

  // This requires Google Calendar API and OAuth2
  // Placeholder implementation - requires proper OAuth2 setup
  const endTime = new Date(startTime.getTime() + duration * 60000)

  return {
    meetingId: `meet-${Date.now()}`,
    meetingUrl: `https://meet.google.com/placeholder`,
    password: undefined,
  }
}

// Microsoft Teams Integration
export async function createTeamsMeeting(params: {
  subject: string
  startTime: Date
  duration: number
}) {
  const { subject, startTime, duration } = params

  // This requires Microsoft Graph API
  // Placeholder implementation - requires proper OAuth2 setup
  return {
    meetingId: `teams-${Date.now()}`,
    meetingUrl: `https://teams.microsoft.com/placeholder`,
    password: undefined,
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
