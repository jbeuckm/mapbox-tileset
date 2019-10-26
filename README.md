# Mapbox Tilesets API CLI

Operate the tilesets API to upload and generate tilesets for your Mapbox maps.

The [tilesets API](https://docs.mapbox.com/api/maps/#tilesets) works with two basic entities: the `tileset-source` and the `tileset`. To generate a tile layer for a map, you need to upload one or more files to a `tileset-source` and then create a "recipe" that specifies which sources at which zoom levels should appear in a generated `tileset`.

### Create a tileset-source

`mapbox-tileset source create <source-id> <geometry-file>`

### Add data to a tileset-source

`mapbox-tileset source create <source-id> <geometry-file-2>`

To generate a `tileset` from a `tileset-source`, use a `recipe` to specify which sources will be available at which zoom levels. The recipe for the `tileset` takes this form:

```
{
  "name": "My Tileset's Name",
  "recipe": {
    "version": 1,
    "layers": {
      "layer_id": {
        "source": "mapbox://tileset-source/my-username/my-tileset-source",
        "minzoom": 2,
        "maxzoom": 12
      }
    }
  }
}
```

With an available `tileset-source` and a `recipe.json` file like the above example,

### Create a tileset

`mapbox-tileset tileset create <tileset-id> <recipe.json file>`

Finally, to generate the tileset that will be usable in a Mapbox map,

### Publish a tileset

`mapbox-tileset tileset publish <tileset-id>`

This step generates a job that can take quite a while to complete, depending on the number of zoom levels required and how much geographical area is included in the geometry sources.

### Check tileset status

`mapbox-tileset tileset status <tileset-id>`

## Miscellaneous commands:

### List available tileset-sources

`mapbox-tileset source list`

### Delete a tileset-source

`mapbox-tileset source delete <source-id>`

### List available tilesets

`mapbox-tileset tileset list`

### Delete a tileset

`mapbox-tileset tileset delete <tileset-id>`