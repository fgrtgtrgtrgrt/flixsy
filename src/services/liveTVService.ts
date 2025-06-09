
import { LiveTVChannel, LiveTVCategory } from '@/types/liveTV';

// Free IPTV API endpoints for live TV channels
const IPTV_API_BASE = 'https://iptv-org.github.io/api';

const getAllChannels = async (): Promise<LiveTVChannel[]> => {
  try {
    console.log('Fetching channels from API...');
    const response = await fetch(`${IPTV_API_BASE}/channels.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', {
      dataType: typeof data,
      isArray: Array.isArray(data),
      length: data?.length || 'unknown',
      firstItem: data?.[0] || 'no first item'
    });
    
    if (!Array.isArray(data)) {
      console.error('API response is not an array:', data);
      return getFallbackChannels();
    }
    
    // Filter for working channels and format the data
    const channels: LiveTVChannel[] = data
      .filter((channel: any) => {
        return channel && 
               typeof channel === 'object' && 
               channel.name && 
               channel.url &&
               channel.url.trim() !== '';
      })
      .slice(0, 100) // Limit to first 100 channels for performance
      .map((channel: any, index: number) => {
        const formattedChannel = {
          id: channel.id || `channel-${index}`,
          name: channel.name || 'Unknown Channel',
          logo: channel.logo || '/placeholder.svg',
          category: channel.category || 'General',
          country: channel.country || 'Unknown',
          language: channel.language || 'Unknown',
          url: channel.url,
          isWorking: true
        };
        
        if (index < 3) {
          console.log(`Sample channel ${index}:`, formattedChannel);
        }
        
        return formattedChannel;
      });

    console.log(`Successfully processed ${channels.length} channels`);
    return channels;
  } catch (error) {
    console.error('Error fetching live TV channels:', error);
    console.log('Falling back to hardcoded channels');
    return getFallbackChannels();
  }
};

const getChannelsByCategory = async (): Promise<LiveTVCategory[]> => {
  try {
    console.log('Getting channels by category...');
    const channels = await getAllChannels();
    
    if (!channels || channels.length === 0) {
      console.log('No channels received, returning empty array');
      return [];
    }
    
    console.log(`Categorizing ${channels.length} channels...`);
    
    const categorized: Record<string, LiveTVChannel[]> = channels.reduce((acc, channel) => {
      const category = channel.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(channel);
      return acc;
    }, {} as Record<string, LiveTVChannel[]>);

    const categories = Object.entries(categorized).map(([name, categoryChannels]) => ({
      name,
      channels: categoryChannels
    }));
    
    console.log('Categories created:', categories.map(cat => `${cat.name}: ${cat.channels.length} channels`));
    
    return categories;
  } catch (error) {
    console.error('Error categorizing channels:', error);
    return [];
  }
};

const getFallbackChannels = (): LiveTVChannel[] => {
  console.log('Using fallback channels');
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
    },
    {
      id: '4',
      name: 'Al Jazeera English',
      logo: '/placeholder.svg',
      category: 'News',
      country: 'QA',
      language: 'English',
      url: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
      isWorking: true
    },
    {
      id: '5',
      name: 'Bloomberg TV',
      logo: '/placeholder.svg',
      category: 'Business',
      country: 'US',
      language: 'English',
      url: 'https://bloomberg.com/media-manifest/streams/phoenix-us.m3u8',
      isWorking: true
    }
  ];
};

const getStreamUrl = (channel: LiveTVChannel): string => {
  return channel.url;
};

export const liveTVService = {
  getAllChannels,
  getChannelsByCategory,
  getFallbackChannels,
  getStreamUrl
};
