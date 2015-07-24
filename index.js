"use strict";

/**
 * Takes an OBJ file and an MTL file, and produces a JSON file with the data.
 * @param {string} obj: the contents of an OBJ file, parsed to a string.
 * @param {string} mtl: the contents of the matching MTL file, parsed to a string.
 */
function parse(obj, mtl) {
  var obj_data = parseObj(obj);
  var material = parseMaterialName(obj);
  var mtl_data = parseMtl(mtl, material);

  var data = {};

  // Combine OBJ and MTL data into single object.
  [obj_data, mtl_data].forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
      data[key] = obj[key];
    });
  });

  return data;
}

/**
 * Parse the OBJ file, append to an object and return object.
 * @param {string} obj: contents of an OBJ file.
 */
function parseObj(obj) {

  // Check type of obj file (should be a string or a buffer.)
  if (obj instanceof Buffer) {
    obj = obj.toString("utf-8");
  }

  var data = {
    vertices: [],
    faces: [],
    normals: [],
    uvs: []
  };

  obj.split("\n").forEach(function(line) {
    var split = line.split(" ");

    switch(split[0]) {

      case "v":
        // Vertex data.
        var v3 = split.slice(1).map(function(item) {
          return parseFloat(item);
        });

        data.vertices.push(v3);
        break;

      case "vn":
        // Normal data. Needs to be duplicated for triangles.
        var v3 = split.slice(1).map(function(item) {
          return parseFloat(item);
        });

        // Push twice to duplicate normals.
        data.normals.push(v3, v3);
        break;

      case "vt":
        // UV coordinates.
        var v2 = split.slice(1).map(function(item) {
          return parseFloat(item);
        });

        data.uvs.push(v2);
        break;

      case "f":
        // Faces: In our case, each face must be decomposed from a quad to two
        // triangles, as this is what ThreeJS accepts.
        var quad = split.slice(1).map(function(item) {
          return item.split("/")[0];
        });

        var faces = [
          quad.slice(0, 3).map(function(item) { return parseInt(item) - 1; }),
          [].concat(quad.slice(0, 1), quad.slice(-2)).map(function(item) {
            return parseInt(item) - 1;
          })
        ];

        faces.forEach(function(face) {
          data.faces.push(face);
        });
        break;
      default:
        break;
    }
  });

  return data;
}

/**
 * Parse the MTL file, appending relevant data to the data object.
 * @param {string} mtl: contents of an MTL file.
 * @param {Object} data: the data object you are appending information to.
 */
function parseMtl(mtl, material) {
  if (mtl instanceof Buffer) {
    mtl = mtl.toString("utf-8");
  }
  
  var data = {};

  mtl.replace(/newmtl/gi, ",newmtl").split(",").filter(function(block) {
    return block.indexOf(material) > -1;
  })[0].split("\n").forEach(function(line) {
    var split = line.split(" ");

    switch(split[0]) {
      case "Ns":
        // Specular power.
        data.specularPower = parseFloat(split[1]);
        break;
      case "Ka":
        // Ambient Light
        data.ambient = split.slice(1).map(function(val) {
          return parseFloat(val);
        });
        break;
      case "Kd":
        // Diffuse Light
        data.diffuse = split.slice(1).map(function(val) {
          return parseFloat(val);
        });
        break;
      case "Ks":
        // Specular light
        data.specular = split.slice(1).map(function(val) {
          return parseFloat(val);
        });
        break;
      case "d":
      case "Tr":
        // Dissolved/Transparent
        data.alpha = parseFloat(split[1]);
        break;
      case "Tf":
        data.emissive = parseFloat(split[1]);
        break;
      default:
        break;
    }

  });

  return data;
}

/**
 * Gets the material from the obj file marked by `usemtl`.
 * @param {string} obj: the OBJ file that you're pulling the material name from.
 */
function parseMaterialName(obj) {
  if (obj instanceof Buffer) {
    obj = obj.toString("utf-8");
  }

  return obj.split("\n").filter(function(line) {
    return line.indexOf("usemtl") > -1;
  })[0].split(" ")[1];
}

module.exports = parse;
