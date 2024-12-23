export {}

declare global {
  interface Window {
    AlphaVideo: any
    TAURI_DBS: {
      douyin: Database
    }
    DOUYIN_API: {
      get__ac_signature: (__ac_nonce: string) => string
      generate_a_bogus: (params: string, ua: string) => string
    }
    // 抖音官方签名
    byted_acrawler: {
      frontierSign: (params: { 'X-MS-STUB': string }) => { 'X-Bogus': string }
    }
  }
}
