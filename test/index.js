var assert = require("assert");
var parse = require("../index.js");
var fs = require("fs");
var path = require("path")

describe("obj-parser", function() {
  describe("#parse(obj, mtl)", function() {
    it("should return an array of vertices, faces, normals, and uv coordinates", function() {
      // Reading files as strings.
      var obj = fs.readFileSync(path.join(__dirname, "./data/test.obj"), "utf-8");
      var mtl = fs.readFileSync(path.join(__dirname, "./data/test.mtl"), "utf-8");

      var data = parse(obj, mtl);

      assert.equal(data.vertices.length, 8);
      assert.equal(data.faces.length, 12);
      assert.equal(data.normals.length, 12);
      assert.equal(data.uvs.length, 0);
    });
  });
});
