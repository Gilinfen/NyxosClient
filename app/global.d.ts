export {};

declare global {
  interface Window {
    // 抖音官方签名
    byted_acrawler: {
      frontierSign: (params: { "X-MS-STUB": string }) => { "X-Bogus": string };
    };
  }
}
