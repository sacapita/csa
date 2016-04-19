# csa
Continuous Software Architecting

issues:
- Draw2D must generate RFC4122 V4 compliant UUIDs, the function of Draw2D is overridden to accomplish this.
- modelId wordt steeds doorgegeven van server naar client en omgedraaid, deze kan aangepast worden door de client.
- guids worden bij het toevoegen op het canvas door Draw2D gegenereerd, als er een duplicate bij zit wordt dit pas een probleem bij conversion van json model to Graph model object, wordt nog niet afgehandeld!
- the nodes must precede the connections in order to create the Graph object correctly (the connectors of the node are queried to get the ID of that element, the name GUID is not unique)

TODO:
- unmarchal/marchal/D2DGraph meerdere modellen ondersteunen 
- graph met daarin models versturen naar backend
- inter-model connections/edges (worden deze op in een model opgeslagen, de backend ondersteund geen edges op graph niveau.)
- json object inlezen van de backend en unmarchallen op de canvas
- aparte Canvas/View maken voor elke thumbnail om preview weer te geven met alleen de elementen van die viewpoint
