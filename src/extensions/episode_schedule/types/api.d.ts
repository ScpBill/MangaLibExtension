declare interface AnimeSchedule {
  data: {
    id: number,
    name: string,
    rus_name: string,
    eng_name: string,
    slug: string,
    slug_url: string,
    cover: {
      filename: null | string,
      thumbnail: string,
      default: string
    },
    ageRestriction: {
      id: number,
      label: string
    },
    site: 5,
    type: {
      id: null | number,
      string: null | string
    },
    is_licensed: boolean,
    model: 'anime',
    status: {
      id: null | number,
      label: null |  string
    },
    episodes_schedule: [{
      number: string,
      airing_at: string
    }],
    releaseDateString: string,
    shikimori_href: string,
    shiki_rate: number
  },
  meta: {
    country: null | string
  }
}
