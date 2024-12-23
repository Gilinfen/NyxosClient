export default function Header() {
  return (
    <div>
      <nav>
        <ul
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <li>
            <a href="/">首页</a>
          </li>
          <li>
            <a href="/login">登录</a>
          </li>
          <li>
            <a href="/pages">pages</a>
          </li>
          <li>
            <a href="/douyin">抖音</a>
          </li>
        </ul>
      </nav>
    </div>
  )
}
