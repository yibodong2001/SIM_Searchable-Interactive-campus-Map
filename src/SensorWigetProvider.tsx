import {
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
  Widget,
  WidgetState,
  useActiveIModelConnection,
} from "@itwin/appui-react";
import React from "react";
import { TimeSeries } from "pondjs";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  //@ts-ignore
} from "react-timeseries-charts";
import { category } from "@itwin/appui-layout-react/lib/cjs/appui-layout-react/state/internal/NineZoneStateHelpers";
import { CategoryVisibilityHandler } from "@itwin/tree-widget-react";
//import { category } from "@itwin/appui-layout-react/lib/cjs/appui-layout-react/state/internal/NineZoneStateHelpers";

export function SensorWidget() {
  const [elementName, setElementName] = React.useState<string>("");
  const [elementId, setElementId] = React.useState<string>("");
  const [elementCategoy, setElementCategory] = React.useState<string>("");

  const iModelConnection = useActiveIModelConnection(); //geting connection to what happens in the model

  React.useEffect(() => {
    iModelConnection?.selectionSet.onChanged.addListener((event) => {
      event.set.elements.forEach((element) => {
        iModelConnection?.elements.getProps(element).then((props) => {
          if (props[0].userLabel && props[0].id) {
            setElementName(props[0].userLabel);
            setElementId(props[0].id);
          }
        });
      });
    });
  }, []);
  return (
    <div>
      <div>Element Name: {elementName}</div>
      <div>Element Id: {elementId}</div>
    </div>
  );
}

export class SensorWigetProvider implements UiItemsProvider {
  //export为了能从其他文件中访问
  public readonly id: string = "SensorWigetProvider";
  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "Sensor",
        label: "Sensor Data",
        defaultState: WidgetState.Open,
        content: <SensorWidget />,
      });
    }
    return widgets;
  }
}
