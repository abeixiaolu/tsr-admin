import { Button } from 'antd';
import { useState } from 'react';
import ResultModal from '@/components/biz/result-modal';

export default function ResultModalDemo() {
  const [openResultModal, setOpenResultModal] = useState(false);
  const [openFailureModal, setOpenFailureModal] = useState(false);
  return (
    <div className="flex gap-4">
      <Button onClick={() => setOpenResultModal(true)}>Open Success Modal</Button>
      <Button onClick={() => setOpenFailureModal(true)}>Open Failure Modal</Button>
      <ResultModal
        open={openResultModal}
        onOk={() => {
          setOpenResultModal(false);
        }}
      ></ResultModal>
      <ResultModal
        open={openFailureModal}
        onOk={() => {
          setOpenFailureModal(false);
        }}
        isSuccess={false}
        reason="Test Reason"
      ></ResultModal>
    </div>
  );
}
