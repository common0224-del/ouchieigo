import assert from 'node:assert/strict';

// Keep native speech events and Web Audio timing, but disconnect their audible output.
// This also covers WebKit, which does not use Chromium's --mute-audio flag.
export async function installSilentAudio(page) {
  await page.addInitScript(() => {
    let speech=true, effects=true;
    const synthesis=window.speechSynthesis;
    if (synthesis) {
      try {
        const originalSpeak=synthesis.speak;
        synthesis.speak=function(utterance) {
          utterance.volume=0;
          return originalSpeak.call(this,utterance);
        };
        speech=synthesis.speak!==originalSpeak;
      } catch (_) { speech=false; }
    }
    if (window.AudioNode) {
      try {
        const originalConnect=AudioNode.prototype.connect;
        AudioNode.prototype.connect=function(destination,...args) {
          if(destination===this.context?.destination) return destination;
          return originalConnect.call(this,destination,...args);
        };
        effects=AudioNode.prototype.connect!==originalConnect;
      } catch (_) { effects=false; }
    }
    window.__testAudioSilence={speech,effects};
  });
}

export async function assertSilentAudio(page) {
  const status=await page.evaluate(()=>window.__testAudioSilence);
  assert(status?.speech && status?.effects,`Test audio muting was not installed: ${JSON.stringify(status)}`);
}
