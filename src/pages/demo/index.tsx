import { useState } from 'react';
import { VerticalTabs } from '@/components/common/tabs';
import ButtonDemo from './components/button';
import SchemaFormDemo from './components/form';
import OverflowMarqueeDemo from './components/overflow-marquee';
import ProTableDemo from './components/table';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('button');
  const tabs = [
    {
      label: 'Button',
      value: 'button',
      icon: 'i-solar-lightbulb-bolt-line-duotone',
      component: <ButtonDemo />,
    },
    {
      label: 'Overflow Marquee',
      value: 'overflow-marquee',
      icon: 'i-solar-notification-unread-broken',
      component: <OverflowMarqueeDemo />,
    },
    {
      label: 'Table',
      value: 'table',
      icon: 'i-solar-bedside-table-2-broken',
      component: <ProTableDemo />,
    },
    {
      label: 'Form',
      value: 'form',
      icon: 'i-solar-notebook-broken',
      component: <SchemaFormDemo />,
    },
  ];
  return (
    <div className="bg-container min-h-full rounded-16px p-6 flex flex-col md:flex-row gap-6">
      <VerticalTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs}></VerticalTabs>
      <div className="bg-container flex-1 min-w-0">{tabs.find((tab) => tab.value === activeTab)?.component}</div>
    </div>
  );
}
