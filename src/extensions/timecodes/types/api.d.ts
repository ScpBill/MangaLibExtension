interface EpisodeResponse {
  data: {
    anime_id: number,
    created_at: string,
    id: number,
    name: string,
    number: string,
    number_secondary: string,
    players: [{
      created_at: string,
      episode_id: number,
      id: number,
      moderated?: number,
      player: string,
      src: string,
      team: {
        cover: {
          default: string,
          filename: string | null,
          md?: string,
          thumbnail: string
        },
        id: number,
        model: string,
        name: string,
        slug: string,
        slug_url: string,
        stats?: [{
          formatted: string,
          label: string,
          short: string,
          tag: string,
          value: number
        }],
        titles_count_details: null | unknown
      },
      timecode: [{
        type: string,
        from: string,
        to: string
      }],
      translation_type: {
        id: number,
        label: string
      }
    }],
    season: string,
    status: {
      abbr: null | unknown,
      id: string,
      label: string
    },
    type: string
  }
}


interface AnimeEpisodesResponse {
  data: [{
    anime_id: number,
    created_at: string,
    id: number,
    item_number: number,
    name: string,
    number: string,
    number_secondary: string,
    season: string,
    status: {
      abbr: null | unknown,
      id: number,
      label: string
    },
    type: string
  }]
}


interface Timecode {
  type: 'opening' | 'ending' | 'ost' | 'compilation' | 'splashScreen',
  from: string,
  to: string
}


interface ExtensionStorage {
  config: ExtensionConfig
  teams: ExtensionTeamConfig[]
  titles: ExtensionTitleConfig[]
}

interface ExtensionConfig {
  collapsed: boolean
}

interface ExtensionTeamConfig {
  id: number
  slug: string
  slug_url: string
  name: string
  rules: ExtensionRuleConfig[]
}

interface ExtensionRuleConfig {
  id: number
  insertions: [{
    position: 'after' | 'before'
    regarding: 'start' | 'opening' | 'ending' | 'ost' | 'compilation' | 'splashScreen' | 'end'
    type: 'opening' | 'ending' | 'ost' | 'compilation' | 'splashScreen'
    duration: number
    shift: number
  }]
  overrides: [{
    origin: 'opening' | 'ending' | 'ost' | 'compilation' | 'splashScreen'
    type: 'opening' | 'ending' | 'ost' | 'compilation' | 'splashScreen'
    start: number
    end: number
  }]
  display: {
    name: string
    img: null | {
      url: string
      position_x: number
      position_y: number
    }
    gif: null | {
      url: string
      position_x: number
      position_y: number
    }
  }
}

interface ExtensionTitleConfig {
  id: number
  slug: string
  slug_url: string
  settings: {
    teams: [{
      [slug_url: string]: number[]
    }]
    fixed: [{
      timecode: {
        type: 'opening' | 'ending' | 'ost' | 'compilation' | 'splashScreen'
        from: string
        to: string
      }
    }]
  }
}