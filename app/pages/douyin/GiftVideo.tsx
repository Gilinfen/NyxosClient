import { Flex } from 'antd'
import { useEffect, useState } from 'react'
import { fetchAndExtractZipAsBase64 } from '~/utils'
import { v4 } from 'uuid'

export default function GiftVideo() {
  const [canvasId] = useState(v4())
  const geturl = async (zipurl: string) => {
    const urls = await fetchAndExtractZipAsBase64(zipurl)
    const headMv = new window.AlphaVideo({
      src: urls[0],
      width: 720,
      height: 1280,
      loop: true, // 是否循环播放
      canvas: document.getElementById(canvasId)
    })
    headMv.play()
  }

  useEffect(() => {
    if (window) {
      geturl(
        // 'https://sf1-cdn-tos.huoshanstatic.com/obj/webcast/d8b9306bc3631c48060e9d1d68e8fea3.zip'
        // 'https://sf1-cdn-tos.huoshanstatic.com/obj/webcast/9316e077e9d1a6d3136f44e90e6d6a30.zip'
        'https://sf1-cdn-tos.huoshanstatic.com/obj/webcast/cd04e008ea414206c5b77af458024393.zip'
        // 'https://sf1-cdn-tos.huoshanstatic.com/obj/webcast/b4b20990287183c57d0c05cd50d37eb3.zip'
        // 'https://sf1-cdn-tos.huoshanstatic.com/obj/webcast/f5238b9065736b1bf467d18008b7932d.zip'
        // 'https://sf1-cdn-tos.huoshanstatic.com/obj/webcast/fb22013f71f7043c32dcce9336654259.zip'
      )
    }
  }, [])

  return (
    <>
      <Flex className=" z-[14] absolute bottom-[0] left-0 top-0 right-0 ">
        <canvas id={canvasId} className=" w-full " />
      </Flex>
    </>
  )
}
