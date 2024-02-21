import mitt from "mitt";

const eventBus = mitt();

export const emitClickEvent = () => {
  eventBus.emit("clickEvent1");
};

export const subscribeToClickEvent = (callback: () => void) => {
  eventBus.on("clickEvent1", callback);
};

export const unsubscribeFromClickEvent = (callback: () => void) => {
  eventBus.off("clickEvent1", callback);
};

export const emitClickEvent2 = () => {
  eventBus.emit("clickEvent2");
};

export const subscribeToClickEvent2 = (callback: () => void) => {
  eventBus.on("clickEvent2", callback);
};

export const unsubscribeFromClickEvent2 = (callback: () => void) => {
  eventBus.off("clickEvent2", callback);
};

export const emitClickEvent3 = () => {
  eventBus.emit("clickEvent3");
};

export const subscribeToClickEvent3 = (callback: () => void) => {
  eventBus.on("clickEvent3", callback);
};

export const unsubscribeFromClickEvent3 = (callback: () => void) => {
  eventBus.off("clickEvent3", callback);
};

export const emitClickEvent4 = () => {
  eventBus.emit("clickEvent4");
};

export const subscribeToClickEvent4 = (callback: () => void) => {
  eventBus.on("clickEvent4", callback);
};

export const unsubscribeFromClickEvent4 = (callback: () => void) => {
  eventBus.off("clickEvent4", callback);
};
export const emitClickEvent5 = () => {
  eventBus.emit("clickEvent4");
};

export const subscribeToClickEvent5 = (callback: () => void) => {
  eventBus.on("clickEvent4", callback);
};

export const unsubscribeFromClickEvent5 = (callback: () => void) => {
  eventBus.off("clickEvent4", callback);
};

export const emitClickEvent6 = () => {
  eventBus.emit("clickEvent4");
};
