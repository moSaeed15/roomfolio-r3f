import { useApp } from '../store';
import SpeechBubble from './SpeechBubble';

const GREETINGS = [
  'Hi there! 👋',
  "I'm BMO!",
  'Nice to meet you!',
  'Click around the room :)',
  'Check out the monitor ↗',
];

const BUBBLE_POSITION: [number, number, number] = [-0.692, 1.64, 0.379];

export default function BmoBubble() {
  const { bmoGreeting } = useApp();
  if (bmoGreeting < 0) return null;
  return (
    <SpeechBubble
      key={bmoGreeting}
      message={GREETINGS[bmoGreeting % GREETINGS.length]}
      position={BUBBLE_POSITION}
    />
  );
}
