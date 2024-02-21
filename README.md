# Getting Started with the iTwin Viewer Create React App Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Environment Variables

Prior to running the app, you will need to add OIDC client configuration to the variables in the .env file:

```
# ---- Authorization Client Settings ----
IMJS_AUTH_CLIENT_CLIENT_ID=""
IMJS_AUTH_CLIENT_REDIRECT_URI=""
IMJS_AUTH_CLIENT_LOGOUT_URI=""
IMJS_AUTH_CLIENT_SCOPES =""
```

- You can generate a [test client](https://developer.bentley.com/tutorials/web-application-quick-start/#3-register-an-application) to get started.

- Scopes expected by the viewer are:

  - **Visualization**: `imodelaccess:read`
  - **iModels**: `imodels:read`
  - **Reality Data**: `realitydata:read`

- The application will use the path of the redirect URI to handle the redirection, it must simply match what is defined in your client.

- When you are ready to build a production application, [register here](https://developer.bentley.com/register/).

You should also add a valid iTwinId and iModelId for your user in the this file:

```
# ---- Test ids ----
IMJS_ITWIN_ID = ""
IMJS_IMODEL_ID = ""
```

- For the IMJS_ITWIN_ID variable, you can use the id of one of your existing iTwins. You can obtain their ids via the [iTwin REST APIs](https://developer.bentley.com/apis/itwins/operations/get-itwin/).

- For the IMJS_IMODEL_ID variable, use the id of an iModel that belongs to the iTwin that you specified in the IMJS_ITWIN_ID variable. You can obtain iModel ids via the [iModel REST APIs](https://developer.bentley.com/apis/imodels-v2/operations/get-imodel-details/).

- Alternatively, you can [generate a test iModel](https://developer.bentley.com/tutorials/web-application-quick-start/#4-create-an-imodel) to get started without an existing iModel. In this case, we upload the IFC file of the building model as an iModel.

- If at any time you wish to change the iModel that you are viewing, you can change the values of the iTwinId or iModelId query parameters in the url (i.e. localhost:3000?iTwinId=myNewITwinId&iModelId=myNewIModelId)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Replace data file

## Get the course organization data

This application is developed based on the situation at RWTH Aachen University. In case you want to upload your data. You can export the course organization data from "carpe diem!". You can find the detailed [report](SIM_project_report.pdf) here. And then replace [this](src/data/terminList_export.json) with the new data.

## Get the coordinates of all the buildings

With the exported data from "carpe diem!", you can use the code described in the [report](SIM_project_report.pdf) to get all the coordinates of all buildings by using Nominatim's APIs. And then replace [this](src/data/buildingCoordinates.tsx) with the new data.

## Update iModel Id

After uploading a model in iTwin, you will get an iModelId, please add this iModelId to [this](src/data/BuildingsIModelId.json) along with the address of this building.

## Update room id 

Each space(room) has a unique identifier which I call a room ID. You can obtain the ID through the iTwin platform -> My iTwin -> iModel -> iModel console. You can query the IDs using the command below.

Please add these room IDs to [this](src/data/RoomsModelId.json) along with the room names.




