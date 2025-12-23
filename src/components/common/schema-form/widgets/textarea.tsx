import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input';

export interface TextareaWidgetProps extends TextAreaProps {}

export default function TextareaWidget(props: TextareaWidgetProps) {
  return <Input.TextArea {...props} />;
}
