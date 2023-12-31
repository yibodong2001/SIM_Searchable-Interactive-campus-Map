// events.ts
import mitt from "mitt";

// 创建事件总线
const eventBus = mitt();

export const emitClickEvent = () => {
  // 发送自定义事件
  eventBus.emit("clickEvent");
};

export const subscribeToClickEvent = (callback: () => void) => {
  // 订阅自定义事件
  eventBus.on("clickEvent", callback);
};

export const unsubscribeFromClickEvent = (callback: () => void) => {
  // 取消订阅自定义事件
  eventBus.off("clickEvent", callback);
};
