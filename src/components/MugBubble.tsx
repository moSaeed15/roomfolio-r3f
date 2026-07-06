import { useApp } from '../store';
import SpeechBubble from './SpeechBubble';

const QUIPS = [
  'Fuel ☕',
  'Still warm... probably.',
  'Powered by caffeine.',
  'One more cup, one more feature.',
];

const BUBBLE_POSITION: [number, number, number] = [-0.496, 1.46, 0.375];

export default function MugBubble() {
  const { mugQuip } = useApp();
  if (mugQuip < 0) return null;
  return (
    <SpeechBubble
      key={mugQuip}
      message={QUIPS[mugQuip % QUIPS.length]}
      position={BUBBLE_POSITION}
    />
  );
}
