import type { InputProps } from 'antd';
import { Input } from 'antd';

export interface InputWidgetProps extends InputProps {}

export default function InputWidget(props: InputWidgetProps) {
  if (props.type === 'password') {
    return <Input.Password {...props} />;
  }
  return <Input {...props} />;
}
