import Speech from 'speak-tts';

const speech = new Speech();

if(speech.hasBrowserSupport())
{
    speech.init({'volume': 1,
            'lang': 'en-IN',
            'rate': 1,
            'pitch': 1,
            'voice':'Google UK English Female',
            'splitSentences': true,

            }).then((data) => {
        // The "data" object contains the list of available voices and the voice synthesis params
        console.log("Speech is ready, voices are available", data)
    }).catch(e => {
        console.error("An error occured while initializing : ", e)
    })
}

export function Speak(sp) {

  if(speech.hasBrowserSupport())
  {
  speech.speak({
    text: sp,
    queue: false
    }).then(() => {
    }).catch(e => {
        console.error("An error occurred :", e)
    })
  };
}
