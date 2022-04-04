// import { RootEngine } from "flume";
// import config from "./config";
// let treatedObject;
// const resolvePorts = (portType, data) => {
//   switch (portType) {
//     case "string":
//       return data.string;
//     case "select":
//       return data.selectkey;
//     case "customCondition":
//       return data.cC;
//     case "object":
//       return data.object;
//     default:
//       return data;
//   }
// };
// const resolveNodes = (node, inputValues, nodeType, context) => {
//   switch (node.type) {
//     case "getKeyValue":
//       let keyValue = context.initialData[inputValues.keyIn];
//       const type = typeof keyValue;
//       if (typeof keyValue === "object") {
//         keyValue = keyValue.toString();
//       }
//       treatedObject = { value: keyValue, type: type };
//       return {
//         outputObject: treatedObject
//       };
//     default:
//       return inputValues;
//   }
// };
// export const engine = new RootEngine(config, resolvePorts, resolveNodes);
