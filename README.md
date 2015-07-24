# obj-parser

This is a NodeJS module that takes OBJ and MTL files (output from Maya, Blender
,etc.) and serializes the data to a JSON file.

Example:
```javascript
var parser = require("obj-json-parser");
var fs = require("fs");

var obj = fs.readFileSync("./test.obj");
var mtl = fs.readFileSync("./test.mtl");

var data = parser(obj, mtl);
```

The JSON file has the following schema:
```json
{
  "vertices":      [...],
  "normals":       [...],
  "uvs":           [...],
  "specularPower": 96.5,
  "ambient":       [0, 0, 0],
  "diffuse":       [0.5, 0.5, 0.5],
  "specular":      [0.5, 0.5, 0.5],
  "alpha":         1
}
```

Some values may be missing from the JSON file, depending on what was provided by
the OBJ and MTL files.
