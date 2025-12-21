import EmailIcon from '@icons/internal/email.svg?react';
import ServiceIcon from '@icons/internal/service.svg?react';
import { Popover } from 'antd';
import Icon from '@/components/common/icon';
import HeaderBtn from './header-btn';

export default function CustomerService() {
  return (
    <Popover
      classNames={{ container: 'p-0!' }}
      content={
        <div className="lh-22px">
          <div className="bd-normal-b p-4 font-medium">Customer Service</div>
          <div>
            <div className="flex gap-4 px-4 py-2">
              <div className="text-assist fcc">
                <Icon className="size-6" name={EmailIcon} />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Contact Email</span>
                <span className="text-assist">customer-service@oneloop.link</span>
              </div>
            </div>
          </div>
        </div>
      }
      arrow={false}
    >
      <HeaderBtn>
        <Icon name={ServiceIcon} />
      </HeaderBtn>
    </Popover>
  );
}
