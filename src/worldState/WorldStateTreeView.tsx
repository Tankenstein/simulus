import React, { useMemo, createRef, useState, useLayoutEffect } from 'react';
import { Ref, Segment } from 'semantic-ui-react';
import TreeView from 'react-d3-tree';

import { groupBy } from '../utils';

const nodeStyles = {
  circle: {
    fill: '#e8e8e8',
    strokeWidth: 1,
    stroke: 'rgba(0,0,0,.6)',
  },
};

/**
 * Renders a graph of all world states
 * @param param0 props
 */
const WorldStateTreeView = ({
  nodes,
  onSelectState,
}: {
  nodes: WorldStateNode[];
  onSelectState: (id: string) => any;
}) => {
  const [translationState, setTranslationState] = useState({ x: 25, y: 0 });
  const treeContainer = createRef<HTMLElement>();
  const tree = buildWorldStateTree(nodes);

  // re-center the graph when we render
  useLayoutEffect(() => {
    setTranslationState({
      x: 25,
      y: treeContainer.current ? treeContainer.current.getBoundingClientRect().height / 2 : 0,
    });
  }, [treeContainer.current]);

  return (
    <Ref innerRef={treeContainer}>
      <Segment style={{ width: '100%', overflowX: 'auto', padding: 0 }}>
        <TreeView
          data={tree || { _id: 'new', name: 'new', children: [] }}
          collapsible={false}
          nodeSize={{ x: 100, y: 25 }}
          zoomable={true}
          translate={translationState}
          onClick={event => {
            const id = (event as GraphNode)._id;
            if (id && id !== 'new') {
              onSelectState(id);
            }
          }}
          transitionDuration={0}
          nodeSvgShape={{ shape: 'circle', shapeProps: { r: 10 } }}
          styles={{
            nodes: {
              node: nodeStyles,
              leafNode: nodeStyles,
            },
            links: {
              stroke: '#e8e8e8',
              strokeWidth: 2,
            },
          }}
        />
      </Segment>
    </Ref>
  );
};

export default WorldStateTreeView;

/**
 * Represents one node in the world state graph
 */
export type WorldStateNode = NewWorldStateNode | CommitedWorldStateNode;

type NewWorldStateNode = BaseWorldStateNode<WorldStateNodeType.TRANSITION>;
type CommitedWorldStateNode = BaseWorldStateNode<WorldStateNodeType.STATE> & {
  id: string;
};

export enum WorldStateNodeType {
  TRANSITION = 'transition',
  STATE = 'committed',
}

interface BaseWorldStateNode<Type extends WorldStateNodeType> {
  type: Type;
  previousWorldStateId?: string;
}

function buildWorldStateTree(states: WorldStateNode[]): GraphNode | undefined {
  let firstWorldState: WorldStateNode | undefined = undefined;
  const statesByPreviousStateId = groupBy(states, item => {
    if (!item.previousWorldStateId) {
      firstWorldState = item;
    }
    return item.previousWorldStateId ? item.previousWorldStateId : '';
  });
  return firstWorldState ? walkWorldStates(firstWorldState, statesByPreviousStateId) : undefined;
}

function walkWorldStates(
  current: WorldStateNode,
  next: { [previousId: string]: WorldStateNode[] },
): GraphNode {
  if (current.type === WorldStateNodeType.TRANSITION) {
    return {
      _id: 'new',
      name: 'New',
      children: [],
    };
  } else {
    return {
      _id: current.id,
      name: current.id.substring(0, 5),
      children: next[current.id] ? next[current.id].map(leaf => walkWorldStates(leaf, next)) : [],
    };
  }
}

interface GraphNode {
  _id: 'new' | string;
  name: string;
  children: GraphNode[];
}
