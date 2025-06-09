import axios from 'axios';

export interface LiveTVChannel {
  id: string;
  name: string;
  logo: string;
  url: string; // stream URL
  category: string;
  country: string;
  currentShow?: string;
  isWorking?: boolean;
}

const CHANNELS_URL = 'https://iptv-org.github.io/api/channels.json';
const EPG_URL = 'https://iptv-org.github.io/api/epg.json';

// Fetch channels and enrich with current show info
export async function fetchChannelsWithCurrentShow() {
  try {
    const [channelsRes, epgRes] = await Promise.all([
      axios.get<LiveTVChannel[]>(CHANNELS_URL),
      axios.get<Record<string, { title?: string }[]>>(EPG_URL)
    ]);

    const channels = channelsRes.data;
    const epg = epgRes.data;

    // Map EPG by channel id for quick lookup
    const epgByChannel: Record<string, string> = {};

    Object.entries(epg).forEach(([channelId, programs]) => {
      if (programs && programs.length > 0) {
        epgByChannel[channelId] = programs[0].title || '';
      }
    });

    // Add currentShow and isWorking flag based on if stream url exists
    const enrichedChannels = channels.map(ch => ({
      ...ch,
      currentShow: epgByChannel[ch.id] || 'Unknown show',
      isWorking: !!ch.url,
    }));

    return enrichedChannels;
  } catch (err) {
    console.error('Failed to fetch channels or EPG', err);
    return [];
  }
}
