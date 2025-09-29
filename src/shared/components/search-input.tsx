import Input from 'antd/es/input';
import { SearchOutlined } from '@ant-design/icons';

type SearchInputProps = {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: number | string;
  placeholder?: string;
};

const SearchInput = ({ handleSearch, placeholder, width = 300 }: SearchInputProps) => {
  return (
    <Input
      prefix={<SearchOutlined />}
      placeholder={placeholder || 'Search...'}
      style={{ width }}
      size='large'
      onChange={handleSearch}
      allowClear
    />
  );
};

export default SearchInput;
