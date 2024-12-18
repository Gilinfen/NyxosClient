import { Input, type GetProps } from 'antd'
const { Search } = Input

type SearchProps = GetProps<typeof Input.Search>

export default function SearchInput({
  onSearch
}: {
  onSearch?: SearchProps['onSearch']
}) {
  return (
    <>
      <Search
        placeholder="输入搜索关键词"
        allowClear
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
    </>
  )
}
