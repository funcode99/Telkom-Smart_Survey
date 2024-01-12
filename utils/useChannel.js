export let channel = null;
export const setChannel = (instance) => {
    channel = instance;
};
export let subscribe = (event, callback) => {
    if (!channel) return
    const eventList = {}

    if (!eventList.event) {
        console.log("bind event", event);
        eventList.event = channel.bind(event, (data) => callback(data))
    }
}