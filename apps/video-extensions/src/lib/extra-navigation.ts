import { updateVideos } from "./update-videos";

const shortsKeywords = ['short'];

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isInShortsMode() {
    return shortsKeywords.some(s => {
        return window.location.href.includes(s);
    })
}

function stop(e: KeyboardEvent) {
    e.stopPropagation();
    e.stopImmediatePropagation();
}

const keys = {
    videoWrapper: '.ytLockupViewModelWrapper',
    moreButtonInsideWrapper: 'button',
    moreMenu: '.ytListViewModelHost',
    addToQueueButtonInsideMoreMenu: '.ytListItemViewModelHost'
}
export async function extraNavigation(e: KeyboardEvent) {
    // shorts controls
    if (isInShortsMode()) {
        if (e.key == 'ArrowLeft') {
            updateVideos(v => {
                if (v.currentTime > 1) {
                    v.currentTime -= 1
                } else {
                    v.currentTime = v.duration - 1;
                }
            });
        }
        if (e.key == 'ArrowRight') {
            updateVideos(v => {
                if (v.currentTime + 1 < v.duration) {
                    v.currentTime += 1
                } else {
                    v.currentTime = 0;
                }
            });
        }
        if (e.key == '0') {
            updateVideos(v => v.currentTime = 0);
        }
    }

    // add to queue controls
    if (e.key == 'a') {
        const videoWrapper = document.querySelector(keys.videoWrapper + ':hover');
        const moreButton = videoWrapper?.querySelector(keys.moreButtonInsideWrapper) as HTMLElement;
        moreButton?.click();
        await delay(100);
        const moreMenu = document.querySelector(keys.moreMenu);
        const addToQueueButton = moreMenu?.querySelector(keys.addToQueueButtonInsideMoreMenu) as HTMLElement;
        addToQueueButton?.click();

        if (!videoWrapper || !moreButton || !moreMenu || !addToQueueButton) {
            console.warn('Could not find all elements for add to queue shortcut');
        }
    }
}