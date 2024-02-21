import {
  EmphasizeElements,
  IModelConnection,
  ScreenViewport,
} from "@itwin/core-frontend";
import { ColorDef, Hilite } from "@itwin/core-common";

export function zoom(
  vp: ScreenViewport,
  selectSet: string | undefined,
  iModelConnection: IModelConnection
) {
  const color = ColorDef.from(0, 84, 159);
  const newHiliteSettings = new Hilite.Settings(color, 50);
  vp.hilite = newHiliteSettings;
  const EmphasizeElement = new EmphasizeElements();

  iModelConnection.selectionSet.emptyAll();
  iModelConnection.selectionSet.add(selectSet as string);
  zoomToRoom(vp, EmphasizeElement, selectSet).then(() => {
    zoomOut(vp);
  });
}

function zoomToRoom(
  vp: ScreenViewport,
  EmphasizeElement: EmphasizeElements,
  selectSet: string | undefined
): Promise<void> {
  return new Promise<void>((resolve) => {
    EmphasizeElement.emphasizeSelectedElements(vp);
    if (selectSet) {
      vp.zoomToElements(selectSet as string, {
        animateFrustumChange: true,
        standardViewId: 6,
        paddingPercent: 0.25,
      });
    }

    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

function zoomOut(vp: ScreenViewport) {
  vp.zoom(undefined, 5, {
    animateFrustumChange: true,
  });
}
