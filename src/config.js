import { FlumeConfig, Colors, Controls } from "flume";
import { AddRemoveInputs } from "./AddRemoveInputs";
import { CreateId } from "./CreateId";
import {
  KeyValueAndtypeConstrutor,
  ConditionInstructionsConstrutor,
  getContext,
  getContextByKey,
  template,
  updateTemplate,
  resetTemplate,
  createVocabId,
  addToTag,
  removeTag
} from "./states";

/*
  Colors:
    String: purple,
    Boolean: blue,
    Number: Red,
    hiddenPorts: grey (does not matter but for consistency)
*/

const config = new FlumeConfig();
config
  .addPortType({
    type: "vocabId",
    name: "vocabId",
    label: "Vocab id",
    color: Colors.red,
    controls: [Controls.number({ name: "vocabId", label: "Vocab id" })]
  })
  .addPortType({
    type: "string",
    name: "string",
    label: "Text",
    color: Colors.purple,
    acceptTypes: ["string", "object"],
    controls: [
      Controls.text({
        name: "string",
        label: "Text"
      })
    ]
  })
  .addPortType({
    type: "select",
    name: "select",
    label: "Select Key",
    hidePort: true,
    color: Colors.grey,
    controls: [
      Controls.select({
        name: "selectkey",
        label: "keys",
        options: [],
        getOptions: (inputData, context) => {
          const keys = Object.keys(context);
          const options = [];
          keys.map((el) => {
            return options.push({
              value: el,
              label: el
            });
          });
          return options;
        }
      })
    ]
  })
  .addPortType({
    type: "object",
    name: "object",
    label: "{Value, typeof}",
    color: Colors.purple,
    controls: [Controls.text({ name: "object", label: "object" })]
  })
  .addPortType({
    type: "addSubProts",
    name: "addSubProts",
    label: "add or sub ports",
    hidePort: true,
    color: Colors.grey,
    controls: [
      Controls.custom({
        name: "buttons",
        label: "Buttons",
        defaultValue: 1,
        render: (data, onChange) => {
          return <AddRemoveInputs data={data} onChange={onChange} />;
        }
      })
    ]
  })
  .addPortType({
    type: "stringOperator",
    name: "stringOperator",
    label: "Operator",
    color: Colors.grey,
    hidePort: true,

    controls: [
      Controls.select({
        name: "operator",
        label: "Operator",
        options: [
          { value: "equal", label: "equal (=)" },
          { value: "notequal", label: "not equal (!=)" },
          { value: "contains", label: "Contains" },
          { value: "notcontains", label: "Not contains" },
          { value: "ends", label: "Ends with" },
          { value: "notends", label: "Not ends with" },
          { value: "starts", label: "Starts with" },
          { value: "notstarts", label: "Not starts with" }
        ],
        defaultValue: ""
      })
    ]
  })
  .addPortType({
    type: "andOr",
    name: "andOr",
    label: "And / Or",
    color: Colors.gray,
    hidePort: true,
    controls: [
      Controls.select({
        name: "andor",
        label: "And / Or",
        options: [
          { value: "and", label: "And" },
          { value: "or", label: "or" }
        ],
        defaultValue: "and"
      })
    ]
  })
  .addPortType({
    type: "boolean",
    name: "boolean",
    label: "True/False",
    color: Colors.blue,
    controls: [Controls.checkbox({ name: "boolean", label: "boolean" })]
  })
  .addPortType({
    type: "templateList",
    name: "templateList",
    label: "Template List",
    color: Colors.grey,
    hidePort: true,
    controls: [
      Controls.select({
        label: "Select Template",
        name: "selectTemplate",
        options: [],
        getOptions: () => {
          const options = [];
          Object.keys(template).forEach((el) =>
            options.push({ value: el, label: el })
          );
          return options;
        }
      })
    ]
  })
  .addPortType({
    // Every node needs to use this as input to get the id of the node
    type: "createId",
    name: "createId",
    label: "create Id",
    color: Colors.grey,
    hidePort: true,
    controls: [
      Controls.custom({
        name: "id",
        label: "id",
        defaultValue: "",
        render: (data, onChange) => {
          return <CreateId onChange={onChange} />;
        }
      })
    ]
  })
  .addPortType({
    type: "search",
    name: "search",
    label: "Search",
    color: Colors.grey,
    hidePort: true,
    controls: [
      Controls.select({
        name: "search",
        label: "search",
        options: [
          { value: "", label: "Clear selected" },
          { value: "123", label: "123" },
          { value: "321", label: "321" }
        ]
      })
    ]
  })
  .addNodeType({
    type: "templateNode",
    label: "Add template",
    description: "Add a template",
    inputs: (ports) => (data, { inputs, outputs }) => {
      const addedInputs = [];

      if (data.templateList && data.templateList.selectTemplate) {
        const selectedTemplateKey = Object.keys(
          template[data.templateList.selectTemplate]
        );

        selectedTemplateKey.forEach((el) => {
          addedInputs.push(ports.string({ label: el, name: el }));
        });

        if (inputs && inputs.boolean && getContext()) {
          /*
          Checks if the name if the output connection from condition node
          matches the result of condition node.
          This example fires only if it's false and false or true and true
          This check can be a utility function
          */
          const bool =
            inputs.boolean[0].portName ===
            getContextByKey(inputs.boolean[0].nodeId).toString();

          if (bool) {
            selectedTemplateKey.forEach((el) => {
              // Checks if there is any inputs
              if (inputs && inputs[el]) {
                updateTemplate(
                  data.templateList.selectTemplate,
                  el,
                  inputs[el][0].nodeId,
                  true
                );
              }
              // checks if user has typed anything in any of the textareas
              else if (data[el]) {
                updateTemplate(
                  data.templateList.selectTemplate,
                  el,
                  data[el].string
                );
              } else {
                resetTemplate(data.templateList.selectTemplate, el);
              }
            });
          }
        }
      }
      return [
        ports.templateList(),
        ...addedInputs,
        ports.boolean(),
        ports.createId()
      ];
    }
  })
  .addNodeType({
    type: "getKeyValue",
    label: "Get value of key",
    description: "Gets the value and type of a key",
    inputs: (ports) => ({ keyIn, createId }, connections, context) => {
      // constructs the "memory" for the node
      const construct = KeyValueAndtypeConstrutor();

      if (keyIn) {
        /*
         gets the value from the context param that's passed in by the
         nodeEditor
         */
        let keyValue = context[keyIn.selectkey];
        if (typeof context[keyIn.selectkey] === "object") {
          keyValue = context[keyIn.selectkey].toString();
        }
        if (createId && keyValue) {
          /* 
          add the value, type of value and id 
          to the "context" variable in states.js
          */
          construct.updateKeyValueAndtype(createId.id, {
            value: keyValue,
            type: typeof context[keyIn.selectkey]
          });
        }
      }
      return [ports.select({ label: "Key", name: "keyIn" }), ports.createId()];
    },
    outputs: (ports) => [ports.object({ name: "getKeyValue" })]
  })
  .addNodeType({
    type: "conditionNode",
    label: "Custom Condition",
    description: "Build your own condition",
    inputs: (ports) => (data, { inputs, outputs }, context) => {
      let inputsCount = data?.addSubProts?.buttons;
      /* 
      When removing inputs the data is not updated correctly
      so this if statements makes sure there is as many keys 
      in data as inputs on the node
      */
      if (`${inputsCount}-op` in data) {
        delete data[`${inputsCount}-op`];
      }
      if (`${inputsCount}-con` in data) {
        delete data[`${inputsCount}-con`];
      }

      let addedPorts = [];
      while (inputsCount > 0) {
        inputsCount--;
        addedPorts.push(
          ports.string({ name: `${inputsCount}-con`, label: "condition" })
        );
        addedPorts.push(ports.stringOperator({ name: `${inputsCount}-op` }));
      }

      // construct the "memory" of the node
      const conditionConstructor = ConditionInstructionsConstrutor(data);

      conditionConstructor.UpdateConditionInstrutions(inputs);
      /*
      The evaluate conditions can only be fired if the "input" input 
      is connected to something that has a reference 
      in the "context" variable in states.js
      */
      if (inputs && inputs.input) {
        conditionConstructor.EvaluateConditions(inputs?.input[0]?.nodeId);
      }

      return [
        ports.andOr(),
        ports.string({ label: "input", name: "input" }),
        ...addedPorts.reverse(),
        ports.addSubProts(),
        ports.createId()
      ];
    },
    outputs: (ports) => [
      ports.boolean({ label: "True", name: "true" }),
      ports.boolean({ label: "False", name: "false" })
    ]
  })
  .addNodeType({
    type: "mapVocab",
    label: "Map Vocab",
    description: "Map Vocab",
    inputs: (ports) => ({ string, createId }, { inputs, outputs }) => {
      if (inputs && inputs.string && createId) {
        createVocabId(createId.id, inputs.string[0].nodeId);
      } else if (string && string.string && createId) {
        createVocabId(createId.id, string.string);
      }
      return [ports.string(), ports.createId()];
    },
    outputs: (ports) => [ports.vocabId()]
  })
  .addNodeType({
    type: "addTag",
    label: "Add Tag",
    description: "Add Tag",
    inputs: (ports) => ({ vocabId, search, createId }, { inputs, outputs }) => {
      if (search?.search && createId) {
        addToTag(createId.id, search?.search);
        return [ports.search(), ports.createId()];
      } else if ((vocabId?.vocabId || inputs?.vocabId) && createId) {
        addToTag(
          createId.id,
          vocabId?.vocabId || getContextByKey(inputs?.vocabId[0].nodeId)
        );
        return [ports.vocabId(), ports.createId()];
      } else {
        removeTag(createId?.id);
        return [ports.vocabId(), ports.search(), ports.createId()];
      }
    }
  });

export default config;
