import { VNode } from "vue";

const VNode = (props: { node: () => VNode }): VNode => {
    return props.node();
};

export default VNode;
