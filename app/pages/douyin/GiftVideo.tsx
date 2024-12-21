import { Flex } from 'antd'
import { useEffect } from 'react'
import { fetchAndExtractZipAsBase64 } from '~/utils'

export default function GiftVideo() {
  const geturl = async (zipurl: string) => {
    const urls = await fetchAndExtractZipAsBase64(zipurl)
    const headMv = new window.AlphaVideo({
      src: urls[0],
      width: 720,
      height: 1280,
      loop: true, // 是否循环播放
      canvas: document.getElementById('douyin_gift_video_canvas')
    })
    headMv.play()
  }

  useEffect(() => {
    if (window) {
      geturl(
        'https://sf1-cdn-tos.huoshanstatic.com/obj/webcast/d8b9306bc3631c48060e9d1d68e8fea3.zip'
      )
    }
  }, [])

  return (
    <>
      <Flex className=" z-[100] absolute bottom-[-21%] left-0 top-0 right-0 ">
        <canvas id="douyin_gift_video_canvas" className=" w-full " />
      </Flex>
    </>
  )
}
