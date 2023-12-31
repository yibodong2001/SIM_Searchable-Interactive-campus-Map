/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import "./App.scss";
import { RoomsProvider } from "./Rooms";
import { currentIModelId, BuildingsProvider } from "./Building";
import {
  IModelConnection,
  ScreenViewport,
  Viewport,
} from "@itwin/core-frontend";
import { FitViewTool, IModelApp, StandardViewId } from "@itwin/core-frontend";
import { FillCentered } from "@itwin/core-react";
import { ProgressLinear } from "@itwin/itwinui-react";
import {
  MeasurementActionToolbar,
  MeasureTools,
  MeasureToolsUiItemsProvider,
} from "@itwin/measure-tools-react";
import { PropertyGridManager } from "@itwin/property-grid-react";
import { TreeWidget } from "@itwin/tree-widget-react";
import {
  useAccessToken,
  Viewer,
  ViewerContentToolsProvider,
  ViewerNavigationToolsProvider,
  ViewerPerformance,
  ViewerStatusbarItemsProvider,
} from "@itwin/web-viewer-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Auth } from "./Auth";
import { history } from "./history";
import { subscribeToClickEvent, unsubscribeFromClickEvent } from "./events";
import { imageElementFromUrl } from "@itwin/core-frontend";
import { BuildingDecorator } from "./Decorator";
import BuildingsCoordinates from "./data/BuildingsCoordinates.json";
import { BaseMapLayerSettings } from "@itwin/core-common";

const App: React.FC = () => {
  const [iModelId, setIModelId] = useState(process.env.IMJS_IMODEL_ID);
  const [iTwinId, setITwinId] = useState(process.env.IMJS_ITWIN_ID);
  const [changesetId, setChangesetId] = useState(
    process.env.IMJS_AUTH_CLIENT_CHANGESET_ID
  );
  const accessToken = useAccessToken();
  const authClient = Auth.getClient();
  const login = useCallback(async () => {
    try {
      await authClient.signInSilent();
    } catch {
      await authClient.signIn();
    }
  }, [authClient]);
  useEffect(() => {
    void login();
  }, [login]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("iTwinId")) {
      setITwinId(urlParams.get("iTwinId") as string);
    }
    if (urlParams.has("iModelId")) {
      setIModelId(urlParams.get("iModelId") as string);
    }
    if (urlParams.has("changesetId")) {
      setChangesetId(urlParams.get("changesetId") as string);
    }
  }, []);

  useEffect(() => {
    const changeIModel = () => {
      // setIfBlank(true);
      setIModelId(currentIModelId);
    };
    // console.log(ifBlank);
    subscribeToClickEvent(changeIModel);
    return () => {
      unsubscribeFromClickEvent(changeIModel);
    };
  }, []);

  useEffect(() => {
    let url = `viewer?iTwinId=${iTwinId}`;

    if (iModelId) {
      url = `${url}&iModelId=${iModelId}`;
    }

    if (changesetId) {
      url = `${url}&changesetId=${changesetId}`;
    }
    history.push(url);
  }, [iTwinId, iModelId, changesetId]);

  /** NOTE: This function will execute the "Fit View" tool after the iModel is loaded into the Viewer.
   * This will provide an "optimal" view of the model. However, it will override any default views that are
   * stored in the iModel. Delete this function and the prop that it is passed to if you prefer
   * to honor default views when they are present instead (the Viewer will still apply a similar function to iModels that do not have a default view).
   */
  const viewConfiguration = useCallback((viewPort: ScreenViewport) => {
    // default execute the fitview tool and use the iso standard view after tile trees are loaded
    const tileTreesLoaded = () => {
      return new Promise((resolve, reject) => {
        const start = new Date();
        const intvl = setInterval(() => {
          if (viewPort.areAllTileTreesLoaded) {
            ViewerPerformance.addMark("TilesLoaded");
            ViewerPerformance.addMeasure(
              "TileTreesLoaded",
              "ViewerStarting",
              "TilesLoaded"
            );
            clearInterval(intvl);
            resolve(true);
          }
          const now = new Date();
          // after 20 seconds, stop waiting and fit the view
          if (now.getTime() - start.getTime() > 20000) {
            reject();
          }
        }, 100);
      });
    };
    const settings = BaseMapLayerSettings.fromJSON({
      formatId: "TileURL",
      url: "https://b.tile.openstreetmap.org/{level}/{column}/{row}.png",
      name: "openstreetmap",
    });

    viewPort.view.displayStyle.backgroundMapBase = settings;

    tileTreesLoaded().finally(() => {
      void IModelApp.tools.run(FitViewTool.toolId, viewPort, true, false);
      viewPort.view.setStandardRotation(StandardViewId.Top);
    });
  }, []);

  const viewCreatorOptions = useMemo(
    () => ({ viewportConfigurer: viewConfiguration }),
    [viewConfiguration]
  );

  const onIModelAppInit = useCallback(async () => {
    // iModel now initialized
    await TreeWidget.initialize();
    await PropertyGridManager.initialize();
    await MeasureTools.startup();

    MeasurementActionToolbar.setDefaultActionProvider();
  }, []);

  const markerImagePromise = imageElementFromUrl(
    "https://upload.wikimedia.org/wikipedia/commons/e/ed/Map_pin_icon.svg"
  );

  const onIModelConnected = async (iModel: IModelConnection) => {
    const buildingdecorator = new BuildingDecorator(
      BuildingsCoordinates,
      iModel.ecefLocation!.cartographicOrigin!.latitudeDegrees,
      iModel.ecefLocation!.cartographicOrigin!.longitudeDegrees,
      await markerImagePromise
    );
    console.log(iModel.ecefLocation!.cartographicOrigin!.latitudeDegrees);
    console.log(iModel.ecefLocation!.cartographicOrigin!.longitudeDegrees);
    IModelApp.viewManager.decorators.pop();
    IModelApp.viewManager.addDecorator(buildingdecorator);
  };

  return (
    <div className="viewer-container">
      {!accessToken && (
        <FillCentered>
          <div className="signin-content">
            <ProgressLinear indeterminate={true} labels={["Signing in..."]} />
          </div>
        </FillCentered>
      )}

      <Viewer
        iTwinId={iTwinId ?? ""}
        iModelId={iModelId ?? ""}
        changeSetId={changesetId}
        authClient={authClient}
        viewCreatorOptions={viewCreatorOptions}
        enablePerformanceMonitors={true} // see description in the README (https://www.npmjs.com/package/@itwin/web-viewer-react)
        onIModelAppInit={onIModelAppInit}
        onIModelConnected={onIModelConnected}
        uiProviders={[
          new RoomsProvider(),
          new BuildingsProvider(),
          new ViewerNavigationToolsProvider(),
          new ViewerContentToolsProvider({
            vertical: {
              measureGroup: false,
            },
          }),
          new ViewerStatusbarItemsProvider(),

          new MeasureToolsUiItemsProvider(),
        ]}
      ></Viewer>
    </div>
  );
};

export default App;
