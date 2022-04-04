import React, { useState, useEffect } from "react";

let Nodes;

export const getNodes = (nodes) => {
  Nodes = nodes;
};
/* 
  This component is to get the created id of the node.
  If I understand it correctly the ids for the node is created
  when the node is rendered and cant be accessed in a easy way
  in the config.
  So I created this component because I can control when I want to
  update the node id and it's easier to check if the nodes object has been updated.

  This has a potential for bugs:
   1. I assume that the node that has been selected to render is
      in the last position of the nodes object.
      I have not seen any other behavior but maybe there is some edge cases.

   2. If you can save the state of the nodes for later use then I need to extend this
      to be able to handle that as well.

   3. If you have a set of default nodes all of those nodes gets the same id
      this is a default behavior from Flume I think. but it breaks my custom logic
      and needs to be handled.
*/
export const CreateId = ({ onChange }) => {
  const [id, setId] = useState("");
  const [aleadyHasId, setAleadyHasId] = useState(false);
  const [nodes, setNodes] = useState(Nodes);
  const nodeObj = Nodes;

  useEffect(() => {
    onChange(id);
  }, [id]);

  useEffect(() => {
    if (!aleadyHasId && JSON.stringify(nodeObj) !== JSON.stringify(nodes)) {
      const nodeIds = Object.keys(nodeObj);
      setId(nodeIds[nodeIds.length - 1]);
      setAleadyHasId(true);
    }
  }, [nodeObj]);
  return <div></div>;
};
