## Before you start
The created application is called "CSA" and stands for Continuous software architecting and is only a prototype with basic functionality and definitely not production ready.

## Structure info:
CSA provides the only the Middelware and Frontend of the total application. The application is created with Typescript and NodeJS (Middelware), and javascript (Frontend). Draw2D is used for the modelling itself and provides model elements, connections(edges) and ports(to which an edge is connected). Draw2D is canvas based, maintains a history of all changes applied to the canvas. Draw2D is distributed with the GPL2 license. 
The backend of the application is created by other developers and can be found here: https://github.com/uu-cubitt and is composed of multiple node modules. The backend is built on top of a CQRS architecture which imposed requirements on the CSA application.

## Application startup
  Startup the application by following https://cubitt.readme.io/docs/installation.  After the vertx cluster is started create a project in which the models are stored by clicking the "Start handlers button". By creating a project the query and command handlers are started. When restarting the vertx cluster at a later point in time you need to restart the handlers again (see https://github.com/sacapita/csa/issues/1). After the project is created sample models can be added by clicking the "Add models" button.

## Add new model elements
  <div data-shape="csa.ModuleShape" class="palette_node_element draw2d_droppable FAM_module" id="DRAW2D_MODEL_FAM">module</div>
  The id attribute contains the model name to which this element belong.
  When this element is dragged to the canvas, this name is read and the element is added to the userData: {shapeType: "DRAW2D_MODEL_FAM"}.
  userData is a property provided by Draw2D and is used by CSA to know to which model the element belongs.
  To add a new element to an existing model copy the above div tag and change the name (and optioanlly the data-shape attribute) and keep the id attribute the same (see https://github.com/sacapita/csa/issues/2)
  In case a new data-shape is required you also need to create a new definition for that shape in dist/client/app, see ModuleShape.js for an example.

======

## Features:
- DONE - unmarchal/marchal/D2DGraph meerdere modellen ondersteunen 
- DONE - graph met daarin models versturen naar backend
- DONE - inter-model connections/edges (worden deze op in een model opgeslagen, de backend ondersteund geen edges op graph niveau.)
- DONE - separate Canvas/View for every thumbnail to show the previes with element of that modelType only
- DONE - GET project or models from the backend and unmarchallen to canvas (deserialize)
- DONE - incremental update to backend, track elements that changed and what properties changed. The backend expectes incremental updates
- PARTIALLY DONE - drag model thumbnail to the canvas to display it there.
- TODO - update to new versions of cubitt packages (commands, common and graph?)
