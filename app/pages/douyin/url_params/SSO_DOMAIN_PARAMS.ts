export namespace SSO_DOMAIN_PARAMS {
  type CommonUrlParams = {
    service: string
    need_logo: boolean
    need_short_url: boolean
    passport_jssdk_version: string
    passport_jssdk_type: string
    aid: number
    language: string
    account_sdk_source: string
    account_sdk_source_info: string
    passport_ztsdk: string
    passport_verify: string
    request_host: string
    biz_trace_id: string
    device_platform: string
    msToken: string
    a_bogus: string
  }

  /** SSO登录获取二维码 参数 */
  export type SSO_LOGIN_GET_QR = CommonUrlParams

  /** 登录检查 参数 */
  export type SSO_LOGIN_CHECK_QR = CommonUrlParams & {
    token: string
    is_frontier: boolean
  }
}
