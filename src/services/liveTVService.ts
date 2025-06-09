import { LiveTVChannel, LiveTVCategory } from '@/types/liveTV';

const MOCK_CHANNELS: LiveTVChannel[] = [
  {
    id: '1',
    name: 'NASA TV',
    logo: '/placeholder.svg',
    category: 'Educational',
    country: 'US',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    isWorking: true,
    currentProgram: 'Spacewalk Live',
    programStart: '2025-06-08T19:00:00Z',
    programEnd: '2025-06-08T20:00:00Z',
  },
  {
    id: '2',
    name: 'Weather Network',
    logo: '/placeholder.svg',
    category: 'Weather',
    country: 'CA',
    url: 'https://weather-lh.akamaihd.net/i/twc_1@92006/master.m3u8',
    isWorking: true,
    currentProgram: 'Storm Watch',
    programStart: '2025-06-08T19:30:00Z',
    programEnd: '2025-06-08T20:30:00Z',
  },
  {
    id: '3',
    name: 'Al Jazeera English',
    logo: '/placeholder.svg',
    category: 'News',
    country: 'QA',
    url: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
    isWorking: true,
    currentProgram: 'Global News Hour',
    programStart: '2025-06-08T19:15:00Z',
    programEnd: '2025-06-08T20:15:00Z',
  },
];

export const getAllChannels = async (): Promise<LiveTVChannel[]> => {
  return MOCK_CHANNELS;
};

export const getChannelsByCategory = async (): Promise<LiveTVCategory[]> => {
  const channels = await getAllChannels();

  const categorized: Record<string, LiveTVChannel[]> = channels.reduce((acc, channel) => {
    const category = channel.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, LiveTVChannel[]>);

  return Object.entries(categorized).map(([name, channels]) => ({
    name,
    channels,
  }));
};

export const getStreamUrl = (channel: LiveTVChannel): string => {
  return channel.url;
};

export const liveTVService = {
  getAllChannels,
  getChannelsByCategory,
  getStreamUrl,
};
