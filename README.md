# csa
Continuous Software Architecting

issues:
- Draw2D must generate RFC4122 V4 compliant UUIDs, the function of Draw2D is overridden to accomplish this.
- modelId is passed from the server to the client and vice versa, this ID can be modified by the client.
- GUIDs are assigned to elements after adding them to the canvas (done by Draw2D UUID method), there can be duplicates and will result in error when converting the json model to a Graph model object!
- the nodes must precede the connections in order to create the Graph object correctly (the connectors of the node are queried to get the ID of that element, the name GUID is not unique)
- a connector can either be an input or output port (issue of Draw2D)
- assign a source model to a newly created edge, this is done by looking at the source connector and then the name of the model of the parent source node. The problem is that different connectors point to a different parent object (for example to the Label of the node, and others to the node itself which is the correct one.)

FEATURES:
- DONE - unmarchal/marchal/D2DGraph meerdere modellen ondersteunen 
- DONE - graph met daarin models versturen naar backend
- DONE - inter-model connections/edges (worden deze op in een model opgeslagen, de backend ondersteund geen edges op graph niveau.)
- DONE - separate Canvas/View for every thumbnail to show the previes with element of that modelType only
- TODO - GET project or models from the backend and unmarchallen to canvas (deserialize)
- TODO - incremental update to backend, track elements that changed and what properties changed. The backend expectes incremental updates
- TODO - update to new versions of cubitt packages (commands, common en graph?)
