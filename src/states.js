/* 
  the variable that's displayed as "Context Data".
  The idea is to construct the information about the values and operations
  in this variable.
 */
let context = {};

export const getContext = () => context;
export const getContextByKey = (key) => context[key] ?? "";
export const deleteContextKey = (nodes) => {
  for (let i = 0; i < Object.keys(context).length; i++) {
    if (!(Object.keys(context)[i] in nodes))
      delete context[Object.keys(context)[i]];
  }
};

// Template
export const template = {
  materials: { catergory: "", type: "", value: "" },
  maskintvatt: { degrees: "" }
};

export const updateTemplate = (
  key,
  subkey,
  value,
  updateFromContext = false
) => {
  if (updateFromContext) {
    template[key][subkey] = context[value].value;
  } else {
    template[key][subkey] = value;
  }
};

export const resetTemplate = (key, subkey) => (template[key][subkey] = "");

// Tags
let tags = {};
export const getTags = () => tags;
export const addToTag = (id, value) => (tags[id] = value);
export const removeTag = (id) => delete tags[id];

/* 
  getKeyValue
  can be cleaned up now when all nodes has a unique id 
*/
export const KeyValueAndtypeConstrutor = () => {
  let keyValueAndtype = "initialized";

  const getKeyValueAndtype = () => keyValueAndtype;

  const updateKeyValueAndtype = (id, newState) => {
    keyValueAndtype = newState;
    context[id] = keyValueAndtype;
    return keyValueAndtype;
  };
  return { getKeyValueAndtype, updateKeyValueAndtype };
};

// conditionNode
export const ConditionInstructionsConstrutor = (data) => {
  const localSavedData = data;
  let conditionInstructions = [];

  const UpdateConditionInstrutions = (input = null) => {
    let inputKeys;
    if (input) {
      inputKeys = Object.keys(input).filter((el) => el.includes("-con"));
    }

    const dataKeys = Object.keys(localSavedData);
    for (let i = 0; i < dataKeys.length; i++) {
      let operation;
      let condition;
      dataKeys.forEach((el) =>
        el.includes(i + "-op") ? (operation = localSavedData[el].operator) : ""
      );
      if (inputKeys.includes(`${i}-con`)) {
        const index = inputKeys.indexOf(`${i}-con`);
        condition = context[input[inputKeys[index]][0].nodeId]?.value;
      } else {
        dataKeys.forEach((el) =>
          el.includes(i + "-con") ? (condition = localSavedData[el].string) : ""
        );
      }
      if (operation && condition && !conditionInstructions[i]) {
        conditionInstructions.push({
          operation: operation,
          condition: condition
        });
      }
    }
  };

  const EvaluateConditions = (key) => {
    if (context) {
      let resultArray = [];
      conditionInstructions.forEach(({ operation, condition }) => {
        switch (operation) {
          case "equal":
            return resultArray.push(condition === context[key]?.value);
          case "notequal":
            return resultArray.push(condition !== context[key]?.value);
          case "contains":
            return resultArray.push(context[key]?.value.includes(condition));
          case "notcontains":
            return resultArray.push(!context[key]?.value.includes(condition));
          case "ends":
            return resultArray.push(context[key]?.value.endsWith(condition));
          case "notends":
            return resultArray.push(!context[key]?.value.endsWith(condition));
          case "starts":
            return resultArray.push(context[key]?.value.startsWith(condition));
          case "notstarts":
            return resultArray.push(!context[key]?.value.startsWith(condition));
          default:
            return "ERR";
        }
      });
      if (localSavedData.andOr.andor === "and") {
        context[localSavedData.createId.id] = resultArray.includes(false)
          ? false
          : true;
      } else {
        context[localSavedData.createId.id] = resultArray.includes(true)
          ? true
          : false;
      }
    }
  };

  return { UpdateConditionInstrutions, EvaluateConditions };
};

export const createVocabId = (id, value) =>
  (context[id] = Math.floor(Math.random() * value.length));
