#! /usr/bin/node
const {spawn} = require('child_process');
const colors = require('./colorMix');
require('draftlog').into(console)

const POMODORE_COUNT = process.argv[2];
const POMODORE_TIME = 1.5e+6; // 25 minutes in milliseconds
const INTERVAL_TIME = 300000; // 5 minutes in milliseconds
// const POMODORE_TIME = 1000;
// const INTERVAL_TIME = 2000;

function millisToMinutesAndSeconds(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

async function waitFor(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function finishOnePomodore({ pomodoreCount, log, message }) {
  return async () =>{
    spawn(
      'espeak', 
      ['-a', '120', '-p', '0', '-s', '310', 'Finished pomodore!'], 
      {
        stdio: 'pipe',
      }
    );
  
    log(colors.logMessages(`Finished ${pomodoreCount}!`));
  
    message(`Waiting for ${colors.displayTime(millisToMinutesAndSeconds(INTERVAL_TIME))} to start a new one.`);
  
    await waitFor(INTERVAL_TIME);
  }
}

console.log(`${colors.welcome('Starting the Pomodore timer')} ${colors.tomatoe('🍅')} ${colors.clock('⏰')}!`);
if(POMODORE_COUNT) {
  if(POMODORE_COUNT === 'help') {
    console.log(`Usage: pomodore [count] -> Where count will be the number of pomodores you will count!`);
    console.log(`Usage: pomodore help -> Print this usage and exit`);
    process.exit(0);
  }

  if(Number.isInteger(Number(POMODORE_COUNT)) && POMODORE_COUNT > 0) {
    console.log(`This time, we will run ${colors.pomodores(Number(POMODORE_COUNT))} pomodore(s) 
                of ${colors.displayTime(millisToMinutesAndSeconds(POMODORE_TIME))} minute(s) each!`);
  
    for(let i = 1; i <= Number(POMODORE_COUNT); i++) {
      const log = console.draft();
      const message = console.draft();

      setTimeout(finishOnePomodore({
        pomodoreCount: i,
        message,
        log,
      }), (POMODORE_TIME * i));
    } 
  }
} else {
  console.log('[FATAL] Cannot start Pomodore counter without a count parameter!(See `pomodore help` to see the usage)');
}
