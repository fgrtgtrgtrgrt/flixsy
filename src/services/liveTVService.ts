
import { LiveTVChannel, LiveTVCategory } from '@/types/liveTV';

// Free IPTV API endpoints for live TV channels
const IPTV_API_BASE = 'https://iptv-org.github.io/api';

export const liveTVService = {
  async getAllChannels(): Promise<LiveTVChannel[]> {
    try {
      const response = await fetch(`${IPTV_API_BASE}/channels.json`);
      const data = await response.json();
      
      // Filter for working channels and format the data
      const channels: LiveTVChannel[] = data
        .filter((channel: any) => channel.status && channel.url)
        .slice(0, 100) // Limit to first 100 channels for performance
        .map((channel: any) => ({
          id: channel.id || Math.random().toString(36),
          name: channel.name || 'Unknown Channel',
          logo: channel.logo || '/placeholder.svg',
          category: channel.category || 'General',
          country: channel.country || 'Unknown',
          language: channel.language || 'Unknown',
          url: channel.url,
          isWorking: true
        }));

      return channels;
    } catch (error) {
      console.error('Error fetching live TV channels:', error);
      return liveTVService.getFallbackChannels();
    }
  },

  async getChannelsByCategory(): Promise<LiveTVCategory[]> {
    try {
      const channels = await liveTVService.getAllChannels();
      const categorized = channels.reduce((acc: { [key: string]: LiveTVChannel[] }, channel) => {
        const category = channel.category || 'General';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(channel);
        return acc;
      }, {});

      return Object.entries(categorized).map(([name, channels]) => ({
        name,
        channels
      }));
    } catch (error) {
      console.error('Error categorizing channels:', error);
      return [];
    }
  },

  getFallbackChannels(): LiveTVChannel[] {
    return [
      {
        id: '1',
        name: 'NASA TV',
        logo: '/placeholder.svg',
        category: 'Educational',
        country: 'US',
        language: 'English',
        url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
        isWorking: true
      },
      {
        id: '2',
        name: 'Weather Network',
        logo: '/placeholder.svg',
        category: 'Weather',
        country: 'CA',
        language: 'English',
        url: 'https://weather-lh.akamaihd.net/i/twc_1@92006/master.m3u8',
        isWorking: true
      },
      {
        id: '3',
        name: 'RT News',
        logo: '/placeholder.svg',
        category: 'News',
        country: 'RU',
        language: 'English',
        url: 'https://rt-glb.rttv.com/live/rtnews/playlist.m3u8',
        isWorking: true
      }
    ];
  },

  getStreamUrl(channel: LiveTVChannel): string {
    return channel.url;
  }
};
