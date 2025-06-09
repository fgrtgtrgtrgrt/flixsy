import { LiveTVChannel, LiveTVCategory } from '@/types/liveTV';

const PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.m3u';

export const liveTVService = {
  getAllChannels,
  getChannelsByCategory,
  getFallbackChannels,
  getStreamUrl,
};

async function fetchPlaylist(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

function parseM3U(text: string): LiveTVChannel[] {
  const lines = text.split(/\r?\n/);
  const channels: LiveTVChannel[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF:')) {
      const info = line.substring(8);
      const [meta, name] = info.split(',', 2);
      const url = lines[++i]?.trim() || '';
      // Extract logo, category from meta if available
      const logoMatch = meta.match(/tvg-logo="([^"]+)"/);
      const categoryMatch = meta.match(/group-title="([^"]+)"/);
      channels.push({
        id: `ch-${channels.length}`,
        name: name || 'Unknown',
        logo: logoMatch?.[1] || '/placeholder.svg',
        category: categoryMatch?.[1] || 'General',
        country: 'Unknown',
        language: 'Unknown',
        url,
        isWorking: url.endsWith('.m3u8'),
      });
    }
  }
  return channels.slice(0, 100);
}

async function getAllChannels(): Promise<LiveTVChannel[]> {
  try {
    console.log('Fetching .m3u playlist...');
    const text = await fetchPlaylist(PLAYLIST_URL);
    const channels = parseM3U(text);
    console.log(`Loaded ${channels.length} channels from playlist`);
    return channels;
  } catch (err: any) {
    console.error('Error loading .m3u', err);
    return getFallbackChannels();
  }
}

export async function getChannelsByCategory(): Promise<LiveTVCategory[]> {
  const channels = await getAllChannels();
  const map: Record<string, LiveTVChannel[]> = {};
  channels.forEach(c => {
    const cat = c.category || 'General';
    if (!map[cat]) map[cat] = [];
    map[cat].push(c);
  });
  return Object.entries(map).map(([name, ch]) => ({ name, channels: ch }));
}

export function getFallbackChannels(): LiveTVChannel[] {
  return [
    {
      id: 'fallback-1',
      name: 'NASA TV',
      logo: '/placeholder.svg',
      category: 'Educational',
      country: 'US',
      language: 'English',
      url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
      isWorking: true,
    },
    {
      id: 'fallback-2',
      name: 'Al Jazeera English',
      logo: '/placeholder.svg',
      category: 'News',
      country: 'QA',
      language: 'English',
      url: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
      isWorking: true,
    },
    // Add more as needed
  ];
}

export function getStreamUrl(channel: LiveTVChannel): string {
  return channel.url;
}
