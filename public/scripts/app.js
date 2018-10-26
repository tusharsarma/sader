  const msg = new SpeechSynthesisUtterance();
  let voices = [];
  const voicesDropdown = document.querySelector('[name="voice"]');
  const options = document.querySelectorAll('[type="range"], [name="text"]');
  //const speakButton = document.querySelector('#speak');
  //const stopButton = document.querySelector('#stop');
  //msg.text = document.getElementById("speak").text();
  function populateVoices() {
      
    voices = this.getVoices();
    voicesDropdown.innerHTML = voices
      .filter(voice => voice.lang.includes('en'))
      .map(voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`)
      .join('');
  }
  function setVoice() {
    msg.voice = voices.find(voice => voice.name === this.value);
    toggle();
  }
    function setMsg(strt) {
       msg.text=strt;
       toggle();
  }
  function toggle(startOver = true) {
    
    speechSynthesis.cancel();
    if (startOver) {
      speechSynthesis.speak(msg);
    }
  }

 