import { loadScript } from '~/utils'
import { makeRequest } from '~/utils/request'
import __ac_signature_url from '~/assets/douyin/__ac_signature?url'

export class DouyinCookieApi {
  public static async get__ac_nonce(): Promise<string> {
    const val = await makeRequest<any[]>('https://www.douyin.com/', 'GET', {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      priority: 'u=0, i',
      purpose: 'prefetch',
      'sec-ch-ua':
        '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'sec-purpose': 'prefetch;prerender',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    })

    const __ac_nonce = val[1][0].split('=')[1].split(';')[0]
    return __ac_nonce
  }

  public static async get__ac_signature(__ac_nonce: string): Promise<string> {
    let __ac_signature = ''
    const remjs = await loadScript(__ac_signature_url, async () => {
      __ac_signature = window.DOUYIN_API.get__ac_signature(__ac_nonce)
      // @ts-ignore
      window.byted_acrawler = null
    })
    remjs()
    return __ac_signature
  }

  public static async getTtwid(): Promise<string> {
    const __ac_nonce = await this.get__ac_nonce()
    const __ac_signature = await this.get__ac_signature(__ac_nonce)
    const __ac_referer = 'https://www.douyin.com/'
    const ttwidget = await makeRequest<any[]>(
      'https://www.douyin.com/',
      'GET',
      {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cache-control': 'no-cache',
        cookie: `__ac_nonce=${__ac_nonce}; __ac_signature=${__ac_signature}; __ac_referer=${__ac_referer}`,
        pragma: 'no-cache',
        priority: 'u=0, i',
        referer: 'https://www.douyin.com/',
        'sec-ch-ua':
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'upgrade-insecure-requests': '1',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    )

    const ttwid = ttwidget[1][0].split('=')[1].split(';')[0]

    return ttwid
  }
}
