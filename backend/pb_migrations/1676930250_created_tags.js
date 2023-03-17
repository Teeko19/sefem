migrate((db) => {
  const collection = new Collection({
    "id": "ez3u6l0mb8w95j1",
    "created": "2023-02-20 21:57:30.047Z",
    "updated": "2023-02-20 21:57:30.047Z",
    "name": "tags",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "c3ydeyqh",
        "name": "title",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "m73pthjn",
        "name": "icon",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "dhcncdtx",
        "name": "thumbnails",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 10,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/heic"
          ],
          "thumbs": []
        }
      }
    ],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ez3u6l0mb8w95j1");

  return dao.deleteCollection(collection);
})
