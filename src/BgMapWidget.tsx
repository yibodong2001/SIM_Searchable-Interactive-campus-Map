import {
  StagePanelLocation,
  StagePanelSection,
  UiItemsProvider,
  useActiveViewport,
  Widget,
  WidgetState,
} from "@itwin/appui-react";
import {
  BackgroundMapType,
  BaseMapLayerSettings,
  ColorDef,
} from "@itwin/core-common";
import { Button } from "@itwin/itwinui-react";
import React, { FunctionComponent } from "react";

const BgMapWidget: FunctionComponent = () => {
  const viewport = useActiveViewport();

  //////////////////////
  // Component rendering
  return (
    <div>
      {viewport ? (
        <div>
          <div>
            {/*'Solid Color' button*/}
            <Button
              onClick={() => {
                viewport.view.displayStyle.backgroundMapBase = ColorDef.from(
                  0,
                  0,
                  255,
                  100
                );
              }}
            >
              Solid Color
            </Button>
          </div>

          <div>
            {/*'MapBox' button*/}
            <Button
              onClick={() => {
                viewport.view.displayStyle.changeBackgroundMapProvider({
                  name: "MapBoxProvider",
                  type: BackgroundMapType.Aerial,
                });
              }}
            >
              MapBox Aerial
            </Button>
          </div>
          <div>
            {/*'OpenStreetMap' button*/}
            <Button
              onClick={() => {
                const settings = BaseMapLayerSettings.fromJSON({
                  formatId: "TileURL",
                  url: "https://b.tile.openstreetmap.org/{level}/{column}/{row}.png",
                  name: "openstreetmap",
                });
                viewport.view.displayStyle.backgroundMapBase = settings;
              }}
            >
              OpenStreetMap
            </Button>
          </div>

          <div>
            {/*'useDepthBuffer button'*/}
            <Button
              onClick={() => {
                const value =
                  viewport.view.displayStyle.backgroundMapSettings
                    .useDepthBuffer;
                viewport.view.displayStyle.changeBackgroundMapProps({
                  useDepthBuffer: !value,
                });

                // NO - Viewport objects are immutable
                // viewport.view.displayStyle.backgroundMapSettings.applyTerrain = true;
              }}
            >
              useDepthBuffer
            </Button>
          </div>

          <div>
            {/*'Terrain button'*/}
            <Button
              onClick={() => {
                const value = viewport.view.displayStyle.displayTerrain;
                viewport.view.displayStyle.changeBackgroundMapProps({
                  applyTerrain: !value,
                });

                // Also GOOD
                // viewport.changeBackgroundMapProps({applyTerrain: !value});

                // NO - Viewport objects are immutable
                // viewport.view.displayStyle.backgroundMapSettings.applyTerrain = true;
              }}
            >
              Terrain
            </Button>
          </div>
        </div>
      ) : (
        <span>No active viewport</span>
      )}
    </div>
  );
};

export class BgMapWidgetProvider implements UiItemsProvider {
  public readonly id: string = "BackgroundMapWidgetProvider";

  public provideWidgets(
    _stageId: string,
    _stageUsage: string,
    location: StagePanelLocation,
    _section?: StagePanelSection
  ) {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push({
        id: "BgMapWidget",
        label: "Background Map",
        defaultState: WidgetState.Floating,
        content: <BgMapWidget />,
      });
    }
    return widgets;
  }
}
