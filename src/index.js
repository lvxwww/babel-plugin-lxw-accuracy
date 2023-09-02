const Decimal = require("decimal.js");

const OPERATIONS_MAP = {
  "+": "add",
  "-": "sub",
  "*": "mul",
  "/": "div",
};
const OPERATIONS = Object.keys(OPERATIONS_MAP);

module.exports = function ({ template: template, types: t }) {
  return {
    visitor: {
      BinaryExpression: {
        exit: function (path) {
          const operator = path.node.operator;
          //判断是否是 加减乘除的其中一种
          if (!OPERATIONS.includes(operator)) return;
          let new_node_left = path.node.left,
            new_node_right = path.node.right;
          //如果是变量，则找到真实的值 递归找下
          while (t.isIdentifier(new_node_left) && new_node_left?.name) {
            new_node_left = path.scope.getBinding(new_node_left.name).path.node.init;
          }
          while (t.isIdentifier(new_node_right) && new_node_right?.name) {
            new_node_right = path.scope.getBinding(new_node_right.name).path.node.init;
          }
          //判断处理过的，同为数字继续
          if (t.isNumericLiteral(new_node_left) && t.isNumericLiteral(new_node_right)) {
            //判断是否为小数
            if (isDecimal(new_node_left.value) || isDecimal(new_node_right.value)) {
              const accuracy_res = new Decimal(new_node_left.value)
                [OPERATIONS_MAP[operator]](new_node_right.value)
                .toNumber();
              path.replaceWith(t.valueToNode(accuracy_res));
            }
          }
          return;
        },
      },
    },
  };
};

//判断是否为小数
function isDecimal(num) {
  Number.isInteger =
    Number.isInteger ||
    function (value) {
      return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
  return !Number.isInteger(num);
}
