import React, { useEffect, useState } from "react";
import { NodeEditor } from "flume";
import config from "./config";

import { getContext, deleteContextKey, template, getTags } from "./states";
import { getNodes } from "./CreateId";

const initialData = {
  banan: "banan",
  fisk: "fisk",
  another: "another",
  moreStrings: "moreString",
  wowAnotherString: "wowAnotherString"
};
export default function App() {
  const [nodes, setNodes] = useState({});
  const [displayData, setDisplayData] = useState(JSON.stringify(getContext()));

  useEffect(() => {
    getNodes(nodes);
    deleteContextKey(nodes);
    setDisplayData(JSON.stringify(getContext(), null, 2));
  }, [nodes]);

  return (
    <div style={{ width: 800, height: 600 }}>
      <NodeEditor
        portTypes={config.portTypes}
        nodeTypes={config.nodeTypes}
        nodes={nodes}
        context={initialData}
        onChange={setNodes}
        debug={true}
      />

      <h3>Context Data</h3>
      <p>{displayData}</p>

      <h3>Template</h3>
      <p>{JSON.stringify(template, null, 2)}</p>

      <h3>Tag</h3>
      <p>{JSON.stringify(getTags(), null, 2)}</p>
    </div>
  );
}
