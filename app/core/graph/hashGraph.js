import md5 from 'js-md5';

const filterGraph = (graphObject) => {
  const newGraphObject = [];

  graphObject['cells'].forEach((element) => {
    if (element.type == 'link') {
      newGraphObject.push({
        id: element.id,
        source: element.source.id,
        target: element.target.id
      });
    }else{
      newGraphObject.push({
        id: element.id,
        parameters: element.dfGui.parameters
      });
    }
  });


  // Order by IDs, so we have consistence string for hashing, as changed order would
  // change the hash
  return newGraphObject.sort((a, b) => a.id.localeCompare(b.id));
};

export default function hashGraph(graphObject) {
  const filteredGraph = filterGraph(graphObject);
  return md5(JSON.stringify(filteredGraph));
}
