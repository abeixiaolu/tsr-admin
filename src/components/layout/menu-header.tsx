import { Dropdown, message, Popover } from 'antd';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import darkText from '@/assets/logo/dark-text.svg';
import icon from '@/assets/logo/icon.svg';
import text from '@/assets/logo/text.svg';
import Icon from '@/components/icon';
import { useIsMobile } from '~/hooks/is-mobile';
import { useSettingStore } from '~/stores/settings';
import { useDark } from '~/themes/hook';
import Shop from '~icons/internal/shop.svg?react';
import Ellipsis from '../ellipsis';
import HeaderBtn from './header-btn';

interface MenuHeaderProps {
  collapsed: boolean;
  isMobile: boolean;
}

interface BizItem {
  businessName: string;
  merchantId: string;
}
interface BusinessInfoProps {
  currentBiz: BizItem;
  bizList?: BizItem[];
  onSelect: (biz: BizItem) => void;
}

export default function MenuHeader({ collapsed, isMobile }: MenuHeaderProps) {
  const bizList: BizItem[] = [
    { businessName: 'Acme Corp Acme Corp', merchantId: 'M123456789' },
    { businessName: 'Globex Inc', merchantId: 'M987654321' },
    { businessName: 'Soylent Corp', merchantId: 'M456789123' },
  ];
  const [currentBiz, setCurrentBiz] = useState(bizList[0]);
  const showBusiness = useSettingStore((state) => state.settings.business);
  const { isDark } = useDark();

  const logo = (
    <div className="my-6 w-full flex items-center px-6 gap-2">
      <img src={icon} alt="Logo Icon" className="size-30px" />
      {collapsed && !isMobile ? null : <img src={isDark ? darkText : text} alt="Logo Text" className="h-18px" />}
    </div>
  );
  if (showBusiness) {
    return (
      <div className="my-6 w-full flex flex-col items-center justify-center">
        {logo}
        {collapsed && !isMobile ? (
          <CollapsedBusinessInfo bizList={bizList} currentBiz={currentBiz} onSelect={setCurrentBiz} />
        ) : (
          <BusinessInfo bizList={bizList} currentBiz={currentBiz} onSelect={setCurrentBiz} />
        )}
      </div>
    );
  }
  return logo;
}

function BusinessInfo({ bizList, currentBiz, onSelect }: BusinessInfoProps) {
  const { t } = useTranslation();
  function handleCopy() {
    const copied = copy(currentBiz?.merchantId || '');
    if (copied) {
      message.success(t('global.copied'));
    }
  }
  const menuOptions = bizList?.map((biz) => ({
    key: biz.merchantId,
    label: (
      <div>
        <div className="font-medium lh-22px">{biz.businessName}</div>
        <div className="text-assist lh-22px">
          MID:
          {biz.merchantId}
        </div>
      </div>
    ),
  }));
  const showChevron = menuOptions && menuOptions?.length > 1;
  return (
    <div className="mx-auto w-210px rounded-8px px-3 py-4 text-main shadow-[0_0_20px_0_rgba(93,106,131,0.15)]">
      <Dropdown
        menu={{
          items: menuOptions || [],
          selectedKeys: [currentBiz.merchantId],
          onClick: (e) => onSelect(bizList?.find((biz) => biz.merchantId === e.key) as BizItem),
        }}
        trigger={['click']}
      >
        <div className="h-48px flex cursor-pointer items-center gap-1 bd-normal rounded-8px px-2 text-16px font-medium lh-24px hover:bg-gray/25">
          <Icon name={Shop} className="size-5" />
          <div className="min-w-0 flex-1">
            <Ellipsis text={currentBiz?.businessName} />
          </div>
          {showChevron && <Icon name="svg-chevron-down" className="text-assist size-4" />}
        </div>
      </Dropdown>
      <div className="mt-2 text-assist lh-22px">Merchant ID</div>
      <div className="mt-2 flex items-center justify-between text-main lh-22px">
        <span>{currentBiz?.merchantId}</span>
        <button className="bg-transparent" type="button" onClick={handleCopy}>
          <Icon className="cursor-pointer hover:op-80 text-#718096 dark:text-#838383" name="i-solar-copy-linear" />
        </button>
      </div>
    </div>
  );
}

function CollapsedBusinessInfo(props: BusinessInfoProps) {
  return (
    <Popover classNames={{ container: 'p-0! shadow-none!' }} placement="rightBottom" arrow={false} content={<BusinessInfo {...props} />}>
      <HeaderBtn className="bd-normal!">
        <Icon name={Shop} className="size-5" />
      </HeaderBtn>
    </Popover>
  );
}
