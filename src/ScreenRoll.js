import MapsJSON from './mapsStructure.json';
import { Random } from 'random';

export function ScreenRoll() {
    const seed = new Date().toISOString().slice(0, 10); 
    const rng = new Random(seed);

    const maps = MapsJSON.Maps;
    let totalScreens = 0;

    maps.forEach(map => {
        map.Areas.forEach(area => {
            totalScreens += area.Screens.length;
        });
    });

    const randomIndex = Math.floor(rng.float() * totalScreens);
    
    let currentIndex = 0;
    for (let mapIndex = 0; mapIndex < maps.length; mapIndex++) {
        const map = maps[mapIndex];
        for (const area of map.Areas) {
            const screensCount = area.Screens.length;
            if (currentIndex + screensCount > randomIndex) {
                const screenIndex = randomIndex - currentIndex;
                const screenName = area.Screens[screenIndex];
                
                //DELETE "Jumple/" FOR DEPLOYMENT FOR WHATEVER THE FUCK REASON
                const screenPath = `Jumple/Maps/${map.MapName}/${area.AreaName.replace(/'/g, '%27')}/${screenName}`;
                
                return {
                    mapName: map.MapName,
                    mapIndex: mapIndex,
                    areaName: area.AreaName,
                    screenName: screenName,
                    screenNumber: screenIndex + 1,
                    screenPath: screenPath
                };
            }
            currentIndex += screensCount;
        }
    }
}