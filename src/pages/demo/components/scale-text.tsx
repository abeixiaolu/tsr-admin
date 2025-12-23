import ScaleText from '@/components/common/scale-text';

export default function ScaleTextDemo() {
  return (
    <div className="resize-x max-w-400px of-hidden bd-normal p-2 font-palm">
      <ScaleText baseFontSize={48}>{Number(12007800000).toLocaleString()}</ScaleText>
    </div>
  );
}
