import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { IconButton } from '../../button';

export interface UploadWidgetProps extends UploadProps {}

export default function UploadWidget({ children, ...props }: UploadWidgetProps) {
  return (
    <Upload classNames={{ root: '[&_.ant-upload]:w-full' }} {...props}>
      {children || (
        <IconButton icon="i-lucide-upload" block className="w-full">
          Click to Upload
        </IconButton>
      )}
    </Upload>
  );
}
