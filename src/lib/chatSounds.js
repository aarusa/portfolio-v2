let context;
let unlocked = false;

function AudioContextClass() {
  return window.AudioContext || window.webkitAudioContext;
}

function getContext() {
  const Ctor = AudioContextClass();
  if (!Ctor) return null;
  if (!context) context = new Ctor();
  return context;
}

export function unlockChatSounds() {
  const ctx = getContext();
  if (!ctx || unlocked) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  unlocked = true;
}

function tone({ frequency, duration, type = "sine", volume = 0.04, delay = 0, slideTo }) {
  const ctx = getContext();
  if (!ctx || document.hidden) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const start = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (slideTo) {
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  }

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playSendSound() {
  unlockChatSounds();
  tone({ frequency: 520, slideTo: 380, duration: 0.09, type: "triangle", volume: 0.035 });
}

export function playReceiveSound() {
  unlockChatSounds();
  tone({ frequency: 620, duration: 0.07, type: "sine", volume: 0.028, delay: 0 });
  tone({ frequency: 820, duration: 0.11, type: "sine", volume: 0.022, delay: 0.07 });
}

export function playOpenSound() {
  unlockChatSounds();
  tone({ frequency: 440, slideTo: 660, duration: 0.1, type: "sine", volume: 0.02 });
}
