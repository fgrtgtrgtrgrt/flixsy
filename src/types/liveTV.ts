
export interface LiveTVChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  country: string;
  language: string;
  url: string;
  isWorking: boolean;
}

export interface LiveTVCategory {
  name: string;
  channels: LiveTVChannel[];
}
