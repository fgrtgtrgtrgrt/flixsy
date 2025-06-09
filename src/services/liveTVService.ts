import { LiveTVChannel, LiveTVCategory } from '@/types/liveTV';
import pako from 'pako'; // npm install pako

// IPTV playlist and EPG selection
const PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.m3u';
const EPG_URL = 'https://epgshare01.online/epgshare01/epg_ripper_US1.xml.gz'; // US EPG :contentReference[oaicite:1]{index=1}

interface Program {
  channelId: string;
  title: string;
  start: number;
  stop: number;
}

:contentReference[oaicite:2]{index=2}
  :contentReference[oaicite:3]{index=3}
  :contentReference[oaicite:4]{index=4}
  :contentReference[oaicite:5]{index=5}
}

:contentReference[oaicite:6]{index=6}
  :contentReference[oaicite:7]{index=7}
  :contentReference[oaicite:8]{index=8}\r?\n/);
  :contentReference[oaicite:9]{index=9}

  :contentReference[oaicite:10]{index=10}
    :contentReference[oaicite:11]{index=11}
      :contentReference[oaicite:12]{index=12}
      :contentReference[oaicite:13]{index=13}
      :contentReference[oaicite:14]{index=14}
      :contentReference[oaicite:15]{index=15}
      :contentReference[oaicite:16]{index=16}
      :contentReference[oaicite:17]{index=17}
      :contentReference[oaicite:18]{index=18}

      channels.push({
        id: `ch${channels.length}`,
        name,
        logo: logoMatch?.[1] || '/placeholder.svg',
        category: groupMatch?.[1] || 'General',
        country: 'Unknown',
        language: 'Unknown',
        url,
        isWorking: url.endsWith('.m3u8'),
        currentProgram: undefined
      });
    }
  });

  :contentReference[oaicite:19]{index=19}
}

:contentReference[oaicite:20]{index=20}
  :contentReference[oaicite:21]{index=21}
  :contentReference[oaicite:22]{index=22}
  :contentReference[oaicite:23]{index=23}
  :contentReference[oaicite:24]{index=24}
  :contentReference[oaicite:25]{index=25}
  :contentReference[oaicite:26]{index=26}
  :contentReference[oaicite:27]{index=27}

  :contentReference[oaicite:28]{index=28}
    :contentReference[oaicite:29]{index=29}
    :contentReference[oaicite:30]{index=30}
    :contentReference[oaicite:31]{index=31}
    :contentReference[oaicite:32]{index=32}
      :contentReference[oaicite:33]{index=33}
      :contentReference[oaicite:34]{index=34}
    }
  });

  return programs;
}

:contentReference[oaicite:35]{index=35}
  try {
    :contentReference[oaicite:36]{index=36}
      fetchPlaylist(),
      fetchEPG()
    ]);

    const epgMap = Object.fromEntries(
      epgList.map(p => [p.channelId, p.title])
    );

    return channels.map(ch => ({
      ...ch,
      currentProgram: epgMap[ch.id] || 'No info'
    }));
  :contentReference[oaicite:37]{index=37}
    :contentReference[oaicite:38]{index=38}
    return getFallbackChannels();
  }
}

:contentReference[oaicite:39]{index=39}
  :contentReference[oaicite:40]{index=40}
  :contentReference[oaicite:41]{index=41}

  :contentReference[oaicite:42]{index=42}
    :contentReference[oaicite:43]{index=43}
    :contentReference[oaicite:44]{index=44}
    :contentReference[oaicite:45]{index=45}
  });

  :contentReference[oaicite:46]{index=46}
    name,
    channels
  }));
}

:contentReference[oaicite:47]{index=47}
  return [
    {
      :contentReference[oaicite:48]{index=48}
      :contentReference[oaicite:49]{index=49}
      :contentReference[oaicite:50]{index=50}
      category: 'Educational',
      country: 'US',
      language: 'English',
      url:
        :contentReference[oaicite:51]{index=51}
      isWorking: true,
      :contentReference[oaicite:52]{index=52}
    },
    {
      :contentReference[oaicite:53]{index=53}
      :contentReference[oaicite:54]{index=54}
      :contentReference[oaicite:55]{index=55}
      category: 'News',
      country: 'QA',
      language: 'English',
      url:
        :contentReference[oaicite:56]{index=56}
      isWorking: true,
      :contentReference[oaicite:57]{index=57}
    }
  ];
}

:contentReference[oaicite:58]{index=58}
  :contentReference[oaicite:59]{index=59}
}
