import { createEffect, createSignal, onCleanup } from 'solid-js'
import './App.css'

function getVideos(): HTMLVideoElement[] {
    return Array.from(document.querySelectorAll('video'));
}

function updateVideoSpeed(videos: HTMLVideoElement[], speed: number) {
    if (speed < 0.25) {
        return;
    }

    videos.forEach(v => {
        v.playbackRate = speed;
    })
}

const lsKey = 'VideoExtensions_Speed';
function App() {
    const defaultSpeed = parseFloat(localStorage.getItem(lsKey) || '') || 2;
    const [speed, setSpeed] = createSignal(defaultSpeed); // todo: read from local storage
    const [opacity, setOpacity] = createSignal(1);
    const [videos, setVideos] = createSignal<HTMLVideoElement[]>([]);

    var videoElementRefreshIntervalId = setInterval(() => {
        setVideos(getVideos());
    }, 1000)

    createEffect(() => {
        localStorage.setItem(lsKey, speed().toString());
    })
    createEffect(() => {
        updateVideoSpeed(videos(), speed());
    })

    var opacityLoweringIntervalId: number;
    var opacityLoweringTimeoutId: number;
    function handleOpacity() {
        clearInterval(opacityLoweringIntervalId);
        clearTimeout(opacityLoweringTimeoutId);

        setOpacity(1);

        opacityLoweringTimeoutId = setTimeout(() => {
            opacityLoweringIntervalId = setInterval(() => {
                if (opacity() > 0) {
                    setOpacity(o => o -= 0.05);
                } else {
                    clearInterval(opacityLoweringIntervalId);
                }
            }, 50);
        }, 1000);
    }

    function updateSpeed(delta: number) {
        setSpeed(s => s + delta)
        handleOpacity();
    }

    function handleInput(event: KeyboardEvent) {
        if (event.key == '+') {
            updateSpeed(0.25);
        }
        else if (event.key == '-') {
            updateSpeed(-0.25);
        }
    }

    document.addEventListener('keydown', handleInput);
    handleOpacity(); // Call once too bootstart the opacity lowering

    onCleanup(() => {
        clearInterval(videoElementRefreshIntervalId);
        document.removeEventListener('keydown', handleInput);

        clearInterval(opacityLoweringIntervalId);
        clearTimeout(opacityLoweringTimeoutId);
    })

    return (
        <div class="arsd-ve-speedometer" style={{ opacity: opacity() }}>
            Speed: {speed()}
        </div>
    )
}

export default App
