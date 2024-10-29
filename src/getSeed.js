export async function getSeed() {
    const response = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=UTC");
    const data = await response.json();
    return data.dateTime.slice(0, 10); 
}