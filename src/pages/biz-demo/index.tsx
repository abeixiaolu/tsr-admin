import { useState } from 'react';
import { VerticalTabs } from '@/components/common/tabs';
import EmailVerificationDemo from './components/email-verification';
import ResultModalDemo from './components/result-modal';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('result-modal');
  const tabs = [
    {
      label: 'Result Modal',
      value: 'result-modal',
      icon: 'i-solar-check-circle-broken',
      component: <ResultModalDemo />,
    },
    {
      label: 'Email Verification',
      value: 'email-verification',
      icon: 'i-solar-mailbox-broken',
      component: <EmailVerificationDemo />,
    },
  ];
  return (
    <div className="bg-container min-h-full rounded-16px p-6 flex flex-col md:flex-row gap-6">
      <VerticalTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs}></VerticalTabs>
      <div className="bg-container flex-1 min-w-0">{tabs.find((tab) => tab.value === activeTab)?.component}</div>
    </div>
  );
}
